"use client";
import { Spinner } from "@/components/ui/spinner";
import { useGetProjectById } from "@/context/features/use-project-id";
import { useParams } from "next/navigation";
import React from "react";
import Header from "./common/header";
import Canvas from "@/components/canvas";
import CanvasProvider from "@/context/canvas-provider";

const Page = () => {
  const params = useParams();
  const id = (params?.id as string) || "";

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useGetProjectById(id);

  const frames = project?.frames || [];
  const themeID = project?.theme || "";

  const hasInitialFrame = frames.length > 0;

  if (projectLoading) return <Spinner />;
  if (projectError) return <div>Failed to load project</div>;

  return (
    <div className="relative h-screen w-full flex flex-col">
      <Header projectName={project?.name || ""} />

      <CanvasProvider
        initialFrames={frames}
        initialThemeID={themeID}
        hasInitialFrame={hasInitialFrame}
        projectId={project?.id || ""}
      >
        <div className="flex overflow-hidden w-full">
          <div className="relative">
            <Canvas />
          </div>
        </div>
      </CanvasProvider>
    </div>
  );
};

export default Page;
