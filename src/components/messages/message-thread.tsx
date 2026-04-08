"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useMessages, useSendMessage, useMarkAsRead } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, MessageCircle, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_CATEGORIES = [
  { label: "😀", emojis: ["😀","😂","🤣","😊","😍","🥰","😘","😎","🤩","🥳","😄","😁","😆","🙂","😉","😋","🤪","😜","😝","🤗"] },
  { label: "💪", emojis: ["💪","🏋️","🔥","⚡","💥","🎯","🏆","🥇","👏","🙌","✅","❌","⭐","💯","🚀","💪🏻","🦾","💦","🏃","🧘"] },
  { label: "🍎", emojis: ["🍎","🥗","🥑","🍗","🥩","🍳","🥛","💧","🍌","🥦","🍚","🥕","🍇","🫐","🥜","🍠","🥒","🍞","🧀","🥚"] },
  { label: "❤️", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔","❣️","💕","💞","💓","💗","💖","💝","♥️","🫶","🤝","👍"] },
  { label: "📝", emojis: ["📝","📊","📈","📉","⏰","🔔","📅","💬","📱","🎉","👋","🤔","😴","🤒","😤","😢","😰","🙏","✨","🌟"] },
];

interface MessageThreadProps {
  conversationId: string;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const t = useTranslations("messages");
  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const { profile } = useAuth();
  const [input, setInput] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiTab, setEmojiTab] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mark as read when viewing
  useEffect(() => {
    if (conversationId) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId, messages?.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || !conversationId) return;
    sendMessage.mutate({ conversationId, content });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages && messages.length === 0 && (
          <div className="text-center py-8">
            <div className="rounded-full bg-muted p-4 inline-flex">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t("noMessages")}
            </p>
          </div>
        )}
        {messages?.map((msg) => {
          const isMe = msg.sender_id === profile?.id;
          return (
            <div
              key={msg.id}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                  isMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2 items-end">
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" side="top" align="start">
            <div className="flex gap-1 border-b pb-1 mb-1">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setEmojiTab(i)}
                  className={cn(
                    "text-lg p-1 rounded hover:bg-accent transition-colors",
                    emojiTab === i && "bg-accent"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-8 gap-0.5 max-h-36 overflow-y-auto">
              {EMOJI_CATEGORIES[emojiTab].emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="text-xl p-1 rounded hover:bg-accent transition-colors"
                  onClick={() => {
                    setInput((prev) => prev + emoji);
                    setEmojiOpen(false);
                    inputRef.current?.focus();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("typeMessage")}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
