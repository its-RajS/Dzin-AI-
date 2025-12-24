export interface PromptInputProps {
  promptText: string;
  setPromptText: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  SubmitBtn?: boolean;
  onSubmit?: () => void;
}