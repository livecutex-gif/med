"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircleHeart, SendHorizonal, X } from "lucide-react";
import {
  ASSISTANT_OPENING,
  ASSISTANT_SUGGESTIONS,
  assistantReply,
} from "@/lib/assistant";

interface Message {
  role: "bot" | "user";
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: ASSISTANT_OPENING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function ask(raw: string) {
    const question = raw.trim();
    if (!question || typing) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setTyping(true);
    const reply = assistantReply(question);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setTyping(false);
    }, 650 + Math.random() * 500);
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open administrative information assistant"
        aria-expanded={open}
        className="group fixed bottom-6 right-6 z-[70] grid h-[60px] w-[60px] place-items-center rounded-full bg-teal text-white shadow-[0_14px_38px_-8px_rgba(10,126,130,0.65)] transition-transform hover:scale-105 active:scale-95"
      >
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-teal" />
        <span className="relative">
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircleHeart className="h-7 w-7" />
          )}
        </span>
      </button>

      <section
        aria-label="Administrative assistant"
        className={`fixed bottom-[98px] right-4 z-[70] flex w-[380px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-[0_30px_80px_-20px_rgba(12,43,68,0.45)] transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.96] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[0.95rem] font-bold leading-tight">
                MediCare Assistant
              </p>
              <p className="text-[0.68rem] text-white/60">
                Administrative information only
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="h-[300px] space-y-3 overflow-y-auto bg-paper px-4 py-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[0.76rem] leading-relaxed ${
                message.role === "bot"
                  ? "rounded-tl-sm bg-white text-navy shadow-sm ring-1 ring-line"
                  : "ml-auto rounded-tr-sm bg-navy text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
          {typing ? (
            <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-line">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-teal"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          ) : null}

          {messages.length <= 1 && !typing ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {ASSISTANT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-full border border-teal/25 bg-mint px-3 py-1.5 text-[0.68rem] font-bold text-teal transition-colors hover:bg-teal hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          className="flex items-center border-t border-line bg-white"
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={300}
            placeholder="Ask about appointments, hours…"
            aria-label="Your question"
            className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[0.82rem] text-navy outline-none placeholder:text-[#9db0bd]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || typing}
            className="mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal text-white transition-all hover:bg-teal-dark disabled:opacity-40"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </section>
    </>
  );
}
