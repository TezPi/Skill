"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import {
  ArrowCounterClockwise,
  ChatCircle,
  Cursor,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Hand,
  Hash,
  PenNib,
  TextT,
  type Icon,
} from "@phosphor-icons/react";

export type Tool = "move" | "frame" | "pen" | "text" | "hand" | "comment";

export const TOOLS: { id: Tool; label: string; key: string; Icon: Icon }[] = [
  { id: "move", label: "Move", key: "V", Icon: Cursor },
  { id: "frame", label: "Frame", key: "F", Icon: Hash },
  { id: "pen", label: "Pen", key: "P", Icon: PenNib },
  { id: "text", label: "Text", key: "T", Icon: TextT },
  { id: "hand", label: "Hand", key: "H", Icon: Hand },
  { id: "comment", label: "Comments", key: "C", Icon: ChatCircle },
];

export type Preset = { id: string; label: string; hint: string; aspect: number; Icon: Icon };

export const PRESETS: Preset[] = [
  { id: "desktop", label: "Desktop", hint: "1440", aspect: 2.4, Icon: Desktop },
  { id: "tablet", label: "Tablet", hint: "768", aspect: 4 / 3, Icon: DeviceTablet },
  { id: "mobile", label: "Mobile", hint: "375", aspect: 9 / 16, Icon: DeviceMobile },
];

type Props = {
  tool: Tool;
  onTool: (tool: Tool) => void;
  onPreset: (preset: Preset) => void;
  onReset: () => void;
};

export function FigmaToolbar({ tool, onTool, onPreset, onReset }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tool === "frame") menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [tool]);

  // WAI-ARIA toolbar: arrow keys move focus between buttons.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key) || !barRef.current) return;
    const buttons = Array.from(barRef.current.querySelectorAll<HTMLButtonElement>("[data-tool-btn]"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      const next = (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
    if (event.key === "Escape") {
      event.stopPropagation();
      onTool("move");
      barRef.current?.querySelector<HTMLButtonElement>('[data-tool-id="frame"]')?.focus();
    }
  };

  return (
    <div ref={barRef} role="toolbar" aria-label="Canvas tools" className="toolbar" onKeyDown={onKeyDown}>
      {TOOLS.map(({ id, label, key, Icon }, i) => (
        <span key={id} className="contents">
          {i === 2 || i === 4 ? <span aria-hidden="true" className="mx-1 h-6 w-[2px] bg-fg/20" /> : null}
          <button
            type="button"
            data-tool-btn
            data-tool-id={id}
            className="tool"
            aria-pressed={tool === id}
            aria-keyshortcuts={key}
            aria-label={label}
            aria-haspopup={id === "frame" ? "menu" : undefined}
            aria-expanded={id === "frame" ? tool === "frame" : undefined}
            tabIndex={tool === id ? 0 : -1}
            onClick={() => onTool(tool === id && id !== "move" ? "move" : id)}
          >
            <Icon size={20} weight={tool === id ? "fill" : "bold"} aria-hidden="true" />
            <span className="tool-tip" aria-hidden="true">
              {label}
              <kbd>{key}</kbd>
            </span>
          </button>
        </span>
      ))}
      <span aria-hidden="true" className="mx-1 h-6 w-[2px] bg-fg/20" />
      <button type="button" data-tool-btn className="tool" aria-label="Reset canvas" tabIndex={-1} onClick={onReset}>
        <ArrowCounterClockwise size={20} weight="bold" aria-hidden="true" />
        <span className="tool-tip" aria-hidden="true">
          Reset canvas
        </span>
      </button>

      {tool === "frame" ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Frame presets"
          onKeyDown={onMenuKey}
          className="absolute bottom-[calc(100%+14px)] left-1/2 w-60 -translate-x-1/2 border-2 border-fg bg-bg p-1.5 shadow-[5px_5px_0_var(--fg)]"
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="menuitem"
              onClick={() => onPreset(preset)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 hover:bg-bg-alt focus-visible:bg-bg-alt"
            >
              <preset.Icon size={18} weight="bold" aria-hidden="true" />
              {preset.label}
              <span className="ml-auto text-muted">{preset.hint}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
