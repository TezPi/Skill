# Storyboard 30 giây

Chủ đề minh họa: tổ chức dữ liệu và kết nối thông tin. Đây không phải mô tả một sản phẩm có thật. Thay voice, dữ liệu, cam kết và CTA theo brief đã xác nhận.

Comp 1080 × 1920, 30 fps. 5 scene × 180 frame = 900 frame = 30 giây.

| Scene | Thời gian | Frame master | Layout | Mục tiêu | Voice minh họa | Nối cảnh |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | 0–6s | 0–179 | L01 | Đặt câu hỏi | Dữ liệu có ở nhiều nơi, nhưng đội ngũ đã nhìn được cùng một bức tranh chưa? | E01 / M06 tại master F180 |
| S02 | 6–12s | 180–359 | L04 | Cho thấy khác biệt | Khi mỗi nguồn dùng một cấu trúc, việc tổng hợp và đối chiếu sẽ mất thêm công sức. | E02 tại F360; giữ từ khóa KẾT NỐI |
| S03 | 12–18s | 360–539 | L10 | Giải thích kết nối | Bắt đầu bằng việc xác định các nguồn cần trao đổi và vai trò của từng thành phần. | E04 tại F540; đi vào vùng hub |
| S04 | 18–24s | 540–719 | L15 | Cho thấy cách sử dụng | Sau đó, đưa thông tin đã được tổ chức vào một tác vụ cụ thể của đội ngũ. | E01 / M06 tại F720 |
| S05 | 24–30s | 720–899 | L19 | Kết thúc bằng hành động | Hãy chọn một vấn đề cần giải quyết trước và làm rõ kết quả mong muốn. | Giữ đến frame cuối F899 |

## Dựng master

Các comp scene được đặt liên tiếp, không overlap mặc định. Frame cục bộ f của scene i nằm ở frame master F=(i−1)×180+f. Ví dụ F090 của scene 3 là master F450, tức 15 giây.

Với wipe tại boundary C, thêm overlay master M06 từ C−12 đến C+12. Tại C overlay phải che đủ khung. Không kéo dài comp scene vì overlay 24 frame đã nằm trên timeline master.

Với match cut, giữ thành phần khớp ở trạng thái cuối; tắt exit cho thành phần đó và thiết kế vị trí đầu cảnh sau tương ứng. Với scene CTA cuối, không fade chữ trước khi kết thúc video.

Nhạc và SFX được chọn theo quyền sử dụng của dự án. Voice phải được thử trên timeline thật. Nếu nội dung cần nhiều thời gian hơn, điều chỉnh thời lượng và tính lại mốc master thay vì ép đọc nhanh.
