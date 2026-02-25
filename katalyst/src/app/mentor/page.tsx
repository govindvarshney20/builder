"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { streamGemini } from "@/lib/gemini";
import { getProgress, saveProgress } from "@/lib/storage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION =
  "You are Katalyst AI Mentor, an expert Product Management coach. You help PMs at all levels improve their skills, prepare for interviews, understand AI/ML product management, and make better product decisions. Be concise, actionable, and use real-world examples. When relevant, suggest frameworks and methodologies. Focus on practical advice over theory. If asked about non-PM topics, gently redirect to PM-relevant discussions.";

const QUICK_PROMPTS = [
  "How do I write better PRDs?",
  "Explain AI product metrics for PMs",
  "How to transition from engineer to PM?",
  "Help me prepare for a Google PM interview",
  "What makes a great product strategy?",
  "How to prioritize with limited resources?",
];

const MAX_MESSAGES = 50;

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // Italic
    .replace(/(?<!\w)\*(?!\s)(.*?)(?<!\s)\*(?!\w)/g, "<em>$1</em>")
    .replace(/(?<!\w)_(?!\s)(.*?)(?<!\s)_(?!\w)/g, "<em>$1</em>")
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'
    )
    // Headers
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-lg font-semibold mt-4 mb-1.5">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>'
    )
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />')
    // Unordered list items
    .replace(
      /^[\-\*] (.+)$/gm,
      '<li class="ml-4 list-disc list-outside mb-1">$1</li>'
    )
    // Ordered list items
    .replace(
      /^\d+\. (.+)$/gm,
      '<li class="ml-4 list-decimal list-outside mb-1">$1</li>'
    )
    // Double newlines
    .replace(/\n\n/g, "<br/><br/>")
    // Single newlines
    .replace(/\n/g, "<br/>");

  return html;
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [pmLevel, setPmLevel] = useState<string>("Aspiring PM");
  const [pmType, setPmType] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history and user info from localStorage on mount
  useEffect(() => {
    const progress = getProgress();
    if (progress.chatHistory && progress.chatHistory.length > 0) {
      const loaded = progress.chatHistory.slice(-MAX_MESSAGES) as Message[];
      setMessages(loaded);
    }
    setPmLevel(progress.level || "Aspiring PM");
    setPmType(progress.pmType || null);
  }, []);

  // Scroll to bottom on new messages or streaming updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 150) + "px";
    }
  }, []);

  // Persist chat history to localStorage
  const persistMessages = useCallback((msgs: Message[]) => {
    const trimmed = msgs.slice(-MAX_MESSAGES);
    saveProgress({ chatHistory: trimmed });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsStreaming(true);
      setStreamingContent("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Build context from recent messages
      const contextMessages = updatedMessages
        .slice(-10)
        .map(
          (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
        )
        .join("\n\n");

      const prompt = `Here is the conversation so far:\n\n${contextMessages}\n\nPlease respond to the user's latest message.`;

      try {
        const fullText = await streamGemini(
          prompt,
          (chunk: string) => {
            setStreamingContent(chunk);
          },
          SYSTEM_INSTRUCTION
        );

        const assistantMessage: Message = {
          role: "assistant",
          content: fullText,
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        persistMessages(finalMessages);
        setStreamingContent("");
      } catch {
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again in a moment.",
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
        persistMessages(finalMessages);
        setStreamingContent("");
      } finally {
        setIsStreaming(false);
        textareaRef.current?.focus();
      }
    },
    [messages, isStreaming, persistMessages]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingContent("");
    saveProgress({ chatHistory: [] });
    textareaRef.current?.focus();
  }, []);

  return (
    <div
      className="fade-in flex flex-col"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-5 sm:p-6 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  AI PM Mentor
                </h1>
                <p className="text-white/80 text-sm mt-0.5">
                  Your personal product management coach, powered by AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* PM Level & Type Badge */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {pmLevel}
                </span>
                {pmType && (
                  <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {pmType}
                  </span>
                )}
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="flex-shrink-0 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear Chat
                </button>
              )}
            </div>
          </div>
          {/* Mobile PM badges */}
          <div className="flex sm:hidden items-center gap-2 mt-3">
            <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {pmLevel}
            </span>
            {pmType && (
              <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {pmType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto rounded-xl bg-white border border-border mb-3"
      >
        <div className="p-4 sm:p-6 space-y-4 min-h-full flex flex-col">
          {/* Empty state with quick prompts */}
          {messages.length === 0 && !isStreaming && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Ask me anything about PM
              </h2>
              <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">
                I can help you with product strategy, interview prep, AI/ML
                concepts, career growth, frameworks, and much more. Pick a
                topic below or type your own question.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full transition-colors border border-purple-200 hover:border-purple-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-3"
                    : "bg-gray-50 text-foreground border-l-4 border-l-purple-500 rounded-2xl rounded-bl-md pl-4 pr-4 py-3 shadow-sm border border-border"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                      Katalyst Mentor
                    </span>
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed prose-content ${
                    msg.role === "user" ? "text-white" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.content),
                  }}
                />
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[75%] bg-gray-50 text-foreground border-l-4 border-l-purple-500 rounded-2xl rounded-bl-md pl-4 pr-4 py-3 shadow-sm border border-border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                    Katalyst Mentor
                  </span>
                </div>
                {streamingContent ? (
                  <div
                    className="text-sm leading-relaxed prose-content"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(streamingContent),
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-1.5 py-2">
                    <span
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Quick Prompts - shown inline when there are messages */}
      {messages.length > 0 && !isStreaming && (
        <div className="flex-shrink-0 mb-2 -mt-1">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="flex-shrink-0 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border border-purple-200 hover:border-purple-300 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 bg-white border border-border rounded-xl p-3 shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask your PM mentor anything..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted disabled:opacity-50 resize-none leading-relaxed max-h-[150px] py-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isStreaming ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Thinking...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-muted mt-2 pl-0.5">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
