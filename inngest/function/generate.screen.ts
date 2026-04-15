import { generateText, Output, stepCountIs } from "ai";
import { inngest } from "../client";
import { z } from "zod";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { FrameProps } from "@/packages/utils/types/project";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "@/packages/database/lib/prompt";
import { prisma } from "@/packages/database/lib/prisma";
import { BASE_VARIABLES, THEME_LIST } from "@/packages/database/lib/canvas-theme";
import { unsplashTool } from "../tool";
import { pipelineChannel } from "../channel";

const analysisSchema = z.object({
    theme: z.string().describe("The specific visual theme ID. (eg., 'glassmorphism', 'neumorphism', 'minimalist', 'dark mode', etc.)"),
    screens: z.array(
        z.object({
            id: z.string().describe("Unique identifier for the screen. Use kebab-case and include the screen name. (eg., 'home-screen', 'profile-screen', 'settings-screen')"),
            name: z.string().describe("A Short descriptive name for the screen. (eg., 'Home', 'Profile', 'Settings')"),
            purpose: z.string().describe("One clear sentence describing what this screen accomplishes and its role in the app. "),
            visualDescription: z.string().describe("A dense, high-fidelity visual directive (like a prompt for a image generation model). Describe layout, specific data-examples (eg.,'Oct-Nov'), component heirachy, and physical attributes of the screen (eg., 'Chunky cards', 'Soft shadows', 'Floating headers', 'Glassmorphism', 'Bottom Navigation Bar', 'Header with user avatar')."),

        })
    )
        .min(1)
        .max(4)
})

