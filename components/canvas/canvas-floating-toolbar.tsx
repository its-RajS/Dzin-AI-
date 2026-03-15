"use client"

import { useCanvasContext } from "@/context/canvas-provider"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CameraIcon, ChevronDown, Palette, Save, Wand2 } from "lucide-react"
import { useState } from "react"
import AIPromptInput from "../lib/ai-prompt-input"
import { parseThemeColors } from "@/packages/database/lib/canvas-theme"
import { cn } from "@/packages/utils/lib/utils"
import ThemeSelector from "./themeselector"
import { Separator } from "../ui/separator"

const FloatingToolBar = () => {
    const {theme: currentTheme, themes, setTheme } = useCanvasContext()
    const [promptText, setPromptText] = useState<string>("")

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-full max-w-2xl bg-background dark:bg-gray-900 rounded-full border shadow-xl ">
            <div className="flex flex-row items-center gap-2 px-3 ">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        size="icon-sm"
                        className="px-4 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200/50 cursor-pointer " >
                            <Wand2 className="size-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                    className="w-80 p-2 mt-1 rounded-xl shadow-lg border "
                    >
                        <AIPromptInput 
                            promptText=""
                            setPromptText={setPromptText}
                            className="min-h-[150px] ring-1! ring-purple-500! rounded-xl shadow-none border-muted "
                            SubmitBtn={false}
                        />
                        <Button
                        size="icon-sm"
                        className="mt-2 w-full bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-200/50 cursor-pointer " >
                            Design
                        </Button>
                    </PopoverContent>
                </Popover> 
                <Popover>
                    <PopoverTrigger>
                        <div className="flex items-center px-3 py-2 gap-2 ">
                            <Palette className="size-4" />
                            <div className="flex gap-1.5">
                                {
                                    themes?.slice(0,4)?.map((theme, index)=> {
                                        const colors = parseThemeColors(theme.style)
                                        return (
                                            <div
                                            role="button"
                                            key={index}
                                            onClick={(e)=>{
                                                e.stopPropagation()
                                                setTheme(theme.id)
                                            }}
                                            className={cn(
                                                `w-6 h-6 rounded-full cursor-pointer`,
                                                currentTheme?.id === theme.id && "ring-1 ring-offset-1"
                                            )}
                                            style={{
                                                background: `linear-gradient(135deg, ${colors?.primary}, ${colors?.accent})`
                                            }}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className="flex items-center text-sm gap-1 ">
                                +{themes.length-4} more
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="px-2 border shadow rounded-xl ">
                        <ThemeSelector/>
                    </PopoverContent>
                </Popover>

                <Separator className="h-4!" orientation="vertical" />
                
                <div className="flex items-center gap-2 ">
                    <Button
                     className="rounded-full cursor-pointer"
                     variant="outline"
                     size="icon-sm"
                    >
                        <CameraIcon className="size-4" />
                    </Button>
                    <Button
                     className="rounded-full cursor-pointer"
                     variant="default"
                     size="sm"
                    >
                        <Save className="size-4" />
                        Save
                    </Button>
                </div>

            </div>
        </div> 
    </div>
  )
}

export default FloatingToolBar