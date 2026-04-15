"use client";
import { THEME_LIST, ThemeType } from "@/packages/database/lib/canvas-theme";
import {
  CanvasContextProps,
  LoadingStatusProp,
} from "@/packages/utils/types/canvas-context";
import { FrameProps } from "@/packages/utils/types/project";
import { useRealtime } from "inngest/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

const CanvasProvider = ({
  children,
  initialFrames,
  initialThemeID,
  hasInitialFrame,
  projectId,
  runId
}: {
  children: React.ReactNode;
  initialFrames: FrameProps[];
  initialThemeID: string;
  hasInitialFrame: boolean;
  projectId: string;
  runId: string
}) => {
  const [themeID, setThemeID] = useState<string>(
    initialThemeID || THEME_LIST[0].id
  );
  const [frames, setFrames] = useState<FrameProps[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusProp>("idle");
  const skeletonsAddedRef = useRef(false);

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

  //? Update loading with inngest realtime effect
  const isValidProject = projectId && projectId !== "undefined";

  const { messages } = useRealtime({
    channel: isValidProject ? `pipeline:${projectId}` : "",
    topics: ["status", "screens", "tokens"],
    token: () => {
      if (!isValidProject) return Promise.resolve("");
      return fetch(`/api/realtime-token?runId=${projectId}`)
        .then((r) => r.json())
    }
  });

  // 🔥 Handle realtime updates
  useEffect(() => {
    if (!messages?.all?.length) return;

    const latest = messages.all[messages.all.length - 1];

    // ✅ STATUS
    if (latest.topic === "status") {
      const data = latest.data as {
        status?: LoadingStatusProp;
        message?: string;
        screen?: number;
        totalScreens?: number;
        projectId?: string;
      };

      const newStatus = data.status || "idle";
      setLoadingStatus(newStatus);

      // Reset skeleton tracker on a new run
      if (newStatus === "running") {
        skeletonsAddedRef.current = false;
      }

      // Add skeleton placeholder frames when generation begins
      if (
        newStatus === "generating" &&
        data.totalScreens &&
        !skeletonsAddedRef.current
      ) {
        skeletonsAddedRef.current = true;
        const skeletons: FrameProps[] = Array.from(
          { length: data.totalScreens },
          (_, i) => ({
            id: `skeleton-${Date.now() + i}-${i}`,
            projectId: data.projectId || projectId,
            title: `Screen ${i + 1}`,
            htmlContent: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            iLoading: true,
          })
        );
        setFrames((prev) => [...prev, ...skeletons]);
      }

      // Auto-reset to idle after completion and clean up leftover skeletons
      if (newStatus === "complete") {
        setFrames((prev) => prev.filter((f) => !f.iLoading));
        setTimeout(() => {
          setLoadingStatus("idle");
        }, 2000);
      }
    }

    // ✅ SCREENS (IMPORTANT)
    if (latest.topic === "screens") {
      const data = latest.data as {
        projectId: string;
        currentScreen: number;
        totalScreens: number;
        screen: {
          id: string;
          name: string;
          html: string;
        };
      };

      const newFrame: FrameProps = {
        id: data.screen.id,
        title: data.screen.name,
        htmlContent: data.screen.html,
        projectId: data.projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setFrames((prev) => {
        // Replace the first skeleton placeholder if one exists
        const skeletonIdx = prev.findIndex((f) => f.iLoading === true);
        if (skeletonIdx !== -1) {
          const updated = [...prev];
          updated[skeletonIdx] = newFrame;
          return updated;
        }
        return [...prev, newFrame];
      });
    }

    // ✅ TOKENS (optional)
    if (latest.topic === "tokens") {
      const data = latest.data as { token: string };
      console.log("Streaming token:", data.token);
    }
  }, [messages]);

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
