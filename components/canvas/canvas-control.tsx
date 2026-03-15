import { TOOL_HAND_ENUM, ToolModeType } from '@/constants/canvas'
import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/packages/utils/lib/utils'
import { HandIcon, MinusIcon, MousePointerIcon, PlusIcon } from 'lucide-react'
import { Separator } from '../ui/separator'

type CanvasControlProps = {
    zoomIn: () => void,
    zoomOut: () => void,
    zoomPercent: number,
    toolMode: ToolModeType,
    setToolMode: (toolMode: ToolModeType) => void
}

const CanvasControl = ({
    zoomIn,
    zoomOut,
    zoomPercent,
    toolMode,
    setToolMode
}: CanvasControlProps) => {
  return (
    <div className="absolute -translate-x-1/2 left-1/2 bottom-4 flex items-center gap-3 rounded-full border bg-black dark:bg-muted text-white! px-4 py-1.5 shadow-md  ">
        <div className="flex items-center gap-1">
            <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
                "rounded-full cursor-pointer text-white! hover:bg-white/20!",
                toolMode === TOOL_HAND_ENUM.SELECT && "bg-white/20"
            )}
            onClick={()=> setToolMode(TOOL_HAND_ENUM.SELECT) }
            >
                <MousePointerIcon/>
            </Button>
            <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
                "rounded-full cursor-pointer text-white! hover:bg-white/20!",
                toolMode === TOOL_HAND_ENUM.HAND && "bg-white/20"
            )}
            onClick={()=> setToolMode(TOOL_HAND_ENUM.HAND) }
            >
                <HandIcon/>
            </Button>
        </div>

        <Separator className="h-4!" orientation="vertical" />

        <div className="flex items-center gap-1">
            <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
                "rounded-full cursor-pointer text-white! hover:bg-white/20!",
            )}
            onClick={zoomOut}
            >
                <MinusIcon/>
            </Button>
            <div className='min-w-10 text-sm text-center' >
                {zoomPercent}%
            </div>
            <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
                "rounded-full cursor-pointer text-white! hover:bg-white/20!",
            )}
            onClick={zoomIn}
            >
                <PlusIcon/>
            </Button>
        </div> 

    </div>
  )
}

export default CanvasControl