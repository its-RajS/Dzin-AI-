import { generateProjectName } from "@/app/action/action"
import { prisma } from "@/packages/database/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request:Request){
    try {
        const {prompt} = await request.json()
        const user = await currentUser()

        if(!user) throw new Error("Unauthorized")   
        if(!prompt) throw new Error("Prompt is required")

        const userId = user.id

        const projectName = await generateProjectName(prompt)

        const project = await prisma.project.create({
            data:{
                userId,
                name : projectName
            }
        })

        return NextResponse.json({success: true, data: project})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Failed to create project"}, {status:500})
    }
}