export const TOOL_HAND_ENUM = {
    SELECT : "SELECT",
    HAND: "HAND"
} as const

export type ToolModeType = keyof typeof TOOL_HAND_ENUM 