import { generateText, Output } from "ai";
import { inngest } from "../client";
import { z } from "zod";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { FrameProps } from "@/packages/utils/types/project";
import { ANALYSIS_PROMPT } from "@/packages/database/lib/prompt";
import { prisma } from "@/packages/database/lib/prisma";

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
        const { userId, projectId, prompt, frames, theme: existingTheme } = event.data;

        const isRegenerating = frames?.length > 0;

        // ! Analyze the prompt
        const analysis = await step.run("analyze-prompt", async () => {

            const contextHTML = frames.slice(0, 4)?.map((frame: FrameProps) => frame.htmlContent).join("\n")

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



    },
);   