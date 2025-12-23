"use client"
import { PromptInputProps } from '@/utils/types/prompt-input'
import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '../ui/input-group'
import { cn } from '@/lib/utils'
import { Spinner } from '../ui/spinner'
import { CornerDownLeftIcon } from 'lucide-react'

const AIPromptInput = ({promptText,setPromptText,isLoading,SubmitBtn=true ,className,onSubmit }:PromptInputProps) => {
  return (
    <div className='bg-background'>
      <InputGroup className={cn('min-h-[170px] rounded-3xl bg-background', className)}>
        <InputGroupTextarea
          className='text-base! py-2.5!'
          placeholder='I want to design an app that is...'
          value={promptText}
          onChange={(e)=>setPromptText(e.target.value)}
        />
        <InputGroupAddon align="block-end" className='flex items-center justify-end'>
          {SubmitBtn && (
            <InputGroupButton 
            className=''
            variant='default'
            size='sm'
            disabled={!promptText?.trim() || isLoading}
            onClick={()=>onSubmit?.()}

            >
              {isLoading ? (
                <Spinner/>  
              ) : (
                <>
                  Design 
                  <CornerDownLeftIcon className='size-4' />
                </>
              )}
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default AIPromptInput