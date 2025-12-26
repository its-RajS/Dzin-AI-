"use server"

import { openrouter } from "@/packages/database/lib/openrouter"
import {generateText} from "ai"

export async function generateProjectName(prompt:string){
    try {
        const {text} = await generateText({
            model: openrouter.chat("google/gemini-2.5-flash-lite"),
            system: `
            You are a AI assistant that helps users generate relevant small project names based on their prompts.
            -Keep it under 10 words
            -Keep it catchy
            -Keep it unique
            -Capatilize words accordingly
            -Don't use any special characters
            `,
            prompt: prompt,
        })

        return text?.trim() || 'Untitled project'
    } catch (error) {
        console.log(error)
        return "Untitled project"
    }
}