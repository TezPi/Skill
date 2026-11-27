# Contract của motion_plan.json

## Quy ước

Schema version 1.0. Tọa độ tuyệt đối theo comp, đơn vị px. Scene dùng khoảng frame master [start,end); khoảng của motion dùng frame cục bộ và có end cho phép bằng duration. Keyframe cụ thể phải thuộc 0 đến duration−1. Output fps lưu bằng tử số và mẫu số. Ví dụ plan đầy đủ nằm tại assets/example-create-plan.json.

| Trường | Nội dung cần có |
| --- | --- |
| task | kind create_new/edit_existing; deliverable plan/template/final_video; objective, audience, scope |
| source | status new/provided/missing; preserve_original; assets; missing nếu có |
| source.assets | id, file_ref, inspected, metadata, visual_samples, evidence, audio |
| output | width, height, fps_num, fps_den, total_frames |
| design | coordinate_basis comp_bbox; safe_bbox [x,y,w,h]; grid columns/gutter/column_width; font_family; palette |
| scenes | id, start, end, intent, layout, layout_reason, origin generated/source; source_asset_ids |
| scenes.protected_regions | bbox sau khi đã mapping sang output, id và lý do bảo vệ |
| scenes.source_mapping | Với cảnh dùng source: mode contain/cover/native/custom, output_bbox và reason giải thích fit/crop |
| scenes.layers | id, kind, role, z, bbox, essential, meaning và motion; thêm text cho layer chữ |
| layers.text | content, font_size, leading, max_lines, align; fit status/evidence |
| layers.motion | purpose, anchor_basis, entry, hold, exit, keyframes, easing |
| transition_out | style, reason; mỗi scene có cấu trúc này kể cả cut hoặc hold cuối |
| claims | text, status verified/example/placeholder; evidence với fact; visible_label với ví dụ/template |
| reviews | preview, readability, source_preservation, audio, data, format, transitions, cta |

Các trường phụ được giữ để host bổ sung công cụ hoặc checksum. Validator không loại bỏ dữ liệu chưa nhận biết.

## Source audit

Với provided, mỗi asset cần metadata width/height/fps_num/fps_den/duration_frames; inspected=true; ít nhất một quan sát frame và evidence công cụ. Chọn số mẫu nhiều hơn tùy điểm cắt và rủi ro che khuất. Với source có audio, chọn preserve hoặc replace_authorized; thay audio cần authorization có nội dung cụ thể.

Không tự điền inspected=true khi không mở được source. Trạng thái missing làm gate edit thất bại nhưng vẫn có thể hoàn thành plan sơ bộ ghi rõ phần thiếu.

## Text fit

fit.status có thể estimated, verified hoặc failed. Estimated được phép trước dựng và được ghi thành warning; export cần verified với evidence từ công cụ hoặc preview thật. max_lines là giới hạn thiết kế; script kiểm tra line break đã ghi chứ không tự đo font hoặc wrap. Phép đo bbox tĩnh và nhận xét tự khai chưa chứng minh readability.

## Motion tối thiểu

Mỗi layer, kể cả layer đứng yên, có purpose và anchor_basis. Dùng entry [0,0], hold [0,duration], exit null và một keyframe nếu layer tĩnh. Keyframes gồm frame, property và value. Các property thường dùng: position, scale, opacity, path_end, numeric_value. Có thể dùng property khác kèm giá trị và giải thích.

Với text bị scale X/Y không đều, thêm deformation_intent giải thích biến dạng ngắn có chủ đích. Khi scale để reflow thông thường, giữ hai trục bằng nhau và thay text box/line break.

Các bbox chữ không chồng nhau trừ khi layer có overlap_intent cụ thể. Transform text không được tiếp tục thay đổi qua khoảng hold đã khai là trạng thái đọc ổn định. Những layer nền hoặc hình chuyển động liên tục có thể có logic khác; không khai sai hold của chữ để vượt kiểm tra.

## Reviews

Mỗi mục có status pending/pass/fail/not_applicable, evidence dạng danh sách, reason khi không áp dụng. preview phải pass trước final export. Các mục khác có thể not_applicable với lý do thật; không dùng trạng thái này để né việc kiểm tra cần thiết.

## Hai kết quả cần phân biệt

- ready_to_edit: đủ đặc tả để dựng bản thử, không có blocker về source/hình học/timeline.
- ready_to_export: gate edit đạt, preview và các review cần thiết đã có, text fit verified và nội dung dữ liệu đúng phạm vi deliverable.

Kết quả là kiểm tra tính nhất quán của dữ liệu khai báo, không phải xác minh độc lập mọi evidence. Host cần kết nối dữ liệu probe, preview và bằng chứng thật để tăng mức đảm bảo.

Một plan-only có thể đủ đặc tả về mặt kỹ thuật nhưng không cho phép tự edit video. Wrapper chặn lệnh thực thi cho deliverable=plan; người vận hành cũng phải giữ phạm vi yêu cầu khi gọi công cụ ngoài wrapper.
