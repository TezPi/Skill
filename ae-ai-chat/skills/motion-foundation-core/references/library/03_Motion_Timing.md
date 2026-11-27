# Motion timeline và keyframe

## Đồng hồ thời gian

Comp chính 30 fps. Một mẫu mặc định dài 180 frame, tương đương 6 giây. Các frame hiển thị có chỉ số F000 đến F179; F180 là điểm bắt đầu cảnh tiếp theo. Thời gian giây = chỉ số frame / 30. Mốc F179 nằm ở 5,9667 giây.

Trong bảng từng layer: ΔP là độ lệch so với Position đứng yên đã bố trí. O là Opacity phần trăm. S là Scale phần trăm, áp đều X/Y nếu không ghi khác. End là thuộc tính Trim Paths, không phải thời điểm kết thúc comp.

## Bốn mốc hình minh họa

Các filmstrip cho thấy F006 đang vào, F024 đang dựng thông tin, F090 là trạng thái đọc, F168 đang ra. Đây là các mẫu tính toán từ thông số motion, không phải kết quả render bằng AE. Nhãn và bảng tọa độ mới là nguồn thông số thực hiện.

## Preset có thông số

| Mã | Mốc vào tính từ delay d | Giữ | Cách dựng |
| --- | --- | --- | --- |
| M01 Rise And Fade | d: ΔP(0,+60), O0; d+18: ΔP(0,0), O100; d+24: ổn định. | Giữ vị trí đứng yên đến exit. | Position và Opacity; matte cố định là lớp bổ sung khi muốn masked reveal. |
| M02 Card Pop | d: S92%, O0; d+3: O100; d+10: S103%; d+18: S100%. | Giữ S100%. | Scale quanh tâm hình, không tự parent text rồi áp thêm lần nữa. |
| M03 Line Draw | d: End0%; d+24: End100%, O100. | Giữ đường đã vẽ. | Stroke và Trim Paths; điểm bắt đầu path quyết định hướng vẽ. |
| M04 Morph | F000: path A; F018: hình trung gian; F036: path B. | Giữ B đến F150. | Chuẩn hóa số/thứ tự điểm; tự vẽ trung gian khi nội suy xấu. |
| M05 Data Dot | Sau khi đường có: phase 0→1 trong 60 frame. | Lặp đường chạy khi nội dung còn nói về luồng. | Position theo path; Auto-Orient nếu đối tượng cần quay hướng. |
| M06 Master Wipe | C-12: chưa che; C: phủ 100%; C+12: lộ cảnh mới. | C là boundary của hai scene. | Một overlay trên master, không kéo dài từng scene và cộng thời gian hai lần. |
| M07 Bar Grow | d: kích thước trục tăng=0; d+24: kích thước đích. | Giữ baseline và vị trí cuối. | Bar dọc giữ đáy; bar ngang giữ cạnh trái; đồng thời điều chỉnh Size và tâm. |
| M08 Number Counter | F018: giá trị đầu; F060: giá trị đích. | Giữ kèm nhãn, đơn vị, kỳ và nguồn. | Slider/Source Text; dùng số thật đã xác nhận. |
| M09 Reflow | F090: bbox A; F108: bbox B; F120: đã ổn định. | Đưa nội dung trọng tâm vào bbox B. | Animate slot; cập nhật text box và line break thay vì scale méo chữ. |
| M10 Poster Loop | F000 và F120 cùng trạng thái; chu kỳ 120 frame. | Text chính giữ tĩnh. | Khớp vận tốc hai đầu; chế độ loop này thay timeline exit mặc định. |

## Exit mặc định của các layout

Với delay d: e0=150+min(floor(d/6),5)×2; e1=min(e0+18,179). Từ e0 tới e1, ΔP đi từ (0,0) tới (-48,0) và O từ 100 tới 0. Cụm ra theo thứ tự nhẹ, kết thúc trước boundary.

L19 mặc định giữ đến hết để đọc CTA. L20 mặc định giữ chữ; muốn loop phải áp M10 và bỏ exit. Các mốc trong bảng entry không tự đảm bảo loop liền.

Nếu chọn match cut E02, bỏ exit trên thành phần dùng để match và giữ vị trí khớp đến frame cuối. Nếu chọn wipe M06, overlay nằm trên master che điểm cắt.

## Giữ baseline khi bar tăng

- Bar dọc ở bbox (x,y,w,h), tiến độ q từ 0 đến 1: Size=[w,h×q], Position=[x+w/2,y+h−h×q/2].
- Bar ngang: Size=[w×q,h], Position=[x+w×q/2,y+h/2].
- Không animate Scale quanh tâm mặc định nếu muốn giữ đáy hoặc trái cố định.

