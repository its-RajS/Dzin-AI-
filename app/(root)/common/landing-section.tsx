"use client"
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'
import AIPromptInput from '@/components/lib/ai-prompt-input'
import Prism from '@/components/Prism'
import React, { useState } from 'react'
import Header from './header'
import { suggestions_list } from '@/packages/utils/suggestion-list'

const LandingSection = () => {
    const [promptText, setPromptText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSuggestionClick = (suggestion: string) => {
        setPromptText(suggestion)
    }   
  return (
    <div className="w-full min-h-screen">
        <div className="flex flex-col">
            <Header/>

            <div className="relative overflow-hidden pt-28">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
                    <div className="space-y-3">
                        <h1 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight">
                            Design mobile apps <br className='md:hidden'/> 
                            <span className='text-primary'>with AI</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-center font-medium sm:text-lg leading-relaxed text-foreground">
                           Go from idea to beautiful app mockups in minutes.    
                        </p>
                    </div>
                    <div className="flex w-full max-w-3xl flex-col relative item-center gap-8 z-10 pt-4">
                        <div className="w-full">
                            <AIPromptInput
                                className='ring-2 ring-primary/80 rounded-3xl'
                                promptText={promptText}
                                setPromptText={setPromptText}
                                isLoading={isLoading}
                                onSubmit={()=>{}}
                            />
                        </div>
                        {/* //! Suggestion area */}
                        <div className="flex flex-wrap justify-center gap-2 px-5">
                            <Suggestions>
                                {
                                    suggestions_list.map((s)=> (
                                        <Suggestion
                                            key={s.label}
                                            suggestion={s.value}
                                            className='text-sm! h-7! px-2 py-1'
                                            onClick={()=> handleSuggestionClick(s.value)}
                                        >
                                            {s.icon}
                                            <span>{s.label}</span>
                                        </Suggestion>
                                    ))
                                }
                            </Suggestions>
                        </div>
                    </div>
                    {/* //! Background */}
                    <div 
                    className="absolute -translate-x-1/2
                    left-1/2 w-[5000px] h-[3000px] top-[80%]
                    -z-10">
                        <div 
                            className="-translate-x-1/2 absolute
                            bottom-[calc(100%-300px)] left-1/2
                            h-[2000px] w-[2000px]
                            opacity-20 bg-radial-primary"
                        ></div>
                        <div
                            className="absolute -mt-2.5
                            size-full rounded-[50%]
                            bg-primary/20 opacity-70
                            [box-shadow:0_-15px_24.8px_var(--primary)]"
                        ></div>
                        <div
                            className="absolute z-0 size-full
                            rounded-[50%] bg-background"
                        ></div>
                    </div>
                    {/* <div className='absolute top-0 -z-10 size-full mask-[linear-gradient(to_bottom,white_30%,transparent_80%)]' >
                        <Prism
                            animationType="hover"
                            timeScale={0.5}
                            height={3.5}
                            baseWidth={5.5}
                            scale={3.6}
                            hueShift={0}
                            colorFrequency={1}
                            noise={0.5}
                            glow={1}
                        />
                    </div> */}
                </div> 
            </div>
            <div className="w-full py-10">
                <div className="max-w-3xl mx-auto">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Recent Projects
                        </h1>
                    </div>
                </div>
            </div>
        </div>  
    </div>
  )
}

export default LandingSection