# Nguồn tham khảo và giả định

Ngày biên soạn 08/11/2026. Nội dung là tài liệu thiết kế và hướng dẫn triển khai được tổng hợp riêng. Các giá trị margin, cột, hàng, font, palette, frame và motion preset là đề xuất của bộ tài liệu. Chúng không được gán thành tiêu chuẩn Adobe, IBM hoặc safe zone nền tảng.

## Nguồn nền tảng

1. [IBM Design Language 2x Grid](https://www.ibm.com/design/language/2x-grid/) — tham khảo nguyên tắc chia lưới và tổ chức vùng thiết kế. Bộ này dùng cấu hình riêng, không sao chép hệ đo của IBM.
2. [IBM Layout Overview](https://www.ibm.com/design/language/layout/overview/) — hierarchy, tỷ lệ, khoảng trống và quan hệ các phần tử.
3. [Adobe Animating Text](https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html) — Text Animators và selectors.
4. [Adobe Shape Attributes And Path Operations](https://helpx.adobe.com/after-effects/desktop/drawing-painting-and-paths/shapes-and-shape-attributes/shape-attributes-paint-operations-path.html) — Trim Paths, Repeater và các thao tác shape.
5. [Adobe Speed Between Keyframes](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html) — kiểm soát tốc độ bằng keyframe và Graph Editor.
6. [Adobe Working With Variable Font Axes](https://helpx.adobe.com/after-effects/desktop/variable-font-axes/work-with-variable-font-axes/working-with-variable-font-axes.html) — trục font và yêu cầu font hỗ trợ.
7. [Adobe Create Motion Graphics Templates](https://helpx.adobe.com/sg/after-effects/desktop/motion-graphics/work-with-motion-graphics-templates/creating-motion-graphics-templates.html) — đóng gói các thuộc tính có thể chỉnh sửa.

## Reference sáng tạo

- [Ordinary Folk Process](https://www.ordinaryfolk.co/process) — phát triển thông điệp, thiết kế, storyboard và animation.
- [Vucko Google Next 2026](https://vucko.co/work/google-next-2026) — ví dụ hệ motion nhiều thành phần và toolkit sản xuất.
- [BUCK Firebrand](https://buck.co/work/the-outlook-firebrand) — ví dụ typography, chất liệu giấy, nét vẽ và nhịp lo-fi.
- [Sander van Dijk BUCK Logo Animation](https://www.sandervandijk.tv/buck-logo-animation) — hình học trong nhận diện động.

## Phạm vi kiểm tra

Kiểm tra tự động trong quá trình tạo bộ tài liệu: tính đúng kích thước lưới; tọa độ layer tại trạng thái đọc; mã layer không trùng trong cùng cảnh; số dòng và độ rộng chữ với font minh họa; các điểm connector; sự tồn tại của asset và link nội bộ; mốc frame entry và exit; số mục tham chiếu và số frame storyboard.

Các SVG và ảnh tổng quan là sơ đồ bố cục được tạo từ cùng dữ liệu tọa độ. Chúng không xác nhận rendering, kerning hoặc biểu thức trong After Effects. Khi dựng bằng font, plugin hoặc renderer khác, người dựng cần kiểm tra lại ở AE và đầu ra thật.
