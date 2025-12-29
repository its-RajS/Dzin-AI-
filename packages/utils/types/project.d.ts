export interface ProjectProps {
    id: string
    userId: string
    name: string
    theme?: string
    thumbnail?: string
    frames?: Frame[]
    createdAt: Date
    updatedAt: Date
}

export interface FrameProps{
    id: string
    projectId: string
    project?: Project
    title: string
    htmlContent: string
    createdAt: Date
    updatedAt: Date
}

