# Kết quả kiểm tra phiên bản 1.0

## Kiểm tra định lượng cấu trúc

36 bài thử deterministic của validator và wrapper đạt. Các fixture có evidence tổng hợp chỉ dùng kiểm tra logic khai báo; không có kiểm tra chất lượng hình ảnh hoặc render AE thật.

## Ba tình huống hành vi

1. Thiếu source: nhận diện phần thiếu, không bịa quan sát, chỉ làm plan sơ bộ.
2. Brief ngang 1920×1080, 25 fps, 12 giây: giữ format, có hai scene tổng 300 frame và chừa vùng logo.
3. Plan tự khai ready nhưng sai bố cục, dữ liệu và review: tính lại readiness và chặn xuất final.

Mỗi tình huống có một lượt dùng skill và một lượt baseline. Cả hai cấu hình đều đáp ứng bốn tiêu chí của từng tình huống. Do đó không kết luận skill làm mô hình tốt hơn trên mọi tác vụ. Giá trị kiểm chứng riêng của bộ này là đặc tả có cấu trúc và công cụ gate có thể tích hợp vào host.

Không có số token hoặc runtime đáng tin từ thông báo hoàn thành, nên không so sánh tốc độ/chi phí. Bảng đọc kết quả và phản hồi nằm ở review.html trong cùng thư mục evals. Đây là kiểm tra bản v1; chất lượng thị giác vẫn cần được thử với source và renderer thực tế.
