# Chọn style chữ và motion

## Phân biệt ba quyết định

Treatment T quyết định diện mạo chữ; motion C quyết định hành vi; nhịp G quyết định cách hành vi diễn ra theo thời gian. Ví dụ T01 + C01 + G05 là sans rõ ràng, reveal qua vùng che, chuyển động chính xác. T02 + C08 + G02 là chữ đậm lớn, kéo giãn ngắn và nhịp dứt khoát.

Mã T dưới đây là lớp tra cứu bổ sung, không thay đổi 84 mã A–G của bộ trước. Chúng là tên làm việc để viết brief, không phải danh mục chuẩn hóa của phần mềm.

## Mười hai treatment chữ

| Mã | Diện mạo | Ngữ cảnh | Bố cục và motion gợi ý | Kiểm tra bắt buộc |
| --- | --- | --- | --- | --- |
| T01 Clean Sans | Sans serif, hierarchy bằng size và weight, khoảng trống rõ. | Thông tin B2B, dữ liệu, hướng dẫn. | L01/L03/L05, C01 hoặc C04, G05. | Đo glyph tiếng Việt, ngắt dòng và vùng đọc. |
| T02 Oversized Bold | Chữ đậm chiếm nhiều diện tích, ít từ trên mỗi nhịp. | Hook, thông điệp, sự kiện. | L02/L20, C03/C08, G02. | Giữ từ quan trọng đủ thời gian; crop chữ chỉ khi có chủ đích. |
| T03 Editorial Serif | Chữ serif dùng cho nhận định hoặc trích dẫn; phần phụ có thể dùng sans. | Phân tích, tài liệu, thương hiệu có giọng biên tập. | L13/L16, C01/C04, G04. | Chữ mảnh còn đọc được trên nền và ở kích thước xuất. |
| T04 Condensed | Font có thiết kế hẹp nguyên bản, không ép Scale X của font thường. | Headline dài vừa phải, tiêu đề mạnh. | L02/L04, C01/C11. | Giữ tỷ lệ glyph; đo lại độ rộng sau khi đổi font. |
| T05 Outline Type | Chữ viền là thành phần đồ họa hoặc nhấn phụ. | Poster, nhận diện, typography biểu cảm. | L20, C11 hoặc C10. | Không mặc định dùng cho đoạn dài; kiểm tra stroke ở output thật. |
| T06 Label And Highlight | Chữ đặt trên nền nhãn, gạch chân hoặc thanh highlight. | Từ khóa, bằng chứng, trạng thái. | L11/L16, C04, D04. | Padding đủ, chữ rõ, nhãn không che thông tin source. |
| T07 Monospace Technical | Chữ đơn cách cho mã, thông số hoặc nhãn kỹ thuật. | Dashboard, hệ thống, mô phỏng terminal. | L10/L15, C05 hoặc C01. | Không giả dữ liệu live; giữ đơn vị và định dạng nhất quán. |
| T08 Rounded Friendly | Chữ có hình dáng mềm, ít chi tiết sắc, dùng có chọn lọc. | Giáo dục, nội dung gần gũi. | L03/L05, C02, G03. | Không lạm dụng nảy ở phần đọc dài; font có đủ dấu. |
| T09 Weight Contrast | Một family hoặc hai vai trò chữ dùng weight/size khác nhau rõ ràng. | Tách ý chính/phụ, so sánh, CTA. | L01/L04/L19, C01/C04. | Hệ thống nhất quán; tránh mọi từ đều được nhấn. |
| T10 Layered Depth | Chữ có lớp bóng, mặt hoặc độ sâu để tạo khối. | Tiêu đề sản phẩm, nhận diện. | B01/B04, C10 và F08 khi phù hợp. | Tách depth thật và giả; kiểm tra renderer/công cụ hỗ trợ. |
| T11 Print Texture | Chữ có grain, mực hoặc halftone theo ngôn ngữ in ấn. | Collage, văn hóa, thương hiệu thủ công. | A09/A12, C01 hoặc keyframe ngắt G06. | Texture không phá nét dấu hoặc làm mất tương phản. |
| T12 Variable Axes | Chữ đổi độ đậm, độ rộng hoặc trục được font cung cấp. | Nhận diện, headline linh hoạt. | C12 với grid phù hợp, G04 hoặc G02. | Xác minh font và phiên bản công cụ có trục; đo bố cục ở các cực trị. |

## Chọn motion theo nhiệm vụ thông tin

| Nhiệm vụ | Text | Shape | Chuyển cảnh | Điều kiện ngữ nghĩa |
| --- | --- | --- | --- | --- |
| Đưa ý chính vào | C01, M01 | D01/M02 khi có icon hoặc container | E01/E06 nếu đổi chủ đề | Đọc được ý chính trước phần phụ. |
| Nhấn một từ đang được giải thích | C04 | D04 hoặc thanh highlight | Thường giữ cùng cảnh | Không làm người xem phải đọc lại cả câu. |
| Diễn đạt tăng/giảm hoặc phân tán/kết nối | C03 | D03/D06/D11 | E02/E03 khi có quan hệ hình học | Hành vi phải đúng nghĩa và không làm sai số liệu. |
| Giải thích quy trình | C01 theo cụm | D04/D06/D09 | E12 khi tiếp tục một luồng | Xác nhận hướng và thứ tự; không biến nhiệm vụ song song thành tuần tự. |
| Trình bày số liệu | C06 hoặc F02 | M07, F01 | E02 khi ghép hình phù hợp | Có thang đo, đơn vị, kỳ, nguồn và hold sau khi số dừng. |
| Trình diễn UI | C01/C05 theo hành động | D12/M09, F03/F04 | E04 đi vào tính năng | Cho thấy tác động, phản hồi và kết quả; không giả là UI chạy thật. |
| Tạo tính cách vui | C02/C08 có giới hạn | D01/D02/D07 | E09 nếu cùng ngôn ngữ | Motion phụ không tranh trọng tâm với thông tin cần đọc. |
| Kết luận và CTA | C01/C04 | Container tĩnh hoặc nhấn nhẹ | Giữ cuối hoặc cut có chủ đích | CTA còn đọc được đến frame cuối cần thiết. |

## Cách viết một lựa chọn đủ cụ thể

«Dùng T01 cho câu giải thích, L03 để tách chữ với sơ đồ. C01 vào trong 18 frame, hold sau khi chữ ổn định; D04 vẽ đường nối sau headline. Nhịp G05. Tại boundary dùng E04 đi vào node kết quả. Text không chồng vùng chủ thể và logo đã map sang output.»

Sau câu định hướng này phải có bbox, typography và keyframe số. Tên style không thay thế đặc tả thực thi.
