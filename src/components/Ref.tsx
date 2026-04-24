"use client";

import { useEffect, useRef, useState } from "react";
import { sheetCellUrl, MISSING, type Sourced, type CellKind } from "@/lib/config";

const kindBadge: Record<CellKind, { label: string; cls: string; help: string }> = {
  formula: {
    label: "自動",
    cls: "text-accent bg-accent-soft",
    help: "数式で自動計算されるセル",
  },
  manual: {
    label: "手入力",
    cls: "text-warn bg-warn-soft",
    help: "人が直接入力した値",
  },
  derived: {
    label: "ダッシュボード計算",
    cls: "text-ink-2 bg-canvas",
    help: "ダッシュボード側で計算された派生値",
  },
  empty: { label: "空", cls: "text-ink-muted bg-canvas", help: "空セル" },
};

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
          <div className="flex items-center justify-between gap-2 mb-2">
            {src.label && (
              <span className="text-[11px] text-ink-3 font-medium truncate">
                {src.label}
              </span>
            )}
            {src.kind && (
              <span
                className={`text-[9.5px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${kindBadge[src.kind].cls}`}
                title={kindBadge[src.kind].help}
              >
                {kindBadge[src.kind].label}
              </span>
            )}
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-4 shrink-0 w-12">タブ</span>
              <span className="text-ink-2 text-right flex-1 break-all">
                {src.tab}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-4 shrink-0 w-12">セル</span>
              <span className="num text-ink text-right">{src.cell}</span>
            </div>
            {src.kind && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-ink-4 shrink-0 w-12">種別</span>
                <span className="text-ink-2 text-right flex-1">
                  {kindBadge[src.kind].help}
                </span>
              </div>
            )}
            {src.formula && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-ink-4 shrink-0 w-12">計算式</span>
                <span className="text-ink-2 text-right flex-1 break-words font-mono text-[10px]">
                  {src.formula.length > 200
                    ? src.formula.slice(0, 200) + "…"
                    : src.formula}
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
