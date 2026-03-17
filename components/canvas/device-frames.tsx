import { TOOL_HAND_ENUM, ToolModeType } from '@/constants/canvas'
import { useCanvasContext } from '@/context/canvas-provider'
import { getHTMLWrapper } from '@/packages/database/lib/html-wrapper'
import React, { useRef, useState } from 'react'
import {Rnd} from "react-rnd"

type DeviceFrameProps = {
    html : string,
    frameId: string
    title?: string,
    width?: number,
    minHeight?: number | string,
    initialPostion?: {
        x: number, y: number
    },
    scale?: number,
    tool_mode: ToolModeType,
    theme_style?: string
}

const DeeviceFrame = ({
    html = 'html',
    frameId,
    title = "Utitled",
    width = 420,
    minHeight = 800,
    initialPostion = {
        x: 0, y: 0
    },
    scale = 1,
    tool_mode,
    theme_style
}: DeviceFrameProps) => {
    const {selectedFrameId, setSelectedFrameId} = useCanvasContext()
    const [frameSize, setFrameSize] = useState({
        width,
        height: minHeight
    })
    const iFrame = useRef<HTMLIFrameElement>(null)
    const iseSelected = selectedFrameId === frameId
    const fullHTMl = getHTMLWrapper(
        html,
        title,
        frameId,
        theme_style
    )

  return (
    <Rnd
    default={{
        x: 0,
        y:0,
        width: width,
        height: frameSize.height
    }}
    minWidth={width}
    minHeight={minHeight}
    size={{
        width:frameSize.width,
        height: frameSize.height
    }}
    disableDragging={tool_mode === TOOL_HAND_ENUM.HAND}
    enableResizing={iseSelected && tool_mode !== TOOL_HAND_ENUM.HAND}
    scale={scale}
    onClick= {(e:any) => {
        e.stopPropagation()
        if(tool_mode === TOOL_HAND_ENUM.SELECT) setSelectedFrameId(frameId)
    }}
    resizeHandleComponent={{
        topLeft: iseSelected ? <Handle/> : undefined,
        topRight: iseSelected ? <Handle/> : undefined,
        bottomLeft: iseSelected ? <Handle/> : undefined,
        bottomRight: iseSelected ? <Handle/> : undefined,
    }}
    resizeHandleStyles={{
        top: {cursor: "ns-resize"},
        bottom: {cursor: "ns-resize"},
        left: {cursor: "ew-resize"},
        right: {cursor: "ew-resize"}
    }}
    onResize={(e, direction, ref)=> {
        setFrameSize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height)
        })
    }}
    >

    </Rnd>
  ) 
}

const Handle = () => (
    <div className='z-30 h-4 w-4 bg-white border-2 border-blue-500'/>
)
 
export default DeeviceFrame