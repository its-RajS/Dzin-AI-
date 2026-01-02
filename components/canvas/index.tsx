import { useCanvasContext } from "@/context/canvas-provider";
import React from "react";
import { CanvasLoader } from "./canvas-loader";

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
        {/* <FloatingToolBar/> */}

        {currentStatus && <CanvasLoader status={currentStatus} />}
      </div>
    </>
  );
};

export default Canvas;
