// inngest/channel.ts
import { realtime, staticSchema } from "inngest";
import { z } from "zod";

export const pipelineChannel = realtime.channel({
    name: ({ runId }: { runId: string }) => `pipeline:${runId}`,

    topics: {
        // 🔹 Progress / state
        status: {
            schema: z.object({
                status: z.enum(["idle", "running", "analyzing", "generating", "complete"]),
                message: z.string().optional(),
                screen: z.number().optional(),
                totalScreens: z.number().optional(),
                projectId: z.string(),
            }),
        },

        // 🔹 Generated UI data
        screens: {
            schema: z.object({
                projectId: z.string(),
                currentScreen: z.number(),
                totalScreens: z.number(),

                screen: z.object({
                    id: z.string(),
                    name: z.string(),
                    html: z.string(),
                }),
            }),
        },

        // 🔹 AI streaming (optional but powerful)
        tokens: {
            schema: staticSchema<{ token: string }>(),
        },
    },
});