# Bộ grid bố cục text shape và motion cho After Effects

Phiên bản 1.0 — 08/11/2026. Ngôn ngữ tiếng Việt. Hệ chính portrait 1080 × 1920, 30 fps.

Bộ tài liệu giúp người dựng hoặc AI chuyển một ý thành khung hình cụ thể: biết đặt chữ ở đâu, shape chiếm bao nhiêu diện tích, thứ tự xuất hiện và cách nối cảnh. Đây là hệ thiết kế được đề xuất riêng cho bộ tài liệu, không phải tiêu chuẩn chính thức của Adobe hay một nền tảng mạng xã hội.

## Có gì trong bộ này

- 20 mẫu khung hình portrait với tọa độ từng layer, thông số text, thứ tự vẽ và keyframe.
- 8 biến thể đã bố trí lại: L01, L04, L09, L15 ở square và landscape.
- 3 profile grid, 28 wireframe SVG và 20 filmstrip SVG thể hiện các mốc motion. Tổng cộng 51 SVG.
- 2 storyboard hoàn chỉnh: 30 giây và 60 giây, có frame toàn cục và frame cục bộ.
- 84 mã tham chiếu style, layout, text, shape, transition, loại cảnh và nhịp motion.
- Bảng dữ liệu JSON dùng để tái tạo tọa độ và tra cứu bằng chương trình.

Các SVG là sơ đồ kỹ thuật của bố cục và trạng thái đề xuất. Chúng không phải frame render từ project After Effects. Bộ này không chứa file .aep hay preset .ffx.

## Thứ tự sử dụng

1. Đọc [hệ grid](01_Grid_Coordinates.md) để hiểu tọa độ, vùng nội dung và chuyển khổ.
2. Đọc [component text và shape](02_Text_Shape_Components.md).
3. Chọn khung ở [danh mục layout](04_Layout_Index.md).
4. Dùng [motion và keyframe](03_Motion_Timing.md), sau đó ghép theo storyboard.
5. Kiểm tra [workflow AE và QA](08_AE_Workflow_QA.md) trước khi xuất.

## Quy ước quan trọng

- x, y là góc trên trái của vùng bố trí; w, h là diện tích phân bổ, tính bằng px.
- Tọa độ là trạng thái đứng yên tại F090, không phải giá trị Position của mọi loại layer.
- Layer được ghi từ sau ra trước. Nhãn nhóm chỉ mang ý nghĩa tổ chức; chưa tự động parent layer.
- Nội dung, số liệu và giao diện trong hình là minh họa. Thay bằng dữ liệu được xác nhận trước khi sản xuất.
- Kích thước chữ được ghi theo pixel trong comp. Khả năng chứa chữ cần kiểm tra lại khi thay font, nội dung hoặc ngôn ngữ.

## Đường dẫn tra cứu

- [Storyboard 30 giây](05_Storyboard_30s.md)
- [Storyboard 60 giây](06_Storyboard_60s.md)
- [Thư viện 84 mã](07_84_Motion_Reference.md)
- [Mẫu brief](09_Brief_Template.md)
- [Nguồn và giả định](10_Sources_And_Assumptions.md)
