# Workflow After Effects và kiểm tra bàn giao

## Tổ chức dự án đề xuất

Tạo thư mục comps master, comps scene, assets vector, assets image, audio và exports. Dùng tên SC01_L01_P, SC02_L04_P và MASTER_30S_P để nhận biết thứ tự và profile. Các prefix TXT, SH và FX trong tài liệu thể hiện loại layer, không phải lệnh tạo layer tự động.

Mỗi scene bắt đầu từ frame cục bộ 0. Dựng layout đứng yên ở F090 trước khi thêm motion. Thêm guides theo profile. Đặt font, leading, paragraph width và nội dung thực tế; xác nhận không tràn ô.

## Thứ tự dựng một scene

1. Tạo background toàn canvas và hệ guides.
2. Tạo các shape từ sau ra trước, kiểm tra bbox ở trạng thái đọc.
3. Tạo text box riêng, đặt font và line break.
4. Tính anchor và Position theo loại layer; dùng ΔP trong bảng để animate từ Position đứng yên.
5. Dựng entry, giữ, exit; đặc biệt giữ CTA ở cảnh cuối.
6. Nếu dùng precomp hoặc parent, chuyển tọa độ local đúng một lần. Không cộng tiếp tọa độ absolute từ bảng lên layer đã có parent offset.
7. Thêm transition trên master và nghe voice trước khi khóa timing.

## Hệ tọa độ khi precompose

Bảng là tọa độ comp gốc. Nếu precomp chỉ rộng bằng một card có góc trên trái (cx,cy), vị trí local của phần tử là (x−cx,y−cy). Nếu precomp giữ nguyên toàn canvas thì tọa độ vẫn giữ nguyên. Ghi rõ đang dùng cách nào để tránh nhân đôi offset.

## Kiểm tra nội dung và hình học

- Text chính đọc được trên điện thoại ở tỷ lệ hiển thị thật.
- Không mất dấu tiếng Việt, không có dòng bị cắt ở mép trên hoặc dưới.
- Khoảng trống và padding giữ nhất quán sau khi thay chữ.
- Text ở trạng thái đọc nằm trong vùng nội dung đề xuất; kiểm tra thêm giao diện nền tảng khi đăng.
- Shape tròn không bị kéo thành ellipse ngoài chủ đích thiết kế.
- Connector không đè chữ; đường và node đúng thứ tự lớp.
- Dữ liệu có nhãn, đơn vị, kỳ, nguồn và thang đo; bỏ các thanh placeholder trước khi xuất thật.

## Kiểm tra motion

- Không áp cùng Scale ở parent rồi thêm lại ở child ngoài chủ đích.
- Bar giữ baseline hoặc cạnh trái theo công thức M07.
- Đường vẽ đi đúng chiều, điểm đầu path đã được chọn đúng.
- Thời gian giữ phù hợp lượng chữ và voice; không có cảnh đọc dở đã chuyển.
- Match cut có hình, vị trí và kích thước đủ tương đồng.
- Loop khớp trạng thái và vận tốc, không để lại fade ở cuối chu kỳ.
- L19 giữ CTA đến cuối; QR thật được quét thử nếu dùng.

## Xuất và bàn giao

Xác nhận kích thước, fps, thời lượng và yêu cầu âm thanh với nơi nhận. Preview đầu, giữa, cuối và các điểm chuyển cảnh. Khi cần template tái sử dụng, chọn thuộc tính được sửa trong Essential Graphics và kiểm tra trên ứng dụng nhận. Không cam kết mọi expression hoặc effect đều chạy trong một runtime tương tác hay một định dạng vector khác.

Bộ Markdown hiện tại cung cấp đặc tả, sơ đồ và dữ liệu. Nó không xác nhận đã dựng hoặc render project AE.
