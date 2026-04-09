import { inngest } from "@/inngest/client";
import { pipelineChannel } from "@/inngest/channel";
import { getClientSubscriptionToken } from "inngest/react";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const runId = searchParams.get("runId");

    if (!runId) {
        return new Response("Missing runId", { status: 400 });
    }

    const token = await getClientSubscriptionToken(inngest, {
        channel: pipelineChannel({ runId }),
        topics: ["status", "screens", "tokens"],
    });

    return NextResponse.json(token);
}