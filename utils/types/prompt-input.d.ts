export interface PromptInputProps {
    promptText: string
    setPromptText: (text: string) => void
    isLoading?: boolean
    SubmitBtn?:boolean
    className?: string
    onSubmit: () => void
}   