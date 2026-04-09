import { LoadingStatusProp } from "@/packages/utils/types/canvas-context";
import { Spinner } from "../ui/spinner";
import { cn } from "@/packages/utils/lib/utils";
import { CheckCircle2 } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  fetching: "Loading Project",
  running: "Starting Pipeline",
  analyzing: "Analyzing Prompt",
  generating: "Generating Screens",
  finalizing: "Finalizing",
  complete: "Complete",
};

export function CanvasLoader({
  status,
}: {
  status?: LoadingStatusProp | "fetching" | "finalizing";
}) {
  const isComplete = status === "complete";
  const label = status ? STATUS_LABELS[status] || status : "";

  return (
    <div
      className={cn(
        `min-w-40 max-w-full px-4 pt-1.5 pb-2
        rounded-full shadow-md flex items-center space-x-2
        transition-colors duration-300
      `,
        status === "fetching" && "bg-gray-500 text-white",
        status === "running" && "bg-amber-500 text-white",
        status === "analyzing" && "bg-blue-500 text-white",
        status === "generating" && "bg-purple-500 text-white",
        status === "finalizing" && "bg-green-500 text-white",
        status === "complete" && "bg-emerald-500 text-white"
      )}
    >
      {isComplete ? (
        <CheckCircle2 className="w-6 h-6" />
      ) : (
        <Spinner className="w-6 h-6 stroke-3!" />
      )}
      <span className="text-lg font-semibold">{label}</span>
    </div>
  );
}

