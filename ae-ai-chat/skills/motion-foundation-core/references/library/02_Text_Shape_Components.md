# Component text và shape

## Hệ chữ

Font minh họa Arial, có hỗ trợ tiếng Việt. Có thể thay bằng font nhận diện có đủ dấu; cần đo lại nội dung sau khi thay. Chữ đậm được dùng cho title, display, card_title và number. Các cỡ dưới đây là điểm khởi đầu của hệ thiết kế.

| Token | Font size px | Leading px | Cách dùng |
| --- | --- | --- | --- |
| eyebrow | 24 | 36 | Nhãn chủ đề ngắn |
| title | 72 | 84 | Tiêu đề cảnh tối đa 3 dòng |
| display | 96 | 108 | Hook ngắn tối đa 3 dòng |
| body | 36 | 48 | Nội dung chính 1 đến 3 dòng |
| small | 30 | 42 | Mô tả ngắn và nhãn |
| micro | 24 | 36 | Chú thích phụ |
| card_title | 48 | 60 | Tiêu đề trong thẻ |
| number | 120 | 132 | Chỉ tiêu hoặc placeholder lớn |

## Vùng text khác với nét chữ thực tế

Tọa độ trong tài liệu là hình chữ nhật phân bổ cho nội dung. Chiều cao dòng và độ rộng ký tự phụ thuộc font. Khung chữ cần đủ chỗ cho dấu tiếng Việt, ascender và descender.

Cách bố trí trong AE: tạo paragraph text với width tương ứng, đặt cỡ và leading, kiểm tra ngắt dòng rồi căn vùng chữ vào x/y. Nếu cần dùng anchor góc trên trái, đo sourceRectAtTime ở trạng thái chữ tĩnh và bake giá trị anchor. Không gắn anchor đo động vào chữ đang biến dạng nếu phép đo đó gây xê dịch.

Với chữ căn giữa, tâm dòng nằm tại x+w/2. Với chữ căn trái, điểm bắt đầu dòng nằm tại x. Chiều cao h là dung lượng bố trí, không phải yêu cầu kéo giãn text cho đầy ô.

## Hệ shape

| Component | Quy tắc đề xuất | Khi dùng |
| --- | --- | --- |
| Card | Radius 24 px, padding tối thiểu 24 px; ví dụ nội dung dài dùng 36 hoặc 48 px. | Danh sách, feature, UI. |
| Pill | Radius không vượt nửa chiều cao; text căn giữa. | Nhãn trạng thái hoặc category. |
| Circle / Ellipse | w=h mới là hình tròn; w khác h là ellipse. | Điểm nhấn, node; không làm biến dạng icon tùy tiện. |
| Connector | Nét chính 6 px; vẽ phía dưới các node. | Quan hệ hoặc luồng đã được xác nhận. |
| Divider | Nét 2 đến 4 px; độ tương phản thấp hơn text chính. | Phân chia nhóm thông tin. |
| Chart mark | Kích thước lấy từ dữ liệu và thang đo thật. | Không dùng thanh trang trí làm bằng chứng định lượng. |
| Brand slot | Vùng placeholder, không mô phỏng logo thật. | Thay bằng asset nhận diện đúng khi sản xuất. |
| QR slot | Chỉ dùng QR thật và kiểm tra quét; không sinh QR giả từ shape. | Khi có hành động quét phù hợp. |

## Chuyển tọa độ shape sang Position AE

Với Rectangle Path: Size=[w,h], Position của path=[0,0]. Đặt layer Anchor=[0,0] và layer Position=[x+w/2,y+h/2]. Rectangle mặc định được vẽ quanh tâm path, nên cách này đặt đúng bbox x/y/w/h. Kiểm tra transform group không có offset phụ.

Ví dụ SH_CTA trong L19: bbox (168,1224,744,120); Position tâm là (540,1284). Text CTA có vùng riêng và không được lấy Position tâm của shape để áp nguyên cho paragraph text.

Với connector, các điểm được ghi theo tọa độ comp. Nếu Path nằm trong một layer có transform, phải đổi điểm sang local space hoặc giữ layer Transform ở hệ tọa độ đã chọn. Không cộng offset hai lần.

## Màu minh họa

| Token | HEX |
| --- | --- |
| bg | #F6F8FC |
| ink | #17253B |
| muted | #57677F |
| brand | #004AAD |
| tint | #E7EFFB |
| line | #B7C6DC |
| green | #00735E |
| green_tint | #E3F2ED |
| warm | #B2452F |
| warm_tint | #F9EBE6 |
| white | #FFFFFF |
| purple | #6B55A6 |
| purple_tint | #EEEAF7 |


Đây là palette mẫu của bộ tài liệu. Màu brand #004AAD là màu ví dụ, cần đối chiếu bộ nhận diện chính thức trước khi áp dụng cho một thương hiệu cụ thể. Màu xanh hoặc màu ấm không tự chứng minh trạng thái tốt/xấu; luôn có nhãn chữ.
