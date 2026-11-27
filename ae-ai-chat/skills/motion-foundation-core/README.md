# Motion Foundation Core

Skill nền tảng dùng trước khi AI edit source video hoặc tạo text, shape và motion. Gói kết hợp quy trình bắt buộc với thư viện đã xây trong cuộc trao đổi.

## Những phần nằm cùng một bộ

- SKILL.md là quy trình chính và tiêu chí trước khi hành động.
- references/foundations.md giải thích kiến thức căn bản AI cần áp dụng.
- references/source-and-gates.md phân biệt gate edit và gate export.
- references/plan-contract.md định nghĩa đặc tả scene và layer.
- references/text-and-motion-selection.md bổ sung 12 treatment chữ T01–T12 và cách phối hợp diện mạo chữ, hành vi C và nhịp G.
- references/library giữ toàn bộ 31 file Markdown, 20 mẫu portrait, 8 biến thể, 51 SVG, ảnh tổng quan và thư viện 84 mã A–G của bộ trước.
- assets có mẫu plan và quy tắc tích hợp vào project.
- scripts có validator và wrapper chặn lệnh khi plan chưa đạt.
- evals có các tình huống kiểm tra kỹ thuật và hành vi.

## Cách dùng với AI

Nạp skill bằng cơ chế skill của ứng dụng đang dùng, hoặc đặt thư mục motion-foundation-core ở nơi host hỗ trợ và gọi rõ tên skill. Với Codex có thể gọi `$motion-foundation-core`. Một số host cho phép tự chọn skill theo description; allow_implicit_invocation=true chỉ cho phép cơ chế đó, không bảo đảm mọi yêu cầu đều tự kích hoạt.

Nếu cần quy tắc áp dụng ở mọi tác vụ video của một project, dùng nội dung assets/PROJECT_RULES.md làm hướng dẫn project theo cơ chế của host. File này chỉ là mẫu; gói không tự sửa AGENTS.md hoặc cấu hình hiện có.

## Kiểm tra

```text
python scripts/validate_plan.py assets/example-create-plan.json --phase edit
python scripts/gated_command.py --phase edit assets/example-create-plan.json -- python your_builder.py
```

Ví dụ JSON chỉ kiểm tra cấu trúc của đặc tả. Nó không chứng minh đã dựng AE hoặc đã xem một video thật. Trước export cần cập nhật evidence từ preview thật.

## Phạm vi bắt buộc

Khi skill đã được nạp, AI phải xử lý đủ nội dung, source, bố cục, text/shape và timeline trước khi dựng; kiểm tra lại trước khi xuất. File skill không có quyền ưu tiên cao hơn hệ thống và không thể tự ép mọi AI khác tuân thủ khi chưa cài hoặc chưa nạp. Muốn chặn thực thi bằng kỹ thuật cần tích hợp validator ở host.

## Nguồn

- Bộ nguồn đã đọc: Motion_Grid_AE_Handbook.md, 147979 byte, tạo 08/11/2026; ID libfile_3d33fce2f42c8191b8899087a6243e09. Bản gốc được giữ nguyên.
- [OpenAI hướng dẫn Skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI cấu hình agents/openai.yaml](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/skill-creator/references/openai_yaml.md)
- Nguồn motion và các giả định của thư viện nằm tại references/library/10_Sources_And_Assumptions.md.
