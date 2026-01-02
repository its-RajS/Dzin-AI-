import { LoadingStatusProp } from "@/packages/utils/types/canvas-context";
import { Spinner } from "../ui/spinner";
import { cn } from "@/packages/utils/lib/utils";

export function CanvasLoader({
  status,
}: {
  status?: LoadingStatusProp | "fetching" | "finalizing";
}) {
  return (
    <div
      className={cn(
        `absolute top-4 left-1/2 -translate-x-1/2 min-w-40
      max-w-full px-4 pt-1.5 pb-2
      rounded-br-xl rounded-bl-xl shadow-md
      flex items-center space-x-2 z-20
    `,
        status === "fetching" && "bg-gray-500 text-white",
        status === "running" && "bg-amber-500 text-white",
        status === "analyzing" && "bg-blue-500 text-white",
        status === "generating" && "bg-purple-500 text-white",
        status === "finalizing" && "bg-green-500 text-white"
      )}
    >
      <Spinner className="w-4 h-4 stroke-3!" />
      <span className="text-sm font-semibold capitalize">
        {status === "fetching" ? "Loading Project" : status}
      </span>
    </div>
  );
}
