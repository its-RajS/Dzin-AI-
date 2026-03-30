import { tool } from 'ai'
import { z } from "zod"

export const unsplashTool = tool({
    description: "Search for high quality images from unsplash, and use this when you need to add <img> tag.",
    inputSchema: z.object({
        query: z.string().describe("Image search query (eg., 'modern loft', 'finance graph', 'food')"),
        orientation: z.enum(["landscape", "portrait", "squarish"]).default("landscape")
    }),
    execute: async ({ query, orientation }) => {
        try {
            const res = await fetch(
                `https://api.unsplash.com/photos/?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1&client_id=${process.env.UNSPLASH_API_ACCESS_KEY}`
            )
            const { result } = await res.json();
            return result?.[0]?.urls?.regular || ""
        } catch {
            return ""
        }
    }
})   