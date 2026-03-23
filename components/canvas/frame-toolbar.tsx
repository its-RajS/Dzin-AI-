import { cn } from '@/packages/utils/lib/utils';
import { CodeIcon, DownloadIcon, GripVertical } from 'lucide-react';
import React from 'react'
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

type FrameToolBarProps = {
    title: string;
    iseSelected: boolean;
    isDownloading: boolean;
    disabled: boolean;
    scale?: number;
    onDownloadPng: ()=>void;
    onOpenHTMLDialog: ()=>void
}

const FrameToolBar = ({title, iseSelected, isDownloading, disabled, scale = 1.5 , onDownloadPng, onOpenHTMLDialog}: FrameToolBarProps) => {
  return (
    <div className={
        cn(`absolute flex items-center gap-2 rounded-full z-50`,
            iseSelected ? `left-1/2 -translate-x-1/2 border bg-card dark:g-muted pl-2 pr-3 py-2 shadow-sm h-[35px] min-w-[260px] ` : `w-[150px] h-auto left-10 `
        )
    }
    style={{
        top: iseSelected ? '-70px' : "-40px",
        transformOrigin: "center top",
        transform: `scale(${scale})`
    }}
    >
        <div 
        role='button'
        className="flex flex-1 cursor-grab items-center justify-start gap-1.5 active:cursor-grabbing ">
            <GripVertical className='size-4 text-muted-foreground' />
            <div className={
                cn(`min-w-20 text-sm font-medium truncate `, 
                    iseSelected && "w-[100px]"
                )
            }>
                {title}
            </div>
        </div>

        {iseSelected && (
            <>
                <Separator orientation='vertical' className='h-5! bg-border' />
                <Button
                size="icon-sm"
                disabled={disabled}
                variant="ghost"
                className='rounded-full cursor-pointer hover:bg-muted dark:hover:bg-white/40'
                onClick={onOpenHTMLDialog}
                >
                    <CodeIcon/>
                </Button>
                <Button
                size="icon-sm"
                disabled={disabled}
                variant="ghost"
                className='rounded-full cursor-pointer hover:bg-muted dark:hover:bg-white/40'
                onClick={onDownloadPng}
                > 
                    {isDownloading ? <Spinner/> : <DownloadIcon/> }
                </Button>
            </>
        )}
    </div>
  )
}

export default FrameToolBar 