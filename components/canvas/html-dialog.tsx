import { THEME_LIST } from '@/packages/database/lib/canvas-theme';
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CodeBlock, CodeBlockCopyButton, CodeBlockActions, CodeBlockHeader, CodeBlockTitle, CodeBlockFilename } from '../ai-elements/code-block';
import { FileIcon } from 'lucide-react';

type HTMLDialogProps ={
    title?: string;
    html:string;
    theme_style : string; 
    open:boolean;
    onOpenChange: (val: boolean)=> void
}

const HTMLDialog = ({html, theme_style, open , onOpenChange, title}: HTMLDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className='w-full sm:max-w-7xl h-[90vh]' >
            <DialogHeader>
                <DialogTitle>
                    {title || "Untitled"}
                </DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full overflow-y-auto">
                <div>
                <CodeBlock 
                code={html}
                language='html'
                className='w-full h-auto'
                showLineNumbers
                >
                    <CodeBlockHeader>
                        <CodeBlockTitle>
                            <FileIcon size={14} />
                            <CodeBlockFilename>{title || "Untitled"}.html</CodeBlockFilename>
                        </CodeBlockTitle>
                        <CodeBlockActions>
                            <CodeBlockCopyButton />
                        </CodeBlockActions>
                    </CodeBlockHeader>
                </CodeBlock>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default HTMLDialog