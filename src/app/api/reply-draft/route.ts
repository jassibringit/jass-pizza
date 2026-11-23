import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { getInquiry } from "@/db/inquiries";
import { REPLY_DRAFT_SYSTEM } from "@/lib/ai/business-rules";
import { describeInquiry } from "@/lib/ai/inquiry-context";
import { getOwnerSession } from "@/lib/require-owner";

export const maxDuration = 30;

// The only shape this route accepts. Anything else is a 400.
const BodySchema = z.object({
    inquiryId: z.number().int().positive(),
    messages: z.array(z.custom<UIMessage>()).min(1).max(20),
});

export async function POST(req: Request) {
    // 1. Who? Owner only, or anyone could spend the OpenAI credit.
    if (!(await getOwnerSession())) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. What? Bad JSON or a wrong shape both end here.
    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    const { inquiryId, messages } = parsed.data;

    // 3. Does it exist?
    const inquiry = await getInquiry(inquiryId);
    if (!inquiry) {
        return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // 4. Only now spend money.
    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: `${REPLY_DRAFT_SYSTEM}\n${describeInquiry(inquiry)}`,
        messages: await convertToModelMessages(messages.slice(-3)),
    });

    return result.toUIMessageStreamResponse();
}
