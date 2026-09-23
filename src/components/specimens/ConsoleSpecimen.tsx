/**
 * Recreation of the Agent-X Console card anatomy, redrawn in the portfolio's palette.
 * Light-first like the product. Exactly one blue element: the action that needs doing.
 */
export function ConsoleSpecimen() {
  return (
    <div
      aria-hidden="true"
      lang="vi"
      className="surface-paper @container absolute inset-0 flex flex-col bg-bg text-fg [font-size:clamp(8px,2.2cqw,19px)]"
    >
      <div className="flex items-center justify-between border-b border-line px-[1.6em] py-[1em] text-[0.8em] tracking-[0.1em] text-fg-lo uppercase">
        <span>Agent-X / Kỹ năng</span>
        <span className="flex items-center gap-[0.5em] normal-case tracking-normal">
          <span className="size-[0.55em] rounded-full bg-fg" /> 03 agent đang trực
        </span>
      </div>

      <div className="grid flex-1 grid-cols-[1.15fr_1fr] content-center gap-[1em] p-[1.6em]">
        {/* Skill tile — flat lines of text, no nested boxes */}
        <div className="flex flex-col gap-[0.7em] rounded-[0.8em] bg-bg-raised p-[1.1em] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_10px_-2px_rgb(0_0_0/0.06)]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[0.5em]">
              <span className="grid size-[1.8em] place-items-center rounded-[0.45em] bg-fg/8">
                <span className="size-[0.7em] rounded-[0.2em] border-[0.14em] border-fg" />
              </span>
              <span className="rounded-[0.4em] border border-line px-[0.5em] py-[0.1em] text-[0.8em] text-fg-mid">workflow · 4 bước</span>
            </span>
            <span className="tracking-widest text-fg-lo">⋯</span>
          </div>
          <p className="text-[1.25em] font-semibold leading-tight tracking-tight">Nhắc khách bỏ quên giỏ</p>
          <p className="text-[0.9em] leading-snug text-fg-lo @max-xl:hidden">Tự động nhắn nhắc khách chưa chốt đơn…</p>
          <p className="mt-auto flex items-center gap-[0.45em] text-[0.85em] text-fg-mid">
            <span className="size-[0.5em] rounded-full bg-fg" /> Đang chạy · 34 lượt hôm nay
          </p>
          <div className="flex items-center justify-between border-t border-line pt-[0.6em] text-[0.8em] text-fg-mid">
            <span className="flex items-center gap-[0.4em]">
              <span className="size-[0.5em] rounded-full border border-fg" /> Zalo OA
            </span>
            <span className="rounded-[0.4em] border border-line px-[0.5em] py-[0.1em]">Cần bạn duyệt</span>
          </div>
        </div>

        {/* Review gate — the only card with a button */}
        <div className="flex flex-col gap-[0.7em] rounded-[0.8em] bg-bg-raised p-[1.1em] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_10px_-2px_rgb(0_0_0/0.06)]">
          <p className="text-[0.75em] tracking-[0.12em] text-fg-lo uppercase">Chờ duyệt</p>
          <p className="text-[2.6em] leading-none font-semibold tracking-tight tabular-nums">3</p>
          <p className="text-[0.9em] leading-snug text-fg-lo">bản nháp đang chờ bạn. Không gửi tin nào khi bạn chưa gật đầu.</p>
          <span className="mt-auto inline-flex h-[2.4em] items-center justify-center rounded-[0.65em] bg-signal text-[0.95em] font-medium text-on-signal">
            Duyệt
          </span>
        </div>
      </div>

      {/* Queue strip: raw input and standardised output, linked */}
      <div className="flex items-center justify-between border-t border-line px-[1.6em] py-[0.9em] text-[0.8em] text-fg-mid @max-xl:hidden">
        <span>＋ Nạp dữ liệu</span>
        <span className="flex items-center gap-[0.6em]">
          <span className="h-[0.35em] w-[6em] overflow-hidden rounded-full bg-fg/10">
            <span className="block h-full w-2/3 rounded-full bg-fg/60" />
          </span>
          Agent dùng 15/18 mục · 3 mục chưa dùng
        </span>
      </div>
    </div>
  );
}
