import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { X, Mountain, Send, MessageCircle, CornerDownRight } from "lucide-react";
import type { CommunityActivity } from "~/constants/community";

export type Comment = {
  id: number;
  seed: string;
  author: string;
  text: string;
  time: string;
};

type Props = {
  activity: CommunityActivity;
  comments: Comment[];
  onClose: () => void;
  onSubmit: (text: string) => void;
  user: User | null;
  onAuthRequired: () => void;
};

export default function ActivityCommentModal({
  activity,
  comments,
  onClose,
  onSubmit,
  user,
  onAuthRequired,
}: Props) {
  const [draft, setDraft] = useState("");
  const [mounted, setMounted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replies, setReplies] = useState<Record<number, Comment[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem("tq_activity_replies") ?? "null") ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tq_activity_replies", JSON.stringify(replies));
    } catch { }
  }, [replies]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      inputRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments.length]);

  useEffect(() => {
    if (replyingTo !== null) {
      setTimeout(() => replyInputRef.current?.focus(), 50);
    }
  }, [replyingTo]);

  function handleSubmitReply(parentId: number, parentAuthor: string) {
    if (!user) { onAuthRequired(); return; }
    const trimmed = replyDraft.trim();
    if (!trimmed) return;
    const seed = user.email?.charAt(0).toUpperCase() ?? "U";
    const author = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "You";
    const newReply: Comment = {
      id: Date.now(),
      seed,
      author,
      text: trimmed,
      time: "Just now",
    };
    setReplies((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] ?? []), newReply],
    }));
    setReplyDraft("");
    setReplyingTo(null);
  }

  function handleSubmit() {
    if (!user) { onAuthRequired(); return; }
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInputFocus() {
    if (!user) {
      onAuthRequired();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
      className={`fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        mounted ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[85dvh] ${
          mounted
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-8 opacity-0 sm:scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
        </div>

        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {activity.group}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                <Mountain className="w-2.5 h-2.5 flex-shrink-0" />
                {activity.trail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer ml-3 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-3"
        >
          {comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground/25 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No comments yet
              </p>
              <p className="text-xs text-muted-foreground/55 mt-1">
                Be the first to leave a comment
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {c.seed}
                  </span>
                  <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {c.text}
                    </p>
                    <button
                      onClick={() => {
                        if (!user) { onAuthRequired(); return; }
                        setReplyingTo(replyingTo === c.id ? null : c.id);
                        setReplyDraft("");
                      }}
                      className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors mt-1.5 cursor-pointer"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      Reply
                    </button>
                  </div>
                </div>

                {(replies[c.id]?.length ?? 0) > 0 && (
                  <div className="ml-9 flex flex-col gap-1.5 pl-3 border-l-2 border-primary/20">
                    {replies[c.id].map((r) => (
                      <div key={r.id} className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {r.seed}
                        </span>
                        <div className="flex-1 bg-muted/40 rounded-xl px-3 py-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[11px] font-semibold text-foreground">
                              {r.author}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {r.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            {r.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === c.id && (
                  <div className="ml-9 flex items-end gap-2 pl-3 border-l-2 border-primary/30">
                    {user && (
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mb-0.5">
                        {user.email?.charAt(0).toUpperCase() ?? "U"}
                      </span>
                    )}
                    <textarea
                      ref={replyInputRef}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitReply(c.id, c.author);
                        }
                        if (e.key === "Escape") {
                          e.stopPropagation();
                          setReplyingTo(null);
                        }
                      }}
                      placeholder={`Reply to ${c.author}…`}
                      rows={1}
                      className="flex-1 resize-none bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors leading-relaxed overflow-hidden"
                      style={{ minHeight: "32px", maxHeight: "72px" }}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = `${Math.min(el.scrollHeight, 72)}px`;
                      }}
                    />
                    <button
                      onClick={() => handleSubmitReply(c.id, c.author)}
                      disabled={!replyDraft.trim()}
                      className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 transition-all cursor-pointer hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
                      aria-label="Send reply"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex-shrink-0 border-t border-border px-4 py-3 flex items-end gap-2 bg-card">
          {user && (
            <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mb-0.5">
              {user.email?.charAt(0).toUpperCase() ?? "U"}
            </span>
          )}
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder={user ? "Write a comment… (Enter to send)" : "Sign in to comment"}
            rows={1}
            className="flex-1 resize-none bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors leading-relaxed overflow-hidden"
            style={{ minHeight: "36px", maxHeight: "96px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!draft.trim()}
            className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 transition-all cursor-pointer hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
