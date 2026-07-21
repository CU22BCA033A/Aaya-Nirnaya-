import { toPng } from "html-to-image";
import { useState, type RefObject } from "react";

interface DownloadResultButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  filename: string;
}

type Status = "idle" | "working" | "done" | "error";

export function DownloadResultButton({ targetRef, filename }: DownloadResultButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleDownload() {
    if (!targetRef.current || status === "working") return;
    setStatus("working");
    try {
      const dataUrl = await toPng(targetRef.current, { pixelRatio: 2, cacheBust: true, skipFonts: true });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2200);
    }
  }

  const label =
    status === "working"
      ? "Preparing image…"
      : status === "done"
        ? "Downloaded ✓"
        : status === "error"
          ? "Couldn't generate — try again"
          : "Download reading as image";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === "working"}
      className="inline-flex items-center gap-2 rounded-full border border-swarna-soft/40 bg-swarna px-5 py-2.5 font-display text-sm font-semibold text-ink-deep transition-colors hover:bg-swarna-soft disabled:cursor-wait disabled:opacity-70"
    >
      <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
        <path
          d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
