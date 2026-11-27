# AI Chat cho After Effects

Panel chat nằm ngay trong After Effects: gõ yêu cầu ("stagger 5 layer đang chọn 4 frame", "tạo lower-third chữ Hello"), Claude đọc comp đang mở, viết ExtendScript và chạy trực tiếp trên project. Mỗi lần sửa = **1 bước Undo**.

```
Panel (HTML/TS, CEP)  ──fetch/stream──▶  Claude API (tool use)
   │  evalScript                              │
   ▼                                          ▼
host/host.jsx (ExtendScript)  ◀── run_extendscript / get_project_context
```

| File | Vai trò |
|---|---|
| `src/agent.ts` | Logic: cầu nối AE, 3 tool (`get_project_context`, `run_extendscript`, `read_skill`), vòng tool-use, preset agent. Không đụng DOM. |
| `src/main.ts` | UI: render chat, step, duyệt code, chọn/sửa agent. |
| `host/host.jsx` | Chạy trong AE (ES3): đọc context, chạy code trong undo group, đọc skill, nạp thư viện rig, encode JSON. |
| `skills/` | 24 skill của **SFT Super Motion Studio V2** (bản 2.6.0), giữ nguyên từ plugin. |
| `CSXS/manifest.xml` | Khai báo extension (AE 2022+). |

## Agents & skills

Mỗi agent = tên + **model riêng** + chỉ dẫn vai trò. Chọn ở góc trái ô chat; tin nhắn tiếp theo chạy bằng agent đó (đổi giữa chừng vẫn giữ lịch sử). Thêm/sửa/xoá trong ⚙ Settings.

| Agent mặc định | Model | Dựa trên |
|---|---|---|
| Motion Director | Opus 5.5 | `motion-director` → pipeline Forge (senior-editor → sfc-super-motion-v1 → ae-automation-architect → motion-foundation-core) |
| AE Technical | Sonnet 5.5 | `ae-automation-architect` (DS-1..3, AE-1..5, helper `SFT_DS`) |
| Quick edits | Haiku 5.5 | Sửa nhỏ, không hỏi lại, vẫn giữ DS-1 (không ease linear) |
| Motion Reviewer | Sonnet 5.5 | Agent `motion-reviewer` của plugin, chuyển sang chấm animation trong comp AE (DS/AE + tell `ME-`), chỉ đọc |

Skill được nạp theo kiểu Claude Code: system prompt chỉ chứa tên + mô tả 24 skill; model gọi `read_skill` để đọc `SKILL.md` và file tham chiếu khi cần (file dài trả theo trang 40k ký tự). Khi panel mở, `sft_depth_soul.jsx` được nạp sẵn vào AE thành `SFT_DS`, nên code AI viết gọi được thẳng `SFT_DS.stagger`, `SFT_DS.dho`, `SFT_DS.glowStack`…

Cập nhật khi plugin ra bản mới (chạy trong `ae-ai-chat`, thay `<plugin>` bằng thư mục plugin `sft-super-motion-studio-v2`):

```bash
rm -rf skills && cp -r <plugin>/skills ./skills && npm test
```

## Cài đặt (dev, chưa ký)

Yêu cầu: After Effects 2022 trở lên, Node 18+, API key từ console.anthropic.com.

**Windows:** bấm đúp `install-windows.bat`. File tự build, bật chế độ extension chưa ký cho mọi bản CEP (CSXS 9–14, kèm log), tạo link vào `%APPDATA%\Adobe\CEP\extensions` (không cần admin) rồi kiểm tra lại.

**macOS** (Terminal, trong thư mục `ae-ai-chat`):

```bash
npm install && npm run build
```

```bash
for v in 9 10 11 12 13 14; do defaults write com.adobe.CSXS.$v PlayerDebugMode 1; done
```

```bash
mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions && ln -sfn "$(pwd)" ~/Library/Application\ Support/Adobe/CEP/extensions/ae-ai-chat
```

Thoát hẳn AE rồi mở lại → **Window › Extensions › AI Chat** → ⚙ dán API key.

Menu **Extensions** bị xám = AE không nạp được extension nào. Trên Windows, gửi các file `CEP*.log` mới nhất trong `%TEMP%` để xem lý do.

## Dùng

- Chip trên cùng cho biết AI đang thao tác trên comp nào và bao nhiêu layer đang chọn.
- Code mỗi bước xem được bằng cách bấm vào step. Bật **Review code before it runs** trong Settings nếu muốn duyệt Run/Skip từng bước.
- Nút ↶ gọi Edit › Undo của AE (Ctrl/Cmd+Z khi đang focus panel không tới được AE).
- `+` mở chat mới (xoá lịch sử gửi cho model, giảm chi phí khi chat dài).

## Dev

```bash
npm run watch
```

Sau khi sửa `src/`, reload panel (đóng/mở lại). Debug panel bằng Chrome tại `http://localhost:8088` (file `.debug`). Kiểm tra:

```bash
npm run check && npm test
```

`npm test` chạy `host.jsx` trong Node với object model AE giả lập và đi đúng đường panel dùng (escape code → ExtendScript → JSON), đọc thư mục `skills/` thật và nạp `sft_depth_soul.jsx` thật.

## Ghi chú

- Agent dùng Opus/Sonnet có bật server-side fallback khi một request bị từ chối; Haiku 5.5 không có fallback.
- Skill nhắc tới script Python (`es3_lint.py`, `foundation_mix_lint.py`…) hoặc file `motion_plan.json`: panel không chạy Python, nên model tự áp các luật đó và giữ plan trong chat.
- Panel gọi API trực tiếp từ máy người dùng; key lưu trong `localStorage` của panel. Phù hợp dùng cá nhân. Phát hành cho team thì chuyển key sang một proxy server của bạn.
- Code do AI viết chạy với quyền của AE (có thể đọc/ghi file). System prompt cấm xoá/ghi file, `system.callSystem`, save/quit trừ khi bạn yêu cầu; muốn chắc chắn thì bật Review.
- Context gửi kèm mỗi tin nhắn giới hạn 100 layer đầu của comp; model tự truy vấn thêm khi cần.
