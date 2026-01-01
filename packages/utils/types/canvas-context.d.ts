import { ThemeType } from "@/packages/database/lib/canvas-theme";
import { FrameProps } from "./project";

export interface CanvasContextProps {
  theme?: ThemeType;
  themes: ThemeType[];
  setTheme: (id: string) => void;

  frames: FrameProps[];
  setFrames: (frames: FrameProps[]) => void;
  updateFrame: (id: string, frameData: Partial<FrameProps>) => void;
  addFrame: (frame: FrameProps) => void;

  selectedFrameId: string | null;
  selectedFrame: FrameProps | null;
  setSelectedFrameId: (id: string | null) => void;

  loadingStatus: LoadingStatusProp;
}

type LoadingStatusProp =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "complete";