export const generateUIScreen = inngest.createFunction(
    { id: "generate-ui-screen", triggers: [{ event: "ui/generate.screen" }] },
    async ({ event, step }) => {
        const { userId, projectId, prompt, frames, theme: existingTheme, runId } = event.data;

        const isRegenerating = Array.isArray(frames) && frames?.length > 0;

        // ! Generate Inngest Realtime
        const ch = pipelineChannel({ runId });
        await step.realtime.publish("start", ch.status, {
            status: "running",
            message: "Pipeline started",
            projectId,
        });

        console.log("🚀 Starting...");
        await step.realtime.publish("analyzing", ch.status, {
            status: "analyzing",
            message: "Analyzing prompt",
            projectId,
        });
        console.log("🚀 Starting analysis...");
        // ! Analyze the prompt
        const analysis = await step.run("analyze-prompt", async () => {

            // * realtime inngest update

            const contextHTML = isRegenerating ? frames.slice(0, 4)?.map((frame: FrameProps) => frame.htmlContent).join("\n") : " "

            //? check if it is regenerated
            const analysisPrompt = isRegenerating ?
                `
                USER_REQUEST: ${prompt},
                SELECTED_THEME: ${existingTheme},   
                CONTEXT_HTML: ${contextHTML}
            `.trim()
                :
                `
                USER_REQUEST: ${prompt},
            `.trim()


            const { output } = await generateText({
                model: openrouter.chat("google/gemini-2.5-flash-lite"),
                output: Output.object({
                    schema: analysisSchema,
                }),
                system: ANALYSIS_PROMPT,
                prompt: analysisPrompt,
            })

            console.log("🚀 Starting analysis...");

            const themeToUse = isRegenerating ? existingTheme : output.theme;

            //* Update the theme in the project schema
            if (!isRegenerating)
                await prisma.project.update({
                    where: {
                        id: projectId,
                        userId: userId
                    },
                    data: { theme: themeToUse },
                })

            return { ...output, themeToUse }
        });

        // * realtime inngest update
        await step.realtime.publish("generation-start", ch.status, {
            status: "generating",
            totalScreens: analysis.screens.length,
            projectId,
        });

        //! Analyze and generate each screen
        for (let i = 0; i < analysis.screens.length; i++) {
            const screen = analysis.screens[i];
            const selectedTheme = THEME_LIST.find((theme) => theme.id === analysis.themeToUse);
            const themeStyle = selectedTheme ? selectedTheme.style : THEME_LIST[0].style;

            //* Combine theme style and base variable
            const fullTheme = `
            ${themeStyle || ""}
            ${BASE_VARIABLES}
            `
            let finalHTML = ""

            //* realtime inngest update
            await step.realtime.publish(`screen-${i}-start`, ch.status, {
                status: "generating",
                message: `Generating screen ${i + 1}`,
                screen: i + 1,
                totalScreens: analysis.screens.length,
                projectId,
            });

            await step.run(`generate-screen-${i}`, async () => {
                const result = await generateText({
                    model: openrouter.chat("openai/gpt-4o-mini"),
                    system: GENERATION_SYSTEM_PROMPT,
                    tools: {
                        searchUnsplash: unsplashTool
                    },
                    stopWhen: stepCountIs(5),
                    prompt: `
                    - Screen ${i + 1}/${analysis.screens.length}
                    - Screen ID: ${screen.id}
                    - Screen Name: ${screen.name}
                    - Screen Purpose: ${screen.purpose}

                    VISUAL DESCRIPTION: ${screen.visualDescription}
                    THEME STYLE (Use these for colors): ${fullTheme}

                    CRITICAL REQUIREMENTS:
                    1. **Generate ONLY raw HTML markup for this mobile app screen using Tailwind CSS.**
                    Use Tailwind classes for layout, spacing, typography, shadows, etc.
                    Use theme CSS variables ONLY for color-related properties (bg-[var(--background)], text-[var(--foreground)], border-[var(--border)], ring-[var(--ring)], etc.)

                    2. **All content must be inside a single root <div> that controls the layout.**
                    - No overflow classes on the root.
                    - All scrollable content must be in inner containers with hidden scrollbars: [&::-webkit-scrollbar]:hidden scrollbar-none

                    3. **For absolute overlays (maps, bottom sheets, modals, etc.):**
                    - Use \`relative w- full h - screen\` on the top div of the overlay.

                    4. **For regular content:**
                    - Use \`w - full h - full min - h - screen\` on the top div.

                    5. **Do not use h-screen on inner content unless absolutely required.**
                    - Height must grow with content; content must be fully visible inside an iframe.

                    6. **For z-index layering:**
                    - Ensure absolute elements do not block other content unnecessarily.

                    7. **Output raw HTML only, starting with <div>.**
                    - Do not include markdown, comments, <html>, <body>, or <head>.

                    8. **Hardcode a style only if a theme variable is not needed for that element.**

                    9. **Ensure iframe-friendly rendering:**
                    - All elements must contribute to the final scrollHeight so your parent iframe can correctly resize.

                    Generate the complete, production-ready HTML for this screen now

                    `.trim(),
                })
                finalHTML = result.text ?? "";
                const match = finalHTML.match(/<div[^>]*>([\s\S]*)<\/div>/);
                finalHTML = match ? match[0] : finalHTML;
                finalHTML = finalHTML.replace(/```html/g, "").replace(/```/g, "");

                //Create frames
                const frame = await prisma.frame.create({
                    data: {
                        projectId: projectId,
                        title: screen.name,
                        htmlContent: finalHTML,
                    },
                });

                //* realtime inngest update

                return { success: true, frame: frame }
            })

            await step.realtime.publish(`screen-${i}`, ch.screens, {
                projectId,
                currentScreen: i + 1,
                totalScreens: analysis.screens.length,

                screen: {
                    id: screen.id,
                    name: screen.name,
                    html: finalHTML,
                },
            });
        }

        //* realtime inngest update — after ALL screens are done
        await step.realtime.publish("finalizing", ch.status, {
            status: "finalizing",
            message: "Finalizing screens",
            projectId,
        });

        await step.realtime.publish("complete", ch.status, {
            status: "complete",
            message: "All screens generated",
            projectId,
        });
        // await Promise.all(
        //     analysis.screens.map((screen, i) =>
        //         step.run(`generate-screen-${i}`, async () => {
        //             const screen = analysis.screens[i];
        //             const selectedTheme = THEME_LIST.find((theme) => theme.id === analysis.themeToUse);
        //             const themeStyle = selectedTheme ? selectedTheme.style : THEME_LIST[0].style;

        //             //* Combine theme style and base variable
        //             const fullTheme = `
        //                 ${themeStyle || ""}
        //                 ${BASE_VARIABLES}
        //                 `

        //             const result = await generateText({
        //                 model: openrouter.chat("google/gemini-2.5-flash-lite"),
        //                 system: GENERATION_SYSTEM_PROMPT,
        //                 tools: {
        //                     searchUnsplash: unsplashTool
        //                 },
        //                 stopWhen: stepCountIs(5),
        //                 prompt: `
        //     - Screen ${i + 1}/${analysis.screens.length}
        //     - Screen ID: ${screen.id}
        //     - Screen Name: ${screen.name}
        //     - Screen Purpose: ${screen.purpose}

        //     VISUAL DESCRIPTION: ${screen.visualDescription}
        //     THEME STYLE (Use these for colors): ${fullTheme}

        //     CRITICAL REQUIREMENTS:
        //     1. **Generate ONLY raw HTML markup for this mobile app screen using Tailwind CSS.**
        //     Use Tailwind classes for layout, spacing, typography, shadows, etc.
        //     Use theme CSS variables ONLY for color-related properties (bg-[var(--background)], text-[var(--foreground)], border-[var(--border)], ring-[var(--ring)], etc.)

        //     2. **All content must be inside a single root <div> that controls the layout.**
        //     - No overflow classes on the root.
        //     - All scrollable content must be in inner containers with hidden scrollbars: [&::-webkit-scrollbar]:hidden scrollbar-none

        //     3. **For absolute overlays (maps, bottom sheets, modals, etc.):**
        //     - Use \`relative w- full h - screen\` on the top div of the overlay.

        //     4. **For regular content:**
        //     - Use \`w - full h - full min - h - screen\` on the top div.

        //     5. **Do not use h-screen on inner content unless absolutely required.**
        //     - Height must grow with content; content must be fully visible inside an iframe.

        //     6. **For z-index layering:**
        //     - Ensure absolute elements do not block other content unnecessarily.

        //     7. **Output raw HTML only, starting with <div>.**
        //     - Do not include markdown, comments, <html>, <body>, or <head>.

        //     8. **Hardcode a style only if a theme variable is not needed for that element.**

        //     9. **Ensure iframe-friendly rendering:**
        //     - All elements must contribute to the final scrollHeight so your parent iframe can correctly resize.

        //     Generate the complete, production-ready HTML for this screen now

        //     `.trim(),
        //             });

        //             const finalHTML = result.text ?? "";

        //             await prisma.frame.create({
        //                 data: {
        //                     projectId,
        //                     title: screen.name,
        //                     htmlContent: finalHTML,
        //                 },
        //             });


        //             await step.realtime.publish(`screen-${i}`, ch.screens, {
        //                 projectId,
        //                 currentScreen: i + 1,
        //                 totalScreens: analysis.screens.length,
        //                 screen: {
        //                     id: screen.id,
        //                     name: screen.name,
        //                     html: finalHTML,
        //                 },
        //             });
        //         })
        //     )
        // );
    },
);    