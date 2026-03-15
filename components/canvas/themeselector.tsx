"use client"

import { useCanvasContext } from "@/context/canvas-provider"
import { parseThemeColors, ThemeType } from "@/packages/database/lib/canvas-theme"
import { cn } from "@/packages/utils/lib/utils"
import { CheckIcon } from "lucide-react"

const ThemeSelector = () => {
    const {theme: currentTheme, themes, setTheme } = useCanvasContext()

  return (
    <div className="flex flex-col max-h-96" >
        <div className="flex-1 overflow-y-auto px-3 pb-2 ">
            <h3 className="font-semibold mb-2 text-sm">Choose a theme</h3>
            <div className="py-2 space-y-3">
                {themes.map((theme) => (
                    <ThemeItem
                        key={theme.id}
                        theme={theme}
                        isSelected={currentTheme?.id === theme.id}
                        onSelect={() => setTheme(theme.id)}
                    />
                ))}
            </div>
        </div>

    </div>
  )
}

function ThemeItem({
    theme,
    isSelected,
    onSelect
}: {
    theme: ThemeType;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const colors = parseThemeColors(theme.style)
    return (
        <button
        role="button"
        onClick={onSelect}
        className={cn(
            `flex items-center justify-between w-full border rounded-xl bg-background gap-4 px-1 `,
            isSelected ? "border-2" :"border"

        )}
        style={{
            borderColor: isSelected  ? colors?.primary : ""
        }}
        >
        <div className="flex gap-2">
            {
                ["primary" , "secondary", "accent" , "muted"].map((key)=>(
                    <div 
                    key={key}
                    className="w-4 h-4 rounded-full border"
                    style={{
                        backgroundColor: colors[key],
                        borderColor : "#eee"
                    }}
                    />
                ))
            }
        </div>
        <div className="flex items-center justify-between gap-2 flex-1">
            <span className="text-sm">{theme.name}</span>
            {
                isSelected && <CheckIcon size={16} color={colors.primary}  />
            }
        </div>
        </button>
    )
}

export default ThemeSelector