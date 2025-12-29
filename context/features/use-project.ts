"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

//? To create a new project(mutation)
export const useCreateProject = ()=>{

    const router  = useRouter() 

    return useMutation({
        mutationFn : async (prompt: string)=>{
            const response = await axios.post('/api/project', { prompt })
            return response.data
        },
        onSuccess : (data)=>{
            router.push(`/project/${data.data.id}`)
        },
        onError : (error)=>{
            console.log("Project failed", error)
            toast.error("Failed to create project")
        }   
    })
}

//? To get recent projects(query)
export const useGetRecentProjects = ()=>{
    return useQuery({
        queryKey : ['projects'],
        queryFn : async ()=>{
            const response = await axios.get('/api/project')
            return response.data
        },
    })
}