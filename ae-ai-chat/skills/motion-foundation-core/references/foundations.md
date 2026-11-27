# Nền tảng thiết kế motion

## Nội dung

1. Ngữ nghĩa trước hiệu ứng
2. Hierarchy trong không gian và thời gian
3. Grid và vùng bảo vệ source
4. Text và khả năng đọc
5. Shape và cách biểu đạt thông tin
6. Timeline và tính liên tục
7. Hệ tọa độ và anchor
8. Dữ liệu và trạng thái bằng chứng
9. Thư viện mã và cách chọn
10. Tính linh hoạt có trách nhiệm

## 1 Ngữ nghĩa trước hiệu ứng

Một scene là một đơn vị giải thích: người xem tiếp nhận một ý, nhìn một hành động hoặc hiểu một thay đổi. Xác định ý trước khi chọn font, shape và transition. Ví dụ, «phân tán» có thể được diễn đạt bằng các cụm tách nhau; «kết nối» bằng quan hệ giữa các nguồn. Không giả định mọi khái niệm đều cần chuyển động mang tính ẩn dụ; một nhãn đứng yên có thể rõ hơn.

## 2 Hierarchy trong không gian và thời gian

Hierarchy không chỉ là chữ lớn/chữ nhỏ. Vị trí, tương phản, khoảng trống và thời điểm xuất hiện cùng dẫn mắt. Chữ phụ có chuyển động mạnh hơn headline có thể chiếm sự chú ý sai. Cho mỗi thời điểm một trọng tâm chính. Xây thông tin theo trình tự hiểu, không làm mọi layer cùng nảy vì chúng có chung preset.

## 3 Grid và vùng bảo vệ source

Grid tổ chức các quan hệ căn lề, nhịp khoảng cách và tỷ lệ. Với source thật, vùng trống và vùng cần bảo toàn quan trọng hơn sự đẹp của một template trống. Xem vị trí mặt/chủ thể, sản phẩm, logo, chữ có sẵn, QR và phụ đề trước khi đặt overlay.

Safe bbox là vùng nội dung dự kiến đọc rõ. Các vùng bảo vệ source có thể nằm bên trong hoặc bên ngoài safe bbox; không đánh đồng hai loại này. Crop/scale/letterbox làm đổi vị trí của vùng bảo vệ, do đó phải xét mapping sang tọa độ output. Không lấy tọa độ source rồi dùng trực tiếp ở comp khác tỷ lệ.

## 4 Text và khả năng đọc

Text có nội dung, font, weight, size, leading, paragraph width, line break và alignment. Bbox là diện tích dành cho text, không phải phép biến dạng glyph để vừa khung. Hình chữ nhật đủ lớn không chứng minh chữ đã fit; phải đo hoặc nhìn render với font thật, đặc biệt dấu tiếng Việt.

Tách entry, trạng thái đọc và exit. Thời gian đọc cần xét voice, mức mới của thông tin, số dòng và phần hình đang yêu cầu chú ý. Một từ nhấn có thể xuất hiện ngắn; một câu phân tích cần giữ lâu hơn. Không có một thời lượng chung đúng cho mọi cảnh.

## 5 Shape và cách biểu đạt thông tin

Xác định shape là container, connector, data mark, highlight, icon hay vật liệu chuyển cảnh. Vai trò quyết định cách nó chuyển động. Connector có hướng cần đúng quan hệ thông tin. Data mark có kích thước cần đúng thang đo. Màu cần nhãn hoặc dấu hiệu khác khi mang ý nghĩa.

Bar dọc tăng phải giữ đáy; bar ngang giữ cạnh trái. Với center anchor mặc định, Scale sẽ nở ra hai phía nên phải đổi anchor hoặc đồng thời tính Size và Position. Circle chỉ là tròn khi hai trục bằng nhau; không kéo méo logo, QR hoặc chữ để đầy ô.

## 6 Timeline và tính liên tục

Dùng interval [start,end), start gồm trong cảnh, end là boundary cảnh sau. Một scene 180 frame ở 30 fps có các frame 0 đến 179; thời điểm end là 6 giây. Với fps phân số, tính thời gian bằng fps_num/fps_den, không làm tròn thành một fps khác rồi trôi voice.

Chuyển cảnh cần một lý do ngữ nghĩa, hình học hoặc nhịp kể. Match cut có một điểm cắt; morph có trạng thái trung gian; spatial transition giữ quan hệ không gian. Loop cần khớp cả giá trị và hướng/tốc độ tại đường nối. Điểm cuối trông giống điểm đầu vẫn có thể giật khi vận tốc khác nhau.

## 7 Hệ tọa độ và anchor

Bộ tham chiếu dùng bbox comp (x,y,w,h). AE Position là vị trí anchor, không tự bằng góc bbox. Nếu precomp đặt gốc tại (cx,cy), tọa độ local là (x−cx,y−cy), trước khi xét transform khác. Parent và child cùng animate có thể nhân đôi chuyển động. Ghi rõ nơi áp motion và giới hạn biến đổi.

## 8 Dữ liệu và trạng thái bằng chứng

Tách fact đã xác minh, giả định bố trí và placeholder. Không nâng XX%, cột minh họa hoặc UI wireframe thành tuyên bố hiệu quả thực tế. Template được phép có placeholder khi người dùng yêu cầu template và nhãn nêu rõ. Final video có số liệu thực tế cần nguồn và đơn vị/kỳ phù hợp.

Phân biệt biết đặc tả, đã tạo style frame, đã render preview, đã export và đã kiểm tra file cuối. Validator cấu trúc không đo thẩm mỹ, không chứng minh người dựng đã nhìn source, và không xác nhận source không bị che ở mọi frame.

## 9 Thư viện mã và cách chọn

| Lớp | Câu hỏi | Mã |
| --- | --- | --- |
| Diện mạo | Hình ảnh mang ngôn ngữ gì? | A01–A20 |
| Bố cục | Nội dung nằm đâu và đọc theo thứ tự nào? | B01–B10, mẫu L01–L20 |
| Text | Chữ xuất hiện và diễn đạt nghĩa ra sao? | C01–C12 |
| Shape | Hình được tạo, kết nối, biến đổi thế nào? | D01–D12 |
| Nối cảnh | Hai ý/cảnh liên kết ra sao? | E01–E12 |
| Dạng cảnh | Dữ liệu, UI, camera hoặc footage được trình bày thế nào? | F01–F10 |
| Nhịp | Chuyển động có tính cách gì? | G01–G08 |
| Keyframe | Thông số triển khai tham chiếu là gì? | M01–M10 |

Một lựa chọn tốt có lý do gắn với nội dung, không chỉ tên phong cách. Các mã là hệ tra cứu làm việc, không phải tiêu chuẩn phân loại độc quyền của phần mềm.

## 10 Tính linh hoạt có trách nhiệm

Quy trình và các câu hỏi nền tảng là phần cốt lõi. Grid, font và preset là phần có thể thay. Với source 1920×1080/25 fps cần giữ format, không ép P/30 fps. Với đoạn phỏng vấn có người ở giữa, bố cục overlay cần dựa vào vùng trống thật. Với yêu cầu chỉ sửa một câu, bảo toàn phần còn lại và kiểm tra tác động của câu mới.
