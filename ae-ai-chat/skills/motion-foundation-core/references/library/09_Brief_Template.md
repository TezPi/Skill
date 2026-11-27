# Mẫu brief khung hình và motion

## Thông tin đầu vào

- Thương hiệu và mục tiêu:
- Người xem và ngữ cảnh sử dụng:
- Nền tảng và vị trí hiển thị:
- Profile P S hoặc L:
- Thời lượng và fps:
- Thông điệp chính:
- Nội dung bắt buộc và dữ liệu đã xác nhận:
- Voice và tốc độ đọc thực tế:
- Font, màu và asset nhận diện:
- Hành động mong muốn:

## Mẫu đặc tả một cảnh

| Trường | Điền thông tin |
| --- | --- |
| Scene ID và thời gian master | |
| Mục tiêu duy nhất của cảnh | |
| Layout L01 đến L20 và profile | |
| Style A và nhịp G | |
| Chữ thực tế theo từng layer TXT | |
| Bbox x y w h cần sửa so với mẫu | |
| Font size leading số dòng | |
| Shape và quan hệ mang ý nghĩa | |
| Keyframe entry và delay | |
| Trạng thái giữ để đọc | |
| Exit hoặc giữ tới cuối | |
| Transition và boundary master | |
| Nguồn số liệu và quyền dùng asset | |

## Prompt tái sử dụng với AI

```text
Dựa trên bộ Motion Grid AE này, hãy thiết kế storyboard cho nội dung tôi cung cấp.
Chọn profile và layout phù hợp trước khi viết motion.
Với mỗi scene, xuất chữ thực tế, bảng x/y/w/h, font/leading, shape,
thứ tự layer, keyframe theo frame cục bộ, mốc master và transition.
Phân biệt tọa độ vùng text với Position/Anchor trong AE.
Nếu thay nội dung làm tràn ô, hãy reflow hoặc tách cảnh và nêu quyết định.
Đánh dấu mọi dữ liệu còn thiếu; không biến placeholder thành số liệu thật.
Giữ một hành động chính ở mỗi thời điểm và có thời gian đọc.
Không tuyên bố đã dựng hay kiểm tra project AE nếu chỉ tạo đặc tả.

Nội dung video:
Người xem:
Kênh đăng:
Thời lượng:
Nhận diện:
CTA:
```

## Ví dụ chọn nhanh

Video giải thích dữ liệu 30 giây có thể dùng L01 → L04 → L10 → L15 → L19. Giữ style A01/A06, chữ M01, shape M02/M03 và transition master M06 ở các boundary được chỉ định. Đọc storyboard 30 giây để biết mốc frame cụ thể.
