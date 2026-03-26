import { inngest } from "../client";
import { z } from "zod";

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

        const analysis = await step.run("analyze-prompt", async () => {

        });

    },
); 