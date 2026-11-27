# Storyboard 60 giây

Chủ đề minh họa: tổ chức dữ liệu và kết nối thông tin. Đây không phải mô tả một sản phẩm có thật. Thay voice, dữ liệu, cam kết và CTA theo brief đã xác nhận.

Comp 1080 × 1920, 30 fps. 10 scene × 180 frame = 1800 frame = 60 giây.

| Scene | Thời gian | Frame master | Layout | Mục tiêu | Voice minh họa | Nối cảnh |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | 0–6s | 0–179 | L01 | Đặt vấn đề | Dữ liệu có ở nhiều nơi, nhưng đội ngũ đã nhìn được cùng một bức tranh chưa? | M06 tại F180 |
| S02 | 6–12s | 180–359 | L03 | Làm rõ khái niệm | Một luồng thông tin cần có đầu vào, cách xử lý và kết quả được sử dụng rõ ràng. | E06 tại F360 |
| S03 | 12–18s | 360–539 | L04 | So sánh cấu trúc | Các nguồn tách rời và nguồn đã được tổ chức sẽ tạo ra trải nghiệm công việc khác nhau. | E02 tại F540 |
| S04 | 18–24s | 540–719 | L10 | Giới thiệu hệ thống | Hãy xác định đâu là nơi trao đổi dữ liệu và từng nguồn đóng vai trò gì. | E04 tại F720 |
| S05 | 24–30s | 720–899 | L09 | Trình bày quy trình | Thu thập đúng nguồn, chuẩn hóa cùng cấu trúc rồi đưa dữ liệu vào tác vụ cụ thể. | E06 tại F900 |
| S06 | 30–36s | 900–1079 | L06 | Phân nhóm khả năng | Có thể tổ chức nội dung theo các nhóm kết nối, xử lý, tự động hóa và báo cáo. | E04 tại F1080 |
| S07 | 36–42s | 1080–1259 | L15 | Minh họa thao tác | Ở mỗi thao tác, cần cho người xem thấy phản hồi và kết quả tương ứng. | M06 tại F1260 |
| S08 | 42–48s | 1260–1439 | L07 | Đặt chỉ tiêu đo | Nếu trình bày hiệu quả, cần chỉ tiêu, kỳ đo, nguồn dữ liệu và thước đo được xác nhận. | E06 tại F1440 |
| S09 | 48–54s | 1440–1619 | L11 | Rà soát trước khi dùng | Kiểm tra đúng nguồn, đúng kỳ và đúng ý nghĩa trước khi dùng thông tin để ra quyết định. | M06 tại F1620 |
| S10 | 54–60s | 1620–1799 | L19 | CTA | Hãy bắt đầu từ một vấn đề cụ thể và thống nhất kết quả cần đạt với đội ngũ. | Giữ đến frame cuối F1799 |

## Dựng master

Các comp scene được đặt liên tiếp, không overlap mặc định. Frame cục bộ f của scene i nằm ở frame master F=(i−1)×180+f. Ví dụ F090 của scene 3 là master F450, tức 15 giây.

Với wipe tại boundary C, thêm overlay master M06 từ C−12 đến C+12. Tại C overlay phải che đủ khung. Không kéo dài comp scene vì overlay 24 frame đã nằm trên timeline master.

Với match cut, giữ thành phần khớp ở trạng thái cuối; tắt exit cho thành phần đó và thiết kế vị trí đầu cảnh sau tương ứng. Với scene CTA cuối, không fade chữ trước khi kết thúc video.

Nhạc và SFX được chọn theo quyền sử dụng của dự án. Voice phải được thử trên timeline thật. Nếu nội dung cần nhiều thời gian hơn, điều chỉnh thời lượng và tính lại mốc master thay vì ép đọc nhanh.
