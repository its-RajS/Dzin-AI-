import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { generateUIScreen } from "@/inngest/function/generate.screen";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateUIScreen
  ],
});