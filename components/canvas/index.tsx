import { useCanvasContext } from "@/context/canvas-provider";
import React from "react";
import { CanvasLoader } from "./canvas-loader";
import { cn } from "@/packages/utils/lib/utils";
import FloatingToolBar from "./canvas-flooting-toolbar";

const Canvas = ({
  projectId,
  projectName,
  isPending,
}: {
  projectId: string;
  projectName: string | null;
  isPending: boolean;
}) => {
  const { theme, frames, selectedFrame, setSelectedFrameId, loadingStatus } =
    useCanvasContext();

  const currentStatus = isPending
    ? "fetching" 
    : loadingStatus !== "idle" && loadingStatus !== "complete"
    ? "generating"
    : "idle";

  return ( 
    <>
      <div className="relative h-full w-full overflow-hidden">
        <FloatingToolBar />

        {currentStatus && <CanvasLoader status={currentStatus} />}
        <div
        className={cn(`absolute inset-0 w-full h-full p-3 bg-[#eee] dark:bg-[#242423]`)}
        style={{backgroundImage:"radial-gradient(circle, var(--primary)) 1px, transparent 1px", 
          backgroundSize: "20px 20px"
        }}
        >
          
        </div>
      </div>
    </>
  );
};

export default Canvas;
