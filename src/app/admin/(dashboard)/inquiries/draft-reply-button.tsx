"use client";
import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function DraftReplyButton({ inquiryId }: { inquiryId: number }) {
  const { messages, sendMessage, status } = useChat({
    id: `inquiry-${inquiryId}`,
    transport: new DefaultChatTransport({
      api: "/api/reply-draft",
      body: { inquiryId },
    }),
  });

  const draft = messages.findLast((m) => m.role === "assistant");
  const draftText = draft?.parts.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "";
  const busy = status === "submitted" || status === "streaming"

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => sendMessage({ text: "Write a reply to this inquiry." })}
        className="min-h-11 rounded-full border border-gold px-5 text-gold transition-colors hover:bg-gold hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
      >
        {busy ? "Drafting" : "Draft reply"}
      </button>
      {draftText && (
        <p aria-live="polite" className="whitespace-pre-wrap text-sm leading-relaxed">
          { draftText } 
        </p>
      )}
    </div>
  );
}
