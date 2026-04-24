"use client";

import { useEffect, useRef, useState } from "react";
import { sheetCellUrl, MISSING, type Sourced } from "@/lib/config";

type Props = {
  src: Sourced;
  spreadsheetId: string;
  display: string;
  className?: string;
};

export function Ref({ src, spreadsheetId, display, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };

  const url = sheetCellUrl(src, spreadsheetId);
  const fullRef = `'${src.tab}'!${src.cell}`;

  return (
    <span ref={rootRef} className="relative inline-block">
      <button
        type="button"
        className={`ref-trigger ${className}`}
        data-open={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
      >
        {display}
      </button>
      {open && (
        <span
          role="dialog"
          className="absolute z-50 left-0 top-full mt-1 w-[280px] bg-paper border border-line rounded-lg shadow-xl p-3 text-left normal-case tracking-normal"
          style={{ fontVariantNumeric: "normal" }}
          onClick={(e) => e.stopPropagation()}
        >
          {src.label && (
            <div className="text-[11px] text-ink-3 font-medium mb-2">
              {src.label}
            </div>
          )}
          <div className="space-y-2 text-[11px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-4 shrink-0 w-10">タブ</span>
              <span className="text-ink-2 text-right flex-1 break-all">
                {src.tab}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-4 shrink-0 w-10">セル</span>
              <span className="num text-ink text-right">{src.cell}</span>
            </div>
            {src.formula && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-ink-4 shrink-0 w-10">計算式</span>
                <span className="text-ink-2 text-right flex-1 break-words">
                  {src.formula}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => copy(fullRef)}
              className="flex-1 text-[11px] py-1.5 px-2 border border-line rounded hover:bg-canvas text-ink-2"
            >
              {copied ? "コピー済" : "参照をコピー"}
            </button>
            {src.cell !== MISSING && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-[11px] py-1.5 px-2 bg-accent text-white rounded text-center hover:bg-accent-ink"
              >
                開く
              </a>
            )}
          </div>
        </span>
      )}
    </span>
  );
}