## Easing

Tính toán hình minh họa sử dụng easeOutCubic(u)=1−(1−u)^3 với u được giới hạn trong [0,1]. Đây là hàm tham chiếu để mô tả tốc độ, không phải khẳng định một giá trị Influence của AE sẽ cho đường cong giống hệt.

Trong AE có thể dựng bằng expression theo hàm này hoặc dùng Graph Editor để đạt cảm giác tương ứng. M02 có keyframe vượt đích riêng; không dùng một đường easing duy nhất để giả định sẽ tự tạo spring.

## Thời gian đọc

Các mẫu 6 giây là điểm bắt đầu, không phải thời lượng bắt buộc. Khi thay nội dung, hãy nghe voice và xem ở kích thước điện thoại. Tăng hold hoặc tách cảnh nếu người xem phải đọc nhiều. Không tiếp tục thêm motion chỉ để lấp thời gian.

## Ví dụ hình học để dựng motion trực tiếp

### Wipe ngang M06 với tọa độ đầy đủ

Tạo rectangle Size=[W,H], path Position=[0,0], Anchor layer=[0,0]. Không thêm stroke. Đặt layer trên tất cả scene trong master. C là frame boundary.

| Mốc | Position theo canvas W H | Profile P 1080 × 1920 |
| --- | --- | --- |
| C−12 | [−W/2,H/2] | [−540,960] |
| C | [W/2,H/2] | [540,960] |
| C+12 | [3W/2,H/2] | [1620,960] |

Rectangle đi từ ngoài trái, phủ đủ khung tại C, rồi đi ra phải. Tại C thay comp bên dưới bằng scene tiếp theo. Dùng một màu wipe chung cho hai cảnh; interpolation tuyến tính là lựa chọn đơn giản cho ví dụ này. Có thể đổi easing sau khi đã xác nhận frame C vẫn phủ đủ.

### Morph bốn điểm M04

Path đóng, không có tangent cong; tất cả điểm dưới đây theo tọa độ comp. Đặt shape layer và group không có offset hoặc chuyển điểm đúng sang local space.

| Frame | Vertex 1 | Vertex 2 | Vertex 3 | Vertex 4 |
| --- | --- | --- | --- | --- |
| F000 | (540,840) | (660,960) | (540,1080) | (420,960) |
| F018 | (480,840) | (660,900) | (600,1080) | (420,1020) |
| F036 | (420,840) | (660,840) | (660,1080) | (420,1080) |

Hình thoi biến thành hình vuông. Giữ cùng thứ tự điểm và path đóng. Muốn dùng hình tròn cần path cong và tangents khác; không áp các vertex thẳng này rồi gọi đó là hình tròn.

### Điểm dữ liệu M05 trên connector của L03

Tạo chấm tròn Size=[24,24]. Path từ P0=(276,1140) đến P1=(804,1140). Sau khi đường đã vẽ xong, q tăng từ 0 đến 1 trong 60 frame, Position=P0+(P1−P0)×q. Trong 2 frame cuối giảm Opacity về 0, reset về P0 khi vô hình rồi mở chu kỳ mới. Chấm không được biến thành bằng chứng về tốc độ hoặc thời gian truyền dữ liệu thật.

### Reflow M09 từ một ô sang một vùng lớn

Ví dụ SH_TILE_1 của L06: F090 bbox=(72,672,616,336); F108 bbox=(72,648,936,744); F120 ổn định. Tính lại Size và Position tâm từ bbox ở từng keyframe. Nội dung cũ fade ra F096–F104; nội dung mới fade vào F108–F120 bằng text box mới. Không dùng Scale X/Y khác nhau để ép chữ cũ lấp đầy vùng mới.

### Loop M10 tách riêng đoạn entry

Tạo loop comp 120 frame tại 30 fps. Trong loop, text đã đứng yên và O100; bỏ entry/exit của đoạn 180 frame. Shape giữ Position, Scale đồng đều S(f)=100+4×sin(2πf/120+phase), trong đó f là frame cục bộ và phase là 0, 2π/3 hoặc 4π/3 cho ba shape.

F120 là trạng thái toán học trùng F000 nhưng không xuất thêm frame F120; clip chứa F000–F119. Cả giá trị và vận tốc khớp ở đường nối. Nếu có đoạn entry trước loop, render hoặc ghép entry một lần trước clip loop; không lặp lại entry mỗi chu kỳ.
