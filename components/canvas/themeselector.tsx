"use client"

import { useCanvasContext } from "@/context/canvas-provider"

const ThemeSelector = () => {
    const {theme: currentTheme, themes, setTheme } = useCanvasContext()

  return (
    <div className="flex flex-col max-h-96" >
        <div className="flex-1 overflow-y-auto px-3 pb-2 ">
            <h3 className="font-semibold  " >Choose a theme</h3>
        </div>

    </div>
  )
}

export default ThemeSelector