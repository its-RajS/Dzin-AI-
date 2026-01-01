import { THEME_LIST, ThemeType } from "@/packages/database/lib/canvas-theme";
import {
  CanvasContextProps,
  LoadingStatusProp,
} from "@/packages/utils/types/canvas-context";
import { FrameProps } from "@/packages/utils/types/project";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

const CanvasProvider = ({
  children,
  initialFrames,
  initialThemeID,
  hasInitialFrame,
  projectId,
}: {
  children: React.ReactNode;
  initialFrames: FrameProps[];
  initialThemeID: string;
  hasInitialFrame: boolean;
  projectId: string;
}) => {
  const [themeID, setThemeID] = useState<string>(
    initialThemeID || THEME_LIST[0].id
  );
  const [frames, setFrames] = useState<FrameProps[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusProp>("idle");

  const theme = THEME_LIST.find((theme) => theme.id === themeID);
  const selectedFrame =
    selectedFrameId && frames.length !== 0
      ? frames.find((frame) => frame.id === selectedFrameId) || null
      : null;

  useEffect(() => {
    if (hasInitialFrame) {
      setLoadingStatus("idle");
    }
  }, [hasInitialFrame]);

  useEffect(() => {
    if (initialThemeID) {
      setThemeID(initialThemeID);
    }
  }, [initialThemeID]);

  //? Update loagind with inngest realtime effect

  const addFrame = useCallback((frame: FrameProps) => {
    setFrames((prevFrames) => [...prevFrames, frame]);
  }, []);

  const updateFrame = useCallback(
    (id: string, frameData: Partial<FrameProps>) => {
      setFrames((prevFrames) =>
        prevFrames.map((frame) =>
          frame.id === id ? { ...frame, ...frameData } : frame
        )
      );
    },
    []
  );

  return (
    <CanvasContext.Provider
      value={{
        theme,
        themes: THEME_LIST,
        setTheme: setThemeID,
        frames,
        setFrames,
        updateFrame,
        addFrame,
        selectedFrameId,
        setSelectedFrameId,
        selectedFrame,
        loadingStatus,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
