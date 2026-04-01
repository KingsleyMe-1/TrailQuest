"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Camera,
  User as UserIcon,
  Settings,
  CreditCard,
  LogOut,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { supabase } from "~/lib/supabase";
import { useTheme } from "~/hooks/useTheme";

interface ProfileMenuProps {
  user: User;
}

function getInitials(user: User): string {
  const name: string =
    user.user_metadata?.full_name ?? user.email ?? "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata?.avatar_url ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP or GIF images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be under 2 MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateErr } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateErr) throw updateErr;

      setAvatarUrl(publicUrl);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    router.replace("/");
  }

  const displayName: string =
    user.user_metadata?.full_name ?? user.email ?? "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer flex items-center justify-center bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(user)}</span>
        )}
        {uploading && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-popover-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          {uploadError && (
            <div className="px-4 py-2 text-xs text-destructive bg-destructive/10 border-b border-destructive/20">
              {uploadError}
            </div>
          )}

          <div className="py-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer disabled:opacity-50"
              role="menuitem"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>{uploading ? "Uploading…" : "Change Photo"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
              aria-label="Upload profile photo"
            />

            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              role="menuitem"
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              role="menuitem"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              role="menuitem"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
              <span className="flex-1 text-left">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              role="menuitem"
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Billing</span>
            </button>
          </div>

          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
