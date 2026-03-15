 "use client"

import { useCanvasContext } from "@/context/canvas-provider";
import React, { useState } from "react";
import { CanvasLoader } from "./canvas-loader";
import { cn } from "@/packages/utils/lib/utils";
import FloatingToolBar from "./canvas-floating-toolbar";
import { TOOL_HAND_ENUM, ToolModeType } from "@/constants/canvas";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import CanvasControl from "./canvas-control";

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
    : loadingStatus !== "idle" && loadingStatus !== "complete" ? "generating" : "idle";
 
  const [toolMode, setToolMode] = useState<ToolModeType>(
    TOOL_HAND_ENUM.SELECT 
  )
  const [zoomPercent, setZoomPercent] = useState<number>(53)
  const [currentScale, setCurrentScale] = useState<number>(0.53)
  
  return ( 
    <>
      {/* Outer wrapper with dark background and rounded corners */}
      <div className="relative h-full w-full overflow-hidden bg-[#1f1f1f] rounded-3xl p-4">
        <FloatingToolBar />

        {/* Status Loader */}
        {currentStatus && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <CanvasLoader status={currentStatus} />
          </div>
        )}

        {/* //? Zoom Menu */}
        <TransformWrapper
        initialScale={0.53}
        initialPositionX={40}
        initialPositionY={5}
        minScale={0.1}
        maxScale={3}
        wheel={{step: 0.1}}
        pinch={{step: 0.1}}
        doubleClick={{disabled: true}}
        smooth={true}
        centerOnInit={false}
        centerZoomedOut={false}
        limitToBounds={false }
        onTransformed={(ref) => {
          setZoomPercent(Math.round(ref.state.scale * 100))
          setCurrentScale(ref.state.scale)
        }}
        panning={{
          disabled: toolMode !== TOOL_HAND_ENUM.HAND
        }}
        >
          {({ zoomIn, zoomOut }) => {
            const handleZoomIn = () => zoomIn(0.1)
            const handleZoomOut = () => zoomOut(0.1)

            return (
            <>
              {/* Canvas background with dotted grid */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full p-3 bg-white dark:bg-[#191919] z-0 rounded-2xl",
                  toolMode === TOOL_HAND_ENUM.HAND
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                )}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,0,0,0.75) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "10px 10px",
                }}
              >
                  <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "unset"
                  }}
                  
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "green"
                  }}
                  >
                    <div className="w-50 h-50 bg-blue-500">Box</div>
                  </TransformComponent>
              </div>
              <CanvasControl
                zoomIn={handleZoomIn}
                zoomOut={handleZoomOut}
                zoomPercent={zoomPercent}
                toolMode={toolMode}
                setToolMode={setToolMode}
              />
            </>
            )
          }} 
  
        </TransformWrapper>

      </div>
    </>
  );
};

export default Canvas;
