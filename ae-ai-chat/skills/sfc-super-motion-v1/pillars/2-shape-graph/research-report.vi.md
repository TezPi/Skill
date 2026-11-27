# Báo Cáo Nghiên Cứu Chuyên Sâu và Đóng Gói AI Skill: Kiến Trúc Tạo Shape Vector & Hệ Thống Đồ Thị Chuyển Động (Motion Graph) Trong Motion Graphics Đa Lĩnh Vực

Sự khác biệt cốt lõi giữa một sản phẩm Motion Graphics chuyên nghiệp và
các chuyển động "AI-slop" (chuyển động máy móc, rời rạc do mô hình tự
suy diễn) không nằm ở năng lực viết mã hay vẽ hình của mô hình ngôn ngữ
lớn (LLM), mà nằm ở sự thiếu hụt hai bộ khung định lượng: **Cấu trúc
phân cấp tạo Shape (Procedural Shape Hierarchy)** và **Toán học đồ thị
vận tốc/vật lý (Motion Graph & Physics Architecture)**. Khi không được
cung cấp thông số kỹ thuật cụ thể, các mô hình AI thường mặc định sử
dụng nội suy tuyến tính (linear interpolation), chỉ làm mờ đơn điệu
(opacity-only fade), kích hoạt mọi phần tử cùng một lúc, đặt sai tâm
xoay (Anchor Point) và áp dụng các đường cong mặc định yếu ớt như Easy
Ease 33.3%. Báo cáo này tổng hợp quy chuẩn kỹ thuật từ tài liệu chính
thức của Adobe After Effects, Lottie/Bodymovin, Rive, Cavalry, Remotion,
Google Material Design 3, Apple SwiftUI cùng kinh nghiệm thực chiến từ
cộng đồng thiết kế chuyển động quốc tế (School of Motion, Ben Marriott,
Emil Kowalski, Jakub Krehel, Dan Ebberts và diễn đàn r/AfterEffects) để
thiết lập một hệ quy chiếu định lượng rõ ràng cho AI.

Để giải quyết triệt để tình trạng AI "mò mẫm" không đúng yêu cầu
(insight) của người viết prompt, toàn bộ tri thức nghiên cứu dưới đây
được hệ thống hóa theo nguyên lý **Quyết định dựa trên thông số
(Parameter-First Decision)**. Cụ thể, mọi hình khối phức tạp đều được
quy về cây phân cấp nhóm (Group), hệ trục biến đổi kép (Dual-Transform),
thứ tự kết xuất ngược từ dưới lên (Bottom-to-Top Render Order) và chuỗi
toán tử (Trim Paths, Repeater, Merge Paths, Offset Paths). Song song đó,
mọi chuyển động đều được neo vào tỷ lệ ảnh hưởng của đồ thị vận tốc
(Influence %), tọa độ cubic-bezier(x1, y1, x2, y2) chuẩn hóa, hệ phương
trình lò xo (mass, stiffness, damping) và quy luật bất đối xứng vào/ra
(Enter/Exit Asymmetry). Phần cuối của báo cáo cung cấp gói **AI Skill
(SKILL.md và theme.ts)** hoàn chỉnh, sẵn sàng tích hợp trực tiếp vào
Claude Code, Cursor, Remotion Agent hoặc các quy trình sinh kịch bản
After Effects/Lottie tự động.

## Phần 1: Giải Phẫu Cấu Trúc Tạo Shape (Procedural Shape & Vector Architecture)

Trong các phần mềm và công cụ kết xuất đồ họa vector hiện đại (After
Effects, Lottie JSON, Rive, Cavalry), một Shape Layer không phải là một
bức ảnh tĩnh mà là một "vũ trụ vi mô" độc lập chứa cây phân cấp dữ liệu
riêng biệt bên trong thư mục Contents (hoặc mảng shapes trong Lottie).
Việc AI tạo ra các hình khối bị lệch tâm khi xoay, vỡ nét khi biến hình
(morphing), hoặc biến mất khi cắt lớp (masking) đều xuất phát từ việc vi
phạm ba quy luật kiến trúc nền tảng: Hệ trục Biến đổi Kép
(Dual-Transform), Thứ tự Kết xuất Ngược (Bottom-to-Top Render Stack), và
Sự phân tách giữa Tham số (Parametric) với Đường cong Bézier (Bezier
Path).

### 1.1. Kiến trúc Biến đổi Kép (Dual-Transform Architecture) và Quy tắc Số Không (The Rule of Zero)

Mỗi Shape Layer luôn tồn tại song song ít nhất hai cấp độ không gian tọa
độ (Transform), và sự nhầm lẫn giữa hai hệ trục này là nguyên nhân hàng
đầu gây ra lỗi lệch quỹ đạo xoay (off-axis rotation) trong các đoạn mã
hoặc kịch bản do AI sinh ra. Ở cấp độ vĩ mô (Macro-level), **Layer
Transform (Transform cấp Layer)** điều khiển toàn bộ thư mục Contents
như một khối thống nhất, quản lý Anchor Point, Position, Scale, Rotation
và Opacity của cả layer trên khung hình chính (Composition). Ngược lại,
ở cấp độ vi mô (Micro-level), **Group Transform (Transform: \[Shape
Name\] trong AE hoặc phần tử 'tr' trong Lottie)** chỉ điều khiển nhóm
hình học cụ thể nằm bên trong nó. Điểm khác biệt kỹ thuật quan trọng là
Group Transform sở hữu thêm hai thuộc tính độc quyền: **Skew** (Độ
nghiêng biến dạng) và **Skew Axis** (Trục nghiêng), cho phép tạo hiệu
ứng quán tính nghiêng (italicized momentum) hoặc giả lập góc nhìn
2.5D/Isometric cục bộ mà không làm biến dạng toàn bộ layer.

Từ cấu trúc kép này, các chuyên gia thiết kế chuyển động đặt ra **Quy
tắc Chuyên nghiệp Số Không (The Professional Rule of Zero)**: trước khi
bắt đầu bất kỳ hoạt động diễn hoạt nào hoặc áp dụng toán tử nhân bản
(Repeater trong AE/Lottie hoặc Duplicator trong Cavalry), thuộc tính
Position của Group Transform và Parametric Path bắt buộc phải được đặt
về tọa độ **\[0, 0\]**. Thao tác này đồng bộ tâm hình học của Shape
trùng khít với Anchor Point của Layer. Trong phần mềm Cavalry, node
Duplicator thậm chí được lập
trình để tự động phớt lờ thông tin Transform của Input Shape gốc nhằm
đặt các bản sao chính xác tại \[0, 0\] của từng điểm phân bổ; nếu người
thiết kế muốn tạo độ lệch vị trí tương đối so với điểm neo của lưới nhân
bản, Shape đó bắt buộc phải được bọc trong một Group giữ nguyên tọa độ
\[0, 0\].

### 1.2. Thứ tự Kết xuất Ngược (Bottom-to-Top Render Order) và Hiệu năng Tô màu

Bên trong thư mục Contents của một Shape Layer (hoặc bên trong một
Group), luồng tính toán dữ liệu (Render Pipeline) diễn ra theo chiều
**từ dưới lên trên (Bottom-to-Top)** trong bảng Timeline—ngược lại với
cách đọc văn bản thông thường nhưng tương đồng với việc xếp chồng các
lớp sơn. Theo tài liệu kỹ thuật của Adobe, hình học nằm ở dưới cùng của
ngăn xếp nhóm trong bảng Timeline sẽ được kết xuất trước tiên, và các
toán tử đường dẫn (Path Operations/Modifiers) chỉ tác động lên các đường
dẫn (Paths), nhóm (Groups) hoặc thuộc tính vẽ (Fills/Strokes) nằm **phía
trên** chúng trong cùng một nhóm.

Quy tắc tối ưu hóa cốt lõi cho cả After Effects và Lottie JSON là luôn
đặt Fill và Stroke ở vị trí dưới cùng của ngăn xếp toán tử (ngay phía
trên Group Transform). Việc đặt Fill hoặc Stroke nằm phía trên các đường
dẫn (Paths) hoặc các toán tử biến đổi (Operators) sẽ buộc After Effects
phải tính toán lại vùng tô màu nhiều lần trên mỗi khung hình hoặc bỏ qua
các đường dẫn nằm dưới, làm tăng đáng kể thời gian render. Đặc biệt, vị
trí tương đối giữa Repeater và Fill/Stroke quyết định trực tiếp bản chất
thị giác của dải màu. Khi Repeater nằm **phía trên** Fill và Stroke, hệ
thống nhân bản các đường path hình học trước rồi mới áp dụng một lớp tô
màu chung cho toàn bộ tập hợp bản sao như một đường dẫn phức hợp duy
nhất (Compound Path)—rất hiệu quả khi muốn một dải Linear Gradient trải
dài liền mạch qua tất cả các bản sao. Ngược lại, khi Repeater nằm **phía
dưới** Fill và Stroke, hệ thống tô màu và kẻ viền cho hình gốc trước rồi
mới nhân bản cả hình lẫn màu, khiến mỗi bản sao mang một dải Gradient
độc lập giống hệt nhau.

### 1.3. Các Mẫu Thiết Kế Hình Học Nâng Cao (Advanced Procedural Shape Patterns)

Để AI có thể tạo ra các cấu trúc đồ họa phức tạp mà không làm rối loạn
cây thư mục, bốn mẫu thiết kế chuẩn công nghiệp dưới đây cần được áp
dụng nhất quán:

1.  **Kỹ thuật Cắt Lớp Lồng Nhau bằng Merge Paths (The Nested Merge
    Paths Matte Pattern):** Thông thường, để cắt một họa tiết (như con
    ngươi mắt hoặc các sọc trang trí trên bình hoa) nằm gọn bên trong
    một hình gốc, quy trình thủ công thường tách thành nhiều layer và
    dùng Alpha Matte hoặc Pre-comp gây phình to số lượng layer. Phương
    pháp tối ưu của School of Motion thực hiện toàn bộ bên trong một
    Shape Layer duy nhất bằng cách tạo một Group con (ví dụ: "Pupil"
    hoặc "Stripes"), bên trong chứa bản sao của hình gốc đóng vai trò
    làm khuôn cắt (Mask Shape) đặt cùng cấp với hình họa tiết cần cắt,
    sau đó thêm toán tử Merge Paths ở chế độ **Intersect** và đặt Fill
    màu của họa tiết ngay bên dưới Merge Paths đó. Tuy nhiên, nếu họa
    tiết bên trong Group con sử dụng Repeater (ví dụ: tạo nhiều sọc
    ngang trang trí), việc bật Merge Paths (Intersect) trực tiếp sẽ
    khiến các sọc biến mất hoàn toàn vì After Effects đọc mỗi bản sao
    của Repeater như một hình rời rạc. Giải pháp bắt buộc là phải chèn
    một toán tử Merge Paths phụ đặt ở chế độ **Add** nằm ngay bên dưới
    Repeater bên trong nhóm họa tiết để gộp toàn bộ các bản sao của
    Repeater thành một hình phức hợp duy nhất (Single Compound Shape)
    trước khi nhóm bên ngoài thực hiện phép tính Merge Paths
    (Intersect) với hình khuôn mẫu. Cần lưu ý rằng kỹ thuật Merge
    Paths (Intersect) không áp dụng được cho các hình chỉ có viền
    (Stroke) mà không có Fill, bởi phép toán Boolean sẽ tự động đóng
    kín đường viền (close the loop) dọc theo cạnh giao cắt của khuôn
    mẫu.

2.  **Hộp Nền Tự Động Co Giãn Theo Chữ (sourceRectAtTime() Responsive
    Box):** Khi thiết kế các bảng tên (Lower-thirds), nút bấm động
    hoặc phụ đề (Captions), thay vì keyframe kích thước hộp nền thủ
    công, quy chuẩn công nghiệp sử dụng biểu thức sourceRectAtTime()
    gắn trực tiếp vào thuộc tính Size của Rectangle Path để đọc kích
    thước pixel thực tế của layer chữ theo thời gian thực kèm theo
    khoảng đệm (padding, ví dụ: \[L.sourceRectAtTime().width + 40,
    L.sourceRectAtTime().height + 20\]).

3.  **Hình học Chất lỏng (Liquid / Metaball Geometry):** Khi kết hợp các
    hình chuyển động gần nhau bên trong cùng một Group, việc sử dụng
    Merge Paths kết hợp với toán tử Offset Paths (mở rộng/co rút đường
    biên với thuộc tính Line Join đặt thành **Round**) sẽ biến các góc
    nhọn của chữ hoặc hình khối thành các dạng hình học bo tròn dính
    liền nhau như giọt nước hay tế bào phân tách (cellular/fluid
    transitions) mà không cần dùng đến các hiệu ứng làm mờ điểm ảnh
    (Gaussian Blur) vốn không được hỗ trợ khi xuất sang vector Lottie.

4.  **Cấu trúc Procedural trong Cavalry và Rive:** Trong **Cavalry**, hệ
    thống nhân bản nâng cao kết hợp bộ ba **Duplicator** (phân bổ hình
    học theo Grid, Circle, Point Cloud) + **Falloff** (xuất giá trị
    trọng số từ 1 tại tâm giảm dần về 0 ở rìa theo hình học Circle,
    Rectangle, Linear hoặc Sweep radar) + **Oscillator** (biến thiên
    giá trị hoặc biến dạng lưới theo hàm lượng giác Sine, Cosine,
    Tangent với thuộc tính Stagger tạo độ lệch pha giữa các bản sao).
    Để tạo chuyển động tròn từ hai bộ Oscillator gắn vào trục X và Y,
    tài liệu Cavalry chỉ định đặt Time Offset = 0.25 cho một trong hai
    bộ; và để khóa vòng lặp chính xác theo số khung hình N bất chấp
    việc thay đổi FPS của Composition, ta nối Composition Frame Rate
    chia cho N vào thuộc tính Frequency của Oscillator (frequency =
    fps / N). Trong khi đó, **Rive** tách biệt rõ **Shape Layer**
    (chứa định nghĩa Fill, Stroke, và Trim Path ở chế độ Sequential
    hoặc Synced) với các **Path Layer** con nằm bên trong, đồng thời
    cung cấp công cụ **Joysticks** (tay cầm điều khiển 2 trục X/Y có
    Origin mặc định \[0.5, 0.5\] dùng để tua qua các Timeline tư thế)
    và **State Machines** (máy trạng thái gồm States, Inputs,
    Listeners và Transitions có cấu hình nội suy Easing riêng).

### 1.4. Kỹ thuật Hình học Tham số (Parametric) vs. Đường cong Bézier (Bezier Paths) & Quy luật Morphing

Khi xây dựng hình học cho chuyển động, AI cần phân biệt rõ khi nào dùng
**Parametric Path** (Đường dẫn tham số) và khi nào dùng **Bezier Path**
(Đường dẫn điểm nút và tiếp tuyến). Đối với các hình cơ bản như nút bấm
giao diện, vòng tròn tải trang, ngôi sao, đa giác, bánh răng hay hoa văn
mandala, việc sử dụng Parametric Shapes (Rectangle 'rc', Ellipse 'el',
Polystar 'sr') luôn được ưu tiên thay vì vẽ bằng Bezier Path. Hình tham
số giúp giảm đáng kể dung lượng file Lottie JSON và tăng hiệu năng
render vì chỉ lưu trữ vài tham số vô hướng (Size \[width, height\],
Position \[x, y\], Roundness r, Points pt, Inner/Outer Radius ir/or,
Inner/Outer Roundness is/os) thay vì hàng chục mảng tọa độ đỉnh và tiếp
tuyến.

Khi các bộ kết xuất (renderers) chuyển đổi hình tham số thành đường cong
Bézier để phục vụ Trim Paths, chúng tuân thủ các quy tắc toán học cụ
thể. Mọi hình Ellipse và góc bo tròn (Rounded Corners) đều sử dụng hằng
số **ELLIPSE_CONSTANT = 0.5519** nhân với bán kính (tangent = radius \*
0.5519) để tính độ dài tiếp tuyến Bézier (in_tangent, out_tangent) xấp
xỉ một phần tư cung tròn. Về chiều vẽ (Shape Direction 'd'), hình
Ellipse luôn bắt đầu từ đỉnh cao nhất (vị trí 12 giờ: (x, y - radius.y))
và đi theo chiều kim đồng hồ (Clockwise). Hình Rectangle có góc nhọn (r
\<= 0) bắt đầu từ góc trên bên phải (right, top) đi theo chiều kim đồng
hồ qua 4 đỉnh; khi có bo góc (r \> 0), nó tách thành 8 đỉnh với bán kính
bo thực tế là rounded = min(width/2, height/2, r). Một lưu ý quan trọng
trong Lottie Web là nếu thiếu thuộc tính d, Rectangle mặc định bị đảo
chiều ngược lại; và với mọi shape, khi d = 3, đường dẫn sẽ bị đảo ngược
chiều (Reversed)—yếu tố quyết định trực tiếp hướng chạy của Trim Paths.
Đối với PolyStar ('sr'), với số đỉnh \text{points} = \text{round}(pt),
góc khởi tạo được tính bằng \alpha = -r \cdot \frac{\pi}{180} -
\frac{\pi}{2}, bước góc là \theta = -\frac{\pi}{\text{points}}, và độ
dài tiếp tuyến bo tròn ngoài là \text{tan\\len\\out} = \frac{2\pi \cdot
\text{or}}{4 \cdot \text{points}} \cdot \frac{\text{os}}{100} (tương tự
cho bán kính trong \text{ir} và độ bo trong \text{is} khi \text{sy} = 1
là hình ngôi sao).

Khi các tham số hình học cơ bản không đáp ứng được hình dáng tự do hoặc
cần biến hình (Morphing), đường dẫn được chuyển sang **Đường cong Bézier
(Path 'sh')**. Trong cấu trúc dữ liệu Lottie, một đối tượng Bézier được
định nghĩa bởi 4 thuộc tính bắt buộc: mảng tọa độ đỉnh **v** (Vertices),
mảng tiếp tuyến vào **i** (In Points), mảng tiếp tuyến ra **o** (Out
Points — cả i và o đều phải có cùng số lượng phần tử với v), và cờ đóng
kín **c** (Is Closed: boolean). Để thực hiện hiệu ứng biến hình
(Morphing) giữa hai hình dạng Bézier mà không bị xoắn hoặc lộn trái
đường path, AI phải tuân thủ **Hai Định Luật Biến Hình (The Two Laws of
Morphing)**:

1.  **Đồng bộ Đỉnh Khởi đầu (First Vertex Alignment):** Đỉnh đầu tiên
    (index 0 trong mảng v, hoặc thiết lập qua Mask and Shape \> Set
    First Vertex trong AE) của hình nguồn và hình đích phải được đồng
    bộ ở cùng một vị trí tương ứng về mặt không gian.

2.  **Bảo toàn Số lượng Đỉnh (Equal Vertex Count):** Số lượng đỉnh trong
    mảng v của hai hình phải bằng nhau để đảm bảo nội suy sạch không
    bị biến dạng rác (artifact-free interpolation). Ví dụ, để biến
    hình một hình vuông (4 đỉnh) thành một ngôi sao 5 cánh (10 đỉnh),
    người thiết kế phải chủ động chèn thêm 6 đỉnh phụ vào hình vuông
    để cả hai cùng có đúng 10 đỉnh, đồng thời luôn giữ tổng số đỉnh ở
    mức tối thiểu cần thiết để tối ưu hóa dung lượng file JSON. Đối
    với các chuyển động uốn lượn phức tạp như biểu cảm khuôn mặt, cờ
    bay hoặc chữ động, thay vì keyframe trực tiếp dữ liệu đường dẫn
    thô, quy trình nâng cao sử dụng script Create Nulls From Paths
    trong AE để gắn từng đỉnh (vertex) vào một đối tượng Null điều
    khiển độc lập (hoặc dùng hệ thống Bones và Meshes trong Rive).

### 1.5. Hệ thống Phân loại và Thông số Toàn diện của các Toán tử Đường dẫn (Path Modifiers)

Các toán tử biến đổi (Path Operations trong After Effects / Modifiers
trong Lottie, Rive, Cavalry) biến các hình cơ bản thành một hệ thống
sinh hình tự động (Generative Geometry Engine). Bảng dưới đây tổng hợp
toàn bộ 17 phần tử cốt lõi của Shape Layer cùng mã định danh hệ thống
trong Adobe Scripting (Match Name), mã kiểu dữ liệu trong Lottie JSON
(ty), các thuộc tính điều khiển và quy tắc vận hành chuẩn xác:

| Nhóm Phần Tử              | Tên Hiển Thị (AE / Chuẩn)    | Adobe Scripting Match Name              | Mã Lottie (ty) | Khóa Thuộc Tính Lottie & Tham Số Chính                                                                                        | Cơ Chế Hoạt Động & Quy Tắc Ứng Dụng Chuyên Sâu                                                                                                 |
|---------------------------|------------------------------|-----------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| **Container & Transform** | **Group**                    | ADBE Vector Group                       | 'gr'           | it (Items Array), bm (Blend Mode), nm (Name)                                                                                  | Nhóm chứa các phần tử con; cô lập phạm vi tác động của các Modifiers bên trong nhóm.                                                           |
| **Container & Transform** | **Transform Shape**          | ADBE Vector Transform Group             | 'tr'           | a (Anchor), p (Position), s (Scale), r (Rotation), o (Opacity), sk (Skew), sa (Skew Axis)                                     | Đặt ở cuối mảng it của Group; luôn khởi tạo p = \[0,0\] (Rule of Zero).                                                                        |
| **Parametric Shapes**     | **Rectangle**                | ADBE Vector Shape - Rect                | 'rc'           | s (Size \[w,h\]), p (Position \[x,y\]), r (Roundness), d (Direction)                                                          | Tạo nút bấm pill-shape hiện đại bằng cách đặt r cao; hỗ trợ co giãn tự động theo chữ qua sourceRectAtTime().                                   |
| **Parametric Shapes**     | **Ellipse**                  | ADBE Vector Shape - Ellipse             | 'el'           | s (Size \[w,h\]), p (Position \[x,y\]), d (Direction)                                                                         | Vẽ từ đỉnh 12 giờ theo chiều kim đồng hồ; dùng hằng số tiếp tuyến 0.5519.                                                                      |
| **Parametric Shapes**     | **Polystar**                 | ADBE Vector Shape - Star                | 'sr'           | sy (Type: 1=Star, 2=Polygon), pt (Points), p, r, or/ir (Outer/Inner Radius), os/is (Roundness %)                              | Biến thiên pt, ir/or và is/os để tạo bánh răng, hoa văn hình học, cầu gai hoặc mandala.                                                        |
| **Bezier Path**           | **Path**                     | ADBE Vector Shape - Group               | 'sh'           | ks (Bezier object chứa v, i, o, c), d (Direction)                                                                             | Dùng cho hình tự do và Morphing; tuân thủ nghiêm ngặt 2 định luật đồng bộ đỉnh đầu và số lượng đỉnh.                                           |
| **Paint (Style)**         | **Fill / Gradient Fill**     | ADBE Vector Graphic - Fill / G-Fill     | 'fl' / 'gf'    | c (Color \[r,g,b\]), o (Opacity 0–100), r (Fill Rule: Non-Zero Winding / Even-Odd)                                            | Áp dụng cho mọi đường path nằm phía trên nó trong cùng Group; đặt ở đáy ngăn xếp để tối ưu tốc độ render.                                      |
| **Paint (Style)**         | **Stroke / Gradient Stroke** | ADBE Vector Graphic - Stroke / G-Stroke | 'st' / 'gs'    | c (Color), o (Opacity), w (Width), lc (Line Cap), lj (Line Join: Miter/Round/Bevel), ml (Miter Limit), d (Dashes array)       | Kẻ viền liên tục hoặc nét đứt (dash + gap + offset); khi Miter Limit = 4, góc nhọn vượt quá 4 lần độ dày nét sẽ tự chuyển sang Bevel.          |
| **Path Modifiers**        | **Trim Paths**               | ADBE Vector Filter - Trim               | 'tm'           | s (Start 0–100%), e (End 0–100%), o (Offset góc 0–360°+), m (Trim Multiple: Simultaneous/Synced hoặc Individually/Sequential) | Cắt và diễn hoạt chiều dài nét vẽ (Write-on, biểu đồ đường/tròn, tia sáng); kết hợp s, e lệch pha và o xoay vòng để tạo nét đuổi nhau.         |
| **Path Modifiers**        | **Repeater**                 | ADBE Vector Filter - Repeater           | 'rp'           | c (Copies), o (Offset), m (Composite: Above/Below), tr (Repeater Transform gồm p, s, r, so Start Opacity, eo End Opacity)     | Tạo n bản sao ảo; mỗi bản sao thứ k bị biến đổi lũy tiến k lần giá trị Transform; nối chuỗi 2 Repeater (ngang + dọc) để tạo ma trận lưới.      |
| **Path Modifiers**        | **Merge Paths**              | ADBE Vector Filter - Merge              | 'mm'           | mm (Mode: Merge, Add, Subtract, Intersect, Exclude Intersections)                                                             | Toán tử Boolean phi phá hủy ngay trong 1 layer, loại bỏ nhu cầu dùng Alpha Matte và Pre-comp.                                                  |
| **Path Modifiers**        | **Offset Paths**             | ADBE Vector Filter - Offset             | 'op'           | a (Amount: + phình to, - thu nhỏ), lj (Line Join), ml (Miter Limit), copies, copyOffset                                       | Mở rộng hoặc co rút đường biên; đặt Line Join = Round tạo hiệu ứng hình học chất lỏng (Liquid Geometry).                                       |
| **Path Modifiers**        | **Round Corners**            | ADBE Vector Filter - RC                 | 'rd'           | r (Radius — bán kính bo tròn tính bằng pixel)                                                                                 | Làm tròn các góc nhọn của đường dẫn bằng cung tròn xấp xỉ qua hằng số 0.5519.                                                                  |
| **Path Modifiers**        | **Pucker & Bloat**           | ADBE Vector Filter - PB                 | 'pb'           | a (Amount: kéo đỉnh vào trong hoặc đẩy ra ngoài quanh tâm trung bình các đỉnh, chuẩn hóa chia 100)                            | Kéo các đỉnh ra ngoài đồng thời uốn cong đoạn nối vào trong (Pucker) hoặc ngược lại (Bloat).                                                   |
| **Path Modifiers**        | **Wiggle Paths**             | ADBE Vector Filter - Roughen            | (AE Native)    | Size, Detail (mật độ đỉnh), Points (Smooth/Corner), Wiggles/Second, Correlation (0–100%), Temporal/Spatial Phase, Random Seed | Tự động làm nhiễu đường biên theo thời gian không cần keyframe; Correlation thấp tạo răng cưa hỗn loạn, cao tạo sóng đồng bộ.                  |
| **Path Modifiers**        | **Wiggle Transform**         | ADBE Vector Filter - Wiggler            | (AE Native)    | Wiggles/Second, Correlation (0–100%), Temporal/Spatial Phase, Random Seed, Transform (Position, Anchor, Scale, Rotation)      | Đặt **sau (bên dưới)** Repeater với Correlation = 0% để mỗi bản sao tự dao động, xoay và co giãn độc lập (mô phỏng mưa rơi, bầy đàn, hạt bụi). |
| **Path Modifiers**        | **Zig Zag & Twist**          | ADBE Vector Filter - Zigzag / Twist     | 'zz' / 'tw'    | Zig Zag: Size, Ridges per segment, Points (Smooth/Corner). Twist: a (Angle: + CW, - CCW), c (Center \[x,y\])                  | Zig Zag biến cạnh thẳng thành sóng đều đặn hoặc răng cưa; Twist xoắn mạnh ở tâm hơn ở rìa.                                                     |

## Phần 2: Giải Phẫu Cấu Trúc Biểu Đồ Chuyển Động & Điều Chỉnh Graph (Motion Graph, Velocity & Physics Architecture)

Nếu Cấu trúc Shape quyết định *hình thái không gian* của vật thể, thì
**Graph Editor (Biểu đồ chuyển động)** quyết định *trọng lượng, năng
lượng và nhịp điệu* của chuyển động đó theo thời gian. Nguyên nhân khiến
các chuyển động do AI tạo ra trông giả tạo là vì AI thường gán các giá
trị thời gian và đường cong một cách tùy tiện mà không nắm được mối liên
hệ toán học giữa **Đồ thị Vận tốc (Speed Graph)**, **Đồ thị Giá trị
(Value Graph)**, **Hàm Bézier bậc ba (cubic-bezier)** và **Cơ học Lò xo
(Spring Physics)**.

### 2.1. Phân định ranh giới giữa Speed Graph và Value Graph

Trong After Effects cũng như các trình biên tập chuyển động chuyên
nghiệp, Graph Editor cung cấp hai góc nhìn toán học bổ trợ nhau của cùng
một quá trình nội suy thời gian (Temporal Interpolation), trong đó độ
dốc (đạo hàm bậc nhất) của Value Graph theo thời gian biểu thị vận tốc
trên Speed Graph:

| Tiêu Chí Kỹ Thuật                         | Speed Graph (Đồ Thị Vận Tốc)                                                                                                                                                                      | Value Graph (Đồ Thị Giá Trị)                                                                                                                                           |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Đại lượng trên trục tung (Y-Axis)**     | Tốc độ thay đổi giá trị trên mỗi giây (units/sec: px/sec, %/sec, deg/sec). Đường nằm ngang ở mức 0 đồng nghĩa với vật thể đứng yên.                                                               | Giá trị thực tế của thuộc tính tại từng khung hình (tọa độ pixel X/Y, phần trăm Scale/Opacity, góc Rotation).                                                          |
| **Hình dáng đường cong đặc trưng**        | Hình quả núi/chuông (Mountain/Rollercoaster peak) cho chuyển động Ease In-Out; dốc đứng từ đỉnh cao xuống 0 cho Ease Out; dốc từ 0 vọt lên đỉnh cao cho Ease In.                                  | Đường chữ **S (S-Curve)** cho Ease In-Out; đường cong dốc đứng lúc đầu rồi thoải ngang ở cuối cho Ease Out; đường thoải ngang lúc đầu rồi dốc đứng ở cuối cho Ease In. |
| **Thuộc tính tối ưu nhất**                | **Thuộc tính đa chiều có liên kết không gian** (Position \[X, Y, Z\] khi chưa tách trục), Time Remapping (Speed Ramps), và chuyển động dọc theo đường dẫn cong (Motion Path bằng Spatial Bezier). | **Thuộc tính đơn chiều (1D)** (Scale, Rotation, Opacity) hoặc **Position đã tách trục (Separate Dimensions thành X Position và Y Position độc lập)**.                  |
| **Khả năng tạo Overshoot & Anticipation** | Không hỗ trợ kéo tay nắm vượt đích trực tiếp giữa 2 keyframe đối với thuộc tính không gian đang liên kết (linked spatial property).                                                               | **Hỗ trợ trực tiếp giữa 2 keyframe:** Kéo tay nắm (handle) vượt lên trên mức đích (Overshoot / vọt lố) hoặc kéo xuống dưới mức xuất phát (Anticipation / lấy đà lùi).  |
| **Chiến lược kết hợp chuẩn công nghiệp**  | Dùng để kiểm soát **Timing & Pacing** tổng thể, tạo độ bốc (punchiness) bằng cách dồn đỉnh vận tốc lệch hẳn về phía đầu hoặc phía cuối.                                                           | Dùng để kiểm soát **Quỹ đạo Cung tròn (Arcs)** thông qua việc lệch pha đường cong X và Y, tinh chỉnh độ nảy lò xo và khớp chính xác tọa độ điểm rơi.                   |

### 2.2. Công thức Toán học Chuyển đổi giữa AE Speed Graph (Speed & Influence %) và cubic-bezier(x1, y1, x2, y2)

Trên các diễn đàn chuyên ngành như Reddit r/AfterEffects hay trong các
khóa học của School of Motion và Ben Marriott, các Motion Designer
thường quy ước đường cong bằng cặp thông số **Tỷ lệ Ảnh hưởng (Influence
%: Out Influence / In Influence)** trong hộp thoại Keyframe Velocity (ví
dụ: tỷ lệ 80/80 cho chuyển động đối xứng mượt, 20/90 cho khởi đầu bốc và
kết thúc êm, trong khi mức F9 Easy Ease mặc định chỉ là 33% / 33%).
Ngược lại, các công cụ lập trình video và giao diện web (Remotion, CSS,
Lottie JSON, GSAP, Rive, và plugin Flow của After Effects) lại định
nghĩa đường cong chuyển động qua 4 tọa độ chuẩn hóa trong hộp đơn vị
\[0, 1\] x \[0, 1\] là **cubic-bezier(x1, y1, x2, y2)**.

Dựa trên thuật toán chuyển đổi keyframe sang Cubic Bézier trên diễn đàn
kỹ thuật của Adobe và kiến trúc của Bodymovin/Flow, với hai keyframe tại
thời điểm t_1, t_2 (\Delta t = t_2 - t_1) và giá trị V_1, V_2 (\Delta V
= \|V_2 - V_1\|), vận tốc trung bình của đoạn chuyển động là:

$v_{avg} = \frac{\Delta V}{\Delta t}$

Đối với thuộc tính đa chiều (X, Y, Z), vận tốc trung bình được tính bằng
độ lớn vector Euclid: v\_{\text{avg}} = \sqrt{v\_{x,\text{avg}}^2 +
v\_{y,\text{avg}}^2 + v\_{z,\text{avg}}^2}. Khi biết tốc độ ra/vào
(out_speed, in_speed) và phần trăm ảnh hưởng ra/vào (out_influence,
in_influence từ 0% đến 100%) trong After Effects, tọa độ
cubic-bezier(x1, y1, x2, y2) cho thuộc tính 1D tăng dần được xác định
bằng hệ phương trình:

x_1 = \frac{\text{out\\influence}}{100}, \quad y_1 = x_1 \cdot
\left(\frac{\text{out\\speed}}{v\_{\text{avg}}}\right) x_2 = 1 -
\frac{\text{in\\influence}}{100}, \quad y_2 = 1 -
\left(\frac{\text{in\\influence}}{100}\right) \cdot
\left(\frac{\text{in\\speed}}{v\_{\text{avg}}}\right)

Trong các chuyển động Motion Graphics tiêu chuẩn bắt đầu từ trạng thái
nghỉ (out_speed = 0) và kết thúc ở trạng thái nghỉ (in_speed = 0, tức
hai tay nắm trong Speed Graph nằm ngang trên đường cơ sở vận tốc bằng
0), công thức trên rút gọn thành quy luật chuyển đổi trực tiếp giữa
After Effects và Code:

\text{cubic-bezier}\left(\frac{\text{Out\\Inf}}{100},\\ 0,\\ 1 -
\frac{\text{In\\Inf}}{100},\\ 1\right)

Phương trình tham số của đường cong Bézier bậc ba theo biến u \in \[0,
1\] với P_0=(0,0), P_1=(x_1, y_1), P_2=(x_2, y_2), P_3=(1,1) cho phép
tính chính xác **Hệ số Vận tốc Đỉnh (V\_{\text{peak}} — gấp bao nhiêu
lần vận tốc trung bình)** thông qua tỷ số đạo hàm:

$\frac{dy}{dx}(u) = \frac{3(1 - u)^{2}y_{1} + 6(1 - u)u(y_{2} - y_{1}) + 3u^{2}(1 - y_{2})}{3(1 - u)^{2}x_{1} + 6(1 - u)u(x_{2} - x_{1}) + 3u^{2}(1 - x_{2})}$

Tại điểm chính giữa (u = 0.5) của một đường cong đối xứng có
\text{Out\\Inf} = \text{In\\Inf} = I \cdot 100\\ (với y_1=0, y_2=1,
x_1=I, x_2=1-I), vận tốc đỉnh đạt giá trị:

V\_{\text{peak}} = \frac{1.5}{1.5 - I}

Công thức này giải thích về mặt toán học tại sao phím F9 mặc định của
After Effects (I = 0.333) chỉ tạo ra vận tốc đỉnh 1.50x (trông thiếu
năng lượng), trong khi việc kéo thanh Influence lên 75% (I = 0.75) đẩy
vận tốc đỉnh lên gấp 4.00x, ở mức 80% (I = 0.80) đạt 5.00x, và ở mức 90%
(I = 0.90) vận tốc đỉnh tại tâm điểm vọt lên gấp **10.00x** vận tốc
trung bình, tạo ra cú "vút" (whip/snap) sắc gọn.

### 2.3. Bảng Tra Cứu Định Lượng 19 Đường Cong Chuyển Động Chuẩn Công Nghiệp (Master Easing Lookup Table)

Để AI không phải đoán mò thông số khi nhận yêu cầu từ người dùng (như
*"làm chữ lao vào thật gắt rồi phanh êm"*, *"chuyển cảnh sang trọng"*,
hay *"nút bấm nảy nhẹ"*), bảng dưới đây cung cấp thông số đối chiếu giữa
**Tỷ lệ Influence % trong After Effects**, **Chuỗi cubic-bezier(x1, y1,
x2, y2) chuẩn CSS/Lottie/Remotion**, **Hệ số Vận tốc Đỉnh (V_peak)**,
**Thời điểm đạt đỉnh (t_peak)**, và **Ngữ cảnh ứng dụng chuẩn xác**:

| Phân Nhóm Chuyển Động                             | Tên Token Chuẩn                      | Tỷ Lệ AE Speed Graph (Out% / In%, Speed)  | Giá Trị cubic-bezier(x1, y1, x2, y2)                                               | Vận Tốc Đỉnh (V_peak) & Thời Điểm (t_peak) | Biên Độ Giá Trị \[Y_min, Y_max\]                               | Đặc Tính Cơ Học & Quy Tắc Ứng Dụng Trong Video / UI                                                                                                |
|---------------------------------------------------|--------------------------------------|-------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| **0. Benchmark (Cấm dùng cho UI/Motion chính)**   | linear                               | 0% / 0% (Speed = v_avg)                   | cubic-bezier(0.00, 0.00, 1.00, 1.00)                                               | 1.00x (không đổi suốt chu kỳ)              | \[0.000, 1.000\]                                               | Vận tốc hằng số máy móc; **chỉ dùng** cho thanh tiến trình thời gian, chữ chạy marquee, vòng xoay vô tận hoặc pha bay trước khi va chạm.           |
| **0. Benchmark (Yếu)**                            | ae-default-easy-ease (Phím F9)       | 33.3% / 33.3% (Speed = 0 / 0)             | cubic-bezier(0.333, 0.00, 0.667, 1.00)                                             | 1.50x tại t = 0.50                         | \[0.000, 1.000\]                                               | Mặc định khi nhấn F9 trong AE; quá yếu và thiếu tương phản vận tốc, làm chuyển động trông lờ đờ.                                                   |
| **1. Đối xứng (On-Screen Move / Morph)**          | ease-in-out-sine                     | 44.5% / 45.0%                             | cubic-bezier(0.445, 0.05, 0.55, 0.95)                                              | 1.56x tại t = 0.50                         | \[0.000, 1.000\]                                               | Chuyển động hình sin êm dịu; dùng cho hiệu ứng thở (idle breathing), camera trôi nhẹ hoặc chuyển màu nền ambient.                                  |
| **1. Đối xứng (On-Screen Move / Morph)**          | smooth-symmetry-50                   | 50% / 50% (Speed = 0 / 0)                 | cubic-bezier(0.50, 0.00, 0.50, 1.00)                                               | 2.00x tại t = 0.50                         | \[0.000, 1.000\]                                               | Mức khởi đầu an toàn cho các phần tử di chuyển nhẹ nhàng giữa hai vị trí trên màn hình hoặc tách trục X.                                           |
| **1. Đối xứng (On-Screen Move / Morph)**          | medium-drama-66 (ease-in-out-cubic)  | 66% / 66% (Hoặc 64.5% / 64.5%)            | cubic-bezier(0.66, 0.00, 0.34, 1.00)                                               | 2.94x tại t = 0.50                         | \[0.000, 1.000\]                                               | Đường cong bậc 3 chuẩn mực khi di chuyển thẻ UI, chuyển tab, hoặc lia máy quay tiêu chuẩn.                                                         |
| **1. Đối xứng (On-Screen Move / Morph)**          | pro-standard-75 (Ease In-Out Quart)  | 75% / 75% (Speed = 0 / 0)                 | cubic-bezier(0.75, 0.00, 0.25, 1.00)                                               | 4.00x tại t = 0.50                         | \[0.000, 1.000\]                                               | **Tiêu chuẩn vàng của Motion Graphics:** Tạo gia tốc rõ rệt ở giữa và phanh mượt ở hai đầu; dùng cho biến hình shape và chuyển vị trí chính.       |
| **1. Đối xứng (On-Screen Move / Morph)**          | high-contrast-80 (Ease In-Out Quint) | 80% / 80% (Speed = 0 / 0)                 | cubic-bezier(0.80, 0.00, 0.20, 1.00)                                               | 5.00x tại t = 0.50                         | \[0.000, 1.000\]                                               | Độ tương phản vận tốc cao được cộng đồng r/AfterEffects ưa chuộng cho các cú xoay logo, lật thẻ 3D và chuyển cảnh năng động.                       |
| **1. Đối xứng (On-Screen Move / Morph)**          | extreme-snap-90 (Ease In-Out Expo)   | 90% / 90% (Speed = 0 / 0)                 | cubic-bezier(0.90, 0.00, 0.10, 1.00) | 10.00x tại t = 0.50                        | \[0.000, 1.000\]                                               | Tích tụ năng lượng lâu rồi phóng vọt qua màn hình với tốc độ gấp 10 lần trung bình; dùng cho Whip Pan transitions và Kinetic Typography kịch tính. |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | ease-out-cubic                       | 21.5% / 64.5%                             | cubic-bezier(0.215, 0.61, 0.355, 1.00)                                             | 2.84x tại t = 0.00                         | \[0.000, 1.000\]                                               | Đường cong giảm tốc nhẹ cho tooltip, dropdown nhỏ và các phản hồi micro-interaction dưới 200ms.                                                    |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | snappy-enter-20-80                   | 20% / 80% (Speed = 0 / 0)                 | cubic-bezier(0.20, 0.00, 0.20, 1.00)                                               | 2.50x tại t = 0.17                         | \[0.000, 1.000\]                                               | Khởi đầu bốc (20% Out) và hạ cánh êm (80% In); công thức phổ biến cho các phần tử lao vào khung hình.                                              |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | punchy-enter-15-85 (ease-out-expo)   | 15% / 85% (Speed = 0 / 0)                 | cubic-bezier(0.15, 0.00, 0.15, 1.00) | 2.80x tại t = 0.12                         | \[0.000, 1.000\]                                               | Tạo cảm giác phản hồi tức thì trong 3–4 frame đầu rồi trượt mượt mà vào vị trí nghỉ; lý tưởng cho Headline Reveal và Card Entrance.                |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | explosive-enter-10-90                | 10% / 90% (Speed = 0 / 0)                 | cubic-bezier(0.10, 0.00, 0.10, 1.00)                                               | 3.33x tại t = 0.07                         | \[0.000, 1.000\]                                               | Tỷ lệ "20-90 / 10-90" được nhắc tới trên Reddit r/AfterEffects cho cú xuất hiện bùng nổ (Impact Hit) và giữ đuôi trượt dài.                        |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | apple-ios-sheet                      | 32% / 100% (Out Speed = 2.25x)            | cubic-bezier(0.32, 0.72, 0.00, 1.00)                                               | 4.22x tại t = 0.16                         | \[0.000, 1.000\] | Đường cong đặc trưng của iOS Drawer/Sheet theo tài liệu của Emil Kowalski: vọt lên ngay lập tức và phanh dài ở cuối (x2 = 0).                      |
| **2. Bất đối xứng: Lao Vào (Enter / Decelerate)** | m3-emphasized-decelerate             | 5% / 90% (Out Speed = 14.0x)              | cubic-bezier(0.05, 0.70, 0.10, 1.00)                                               | 14.00x tại t = 0.00                        | \[0.000, 1.000\]                                               | Token md.sys.motion.easing.emphasized.decelerate của Google Material 3: phóng ở vận tốc cực đại ngay frame 0 rồi hạ cánh mềm qua 400ms.            |
| **3. Bất đối xứng: Thoát Ra (Exit / Accelerate)** | fast-exit-80-20                      | 80% / 20% (Speed = 0 / 0)                 | cubic-bezier(0.80, 0.00, 0.80, 1.00)                                               | 2.50x tại t = 0.83                         | \[0.000, 1.000\]                                               | Lấy đà mượt rồi vút biến mất khỏi màn hình; luôn dùng thời lượng ngắn hơn chiều vào khoảng 30–50%.                                                 |
| **3. Bất đối xứng: Thoát Ra (Exit / Accelerate)** | m3-emphasized-accelerate             | 30% / 20% (In Speed = 4.25x)              | cubic-bezier(0.30, 0.00, 0.80, 0.15)                                               | 4.25x tại t = 1.00                         | \[0.000, 1.000\]                                               | Token md.sys.motion.easing.emphasized.accelerate của Material 3: kết thúc ở vận tốc đỉnh tại frame cuối (200ms), tạo cảm giác đóng vĩnh viễn.      |
| **4. Vọt Lố & Lấy Đà (Overshoot & Anticipation)** | ease-out-back (Spring Overshoot)     | 34% / 36% (Value Graph Handle y1 = 1.56)  | cubic-bezier(0.34, 1.56, 0.64, 1.00)                                               | 4.59x tại t = 0.00                         | \[0.000, 1.098\]                                               | Vọt lố qua đích **+9.8%** (Y_max = 1.098) rồi thu về 1.0; dùng để giả lập lò xo bằng CSS/Bezier thuần khiết cho phần tử xuất hiện.                 |
| **4. Vọt Lố & Lấy Đà (Overshoot & Anticipation)** | ease-in-back (Anticipation)          | 36% / 34% (Value Graph Handle y2 = -0.56) | cubic-bezier(0.36, 0.00, 0.66, -0.56)                                              | 4.59x tại t = 1.00                         | \[-0.098, 1.000\]                                              | Lùi ngược lại **-9.8%** (Y_min = -0.098) để lấy đà trước khi phóng đi; dùng cho nguyên lý Anticipation khi xóa thẻ hoặc phóng biểu tượng.          |
| **4. Vọt Lố & Lấy Đà (Overshoot & Anticipation)** | ease-in-out-back (Antic + Overshoot) | 68% / 68% (y1 = -0.60, y2 = 1.60)         | cubic-bezier(0.68, -0.60, 0.32, 1.60)                                              | 5.00x tại t = 0.50                         | \[-0.105, 1.105\]                                              | Kết hợp cả lấy đà lùi **-10.5%** lúc đầu và vọt lố **+10.5%** ở đích; dùng cho chuyển động hoạt hình 2D vui nhộn và biểu tượng 3D xoay.            |

### 2.4. Kỹ thuật Tách Trục (Separate Dimensions) và Toán học Kiến tạo Quỹ đạo Cung tròn (Spatial Arcs)

Một trong 12 nguyên lý chuyển động kinh điển của Disney (được Frank
Thomas và Ollie Johnston hệ thống hóa trong *The Illusion of Life* năm
1981) là **Arcs (Chuyển động theo cung tròn)**: trong tự nhiên, hầu như
không có vật thể nào di chuyển từ điểm A đến điểm B theo một đường chéo
thẳng tắp. Tuy nhiên, nếu giữ thuộc tính Position ở trạng thái gộp
(Linked X/Y) hoặc tách trục nhưng áp dụng cùng một hàm Easing cho cả hai
trục X và Y, tại mọi thời điểm trong chu kỳ ta luôn có tỷ lệ dịch chuyển
trục X và trục Y bằng nhau, khiến vật thể trượt cứng nhắc trên một đường
chéo thẳng với độ cong bằng **0.0%**.

Để tạo quỹ đạo cong tự nhiên mà không gặp lỗi rối tiếp tuyến không gian
(Spatial Bezier), phương pháp chuẩn trong After Effects và lập trình
chuyển động là kích hoạt **Separate Dimensions** (Tách rời X Position và
Y Position thành hai thuộc tính 1D độc lập trên Value Graph) và **áp
dụng hai đường cong Easing lệch pha nhau**. Khi một trục tăng tốc nhanh
lúc đầu (Ease Out) còn trục kia tăng tốc chậm lúc đầu (Ease In), hợp lực
vector của chúng tự động tạo thành một cung parabol hoặc elip mượt mà:

| Kiểu Quỹ Đạo Không Gian (Spatial Trajectory)            | Đường Cong Trục X (X Position Easing)  | Đường Cong Trục Y (Y Position Easing)  | Vị Trí Tại Chính Giữa Thời Gian (t = 0.50) | Độ Uốn Cung Cực Đại (Max Arc Bow %) | Ứng Dụng Thực Tế Trong Motion Graphics & UI                                                                                   |
|---------------------------------------------------------|----------------------------------------|----------------------------------------|--------------------------------------------|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Đường chéo thẳng (Straight Diagonal)**                | pro-standard-75 (0.75, 0, 0.25, 1)     | pro-standard-75 (0.75, 0, 0.25, 1)     | X = 50.0%, Y = 50.0%                       | **0.0%** (Không cong)               | Chỉ dùng cho chuyển động cơ khí, tia laser, hoặc trượt chéo Isometric.                                                        |
| **Cung tròn tự nhiên 1/4 (Natural Quarter-Circle Arc)** | ease-in-sine (0.47, 0, 0.745, 0.715)   | ease-out-sine (0.39, 0.575, 0.565, 1)  | X = 29.1%, Y = 73.6%                       | **31.4%**                           | Quỹ đạo ném vật thể tự nhiên hoặc mở rộng nút FAB ở góc dưới phải thành hộp thoại ở giữa màn hình.                            |
| **Cung vòm nổi nhẹ UI (Soft Floating UI Arc)**          | smooth-50 (0.50, 0, 0.50, 1)           | punchy-enter-15-85 (0.15, 0, 0.15, 1)  | X = 50.0%, Y = 83.9%                       | **32.4%**                           | Thẻ thông báo hoặc ảnh thu nhỏ bay lên vị trí mới trước khi trượt ngang vào khung lưới.                                       |
| **Cung parabol cao (Pronounced Upper Arc)**             | ease-in-quad (0.55, 0.085, 0.68, 0.53) | ease-out-quad (0.25, 0.46, 0.45, 0.94) | X = 25.6%, Y = 77.1%                       | **36.5%**                           | Chuyển động nhảy của nhân vật, quả bóng nảy lên đỉnh parabol rồi rơi xuống.                                                   |
| **Cung võng con lắc (Deep Swoop / Pendulum Arc)**       | snappy-enter-20-80 (0.20, 0, 0.20, 1)  | fast-exit-80-20 (0.80, 0, 0.80, 1)     | X = 81.4%, Y = 18.6%                       | **44.4%**                           | Vật thể lao ngang cực nhanh trước rồi mới vút lên cao ở nửa sau chu kỳ (hiệu ứng máy bay cất cánh / swoop transition).        |
| **Quỹ đạo móc câu chữ J (Hook / J-Curve Trajectory)**   | whip-85-15 (0.85, 0, 0.85, 1)          | ease-out-back (0.34, 1.56, 0.64, 1)    | X = 16.1%, Y = 108.7%                      | **66.6%**                           | Phóng vọt lố theo trục dọc lên 108.7% rồi vòng móc ngang vào vị trí đích; thu hút thị giác mạnh cho các biểu tượng quảng cáo. |

Đối với chuyển động xoay 3D (như hiệu ứng lật thẻ card-flip), nguyên lý
tách trục cũng được áp dụng tương tự: cho trục xoay chính (Y Rotation)
dẫn đầu bằng một đường cong dốc đứng lúc đầu (fast start), trong khi
trục xoay phụ (X Rotation) đi theo sau bằng một đường cong thoải hơn để
tạo cảm giác vật thể có trọng lượng tự nhiên thay vì xoay cơ học phẳng
lì.

### 2.5. Hệ thống Vật lý Lò xo (Spring Physics) vs. Biểu thức Quán tính (Inertial Bounce & Parabolic Bounce)

Trong thiết kế chuyển động hiện đại (Remotion, Framer Motion, React
Native Reanimated, Apple SwiftUI, và Google Material Design 3 Expressive
ra mắt tháng 5/2025), **Vật lý Lò xo (Spring Physics)** đã thay thế các
đường cong thời gian cố định (fixed-duration cubic-bezier) để trở thành
tiêu chuẩn mặc định cho các thành phần giao diện và chuyển động xuất
hiện. Lò xo vượt trội vì nó không bị bó buộc vào một thời lượng cứng
nhắc, bảo toàn được vận tốc khi bị ngắt quãng giữa chừng (interruptible
gestures), và tạo cảm giác đồng nhất về mặt vật lý trên mọi kích thước
màn hình.

#### A. Phương trình Chuyển đổi và Bảng Định lượng 8 Cấu hình Lò xo Chuẩn (Spring Physics Presets)

Một lò xo vật lý cổ điển được định nghĩa bởi 3 tham số: **Khối lượng
(mass m)**, **Độ cứng (stiffness / tension k)**, và **Hệ số cản (damping
/ friction c)**. Để giúp nhà thiết kế không phải mò mẫm các con số vật
lý trừu tượng, Apple SwiftUI và Emil Kowalski khuyến nghị mô hình 2 tham
số trực quan là **Thời lượng cảm nhận (duration T_p) và Độ nảy (bounce b
\in \[-1, 1\])**, trong khi Google Material 3 và Android Jetpack Compose
sử dụng **Tỷ số tắt dần (dampingRatio \zeta) và Độ cứng (stiffness k)**.
Các hệ thống này chuyển đổi qua lại chính xác bằng các công thức vật lý
dao động điều hòa tắt dần:

\omega_n = \sqrt{\frac{k}{m}} = \frac{2\pi}{T_p} \implies k = m \cdot
\left(\frac{2\pi}{\text{duration}}\right)^2 \zeta = \frac{c}{2\sqrt{k
\cdot m}}, \quad \text{bounce} = 1 - \zeta \implies c = 2 \cdot \zeta
\cdot \sqrt{k \cdot m} = 2 \cdot (1 - \text{bounce}) \cdot \sqrt{k \cdot
m}

Khi bounce = 0 (\zeta = 1.00 — **Critically Damped / Tắt dần tới hạn**),
lò xo tiến về đích nhanh nhất có thể mà hoàn toàn không vọt lố (0.0%
overshoot). Khi 0 \< bounce \< 1 (0 \< \zeta \< 1.00 — **Underdamped /
Dưới tới hạn**), lò xo vọt lố qua đích với biên độ phần trăm đỉnh đầu
tiên là \text{Overshoot \\} = \exp\left(\frac{-\pi \zeta}{\sqrt{1 -
\zeta^2}}\right) \times 100\\ rồi dao động tắt dần về đích. Khi bounce
\< 0 (\zeta \> 1.00 — **Overdamped / Quá tới hạn**), lò xo bị ghì mạnh
bởi lực cản ma sát, tạo đường cong phẳng hơn cả mức tới hạn.

Một sai lầm phổ biến khi lập trình video bằng Remotion là gọi hàm
spring() với thông số mặc định (mass = 1.0, stiffness = 100.0, damping =
10.0), vốn có tỷ số tắt dần \zeta = 0.50 tạo ra độ vọt lố tới **16.3%**
và mất tới **950ms (29 frames ở 30fps)** mới đứng yên—cao gấp hơn ba lần
mức vọt lố cho phép của giao diện sản phẩm chuyên nghiệp. Bảng dưới đây
cung cấp số liệu giải tích của 8 cấu hình lò xo chuẩn để AI lựa chọn
chính xác theo ngữ cảnh:

| Tên Cấu Hình Lò Xo (Spring Preset)                                | Thông Số Vật Lý (mass m, stiffness k, damping c) | Tỷ Số Tắt Dần (zeta) & Độ Nảy (bounce)                                    | Biên Độ Vọt Lố Đỉnh Đầu (Overshoot %) | Thời Gian Ổn Định 1% (Settling Time ms) | Ngân Sách Khung Hình (24fps / 30fps / 60fps) | Ngữ Cảnh Ứng Dụng Chuẩn Xác                                                  |
|-------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------|---------------------------------------|-----------------------------------------|----------------------------------------------|------------------------------------------------------------------------------|
| **Snappy UI / Micro**                                             | m = 1.0, k = 400.0, c = 28.0                     | zeta = 0.70 (bounce = 0.30)                                               | **4.6%**                              | 353 ms                                  | 9f / 11f / 22f                               | Nút bấm, công tắc, phụ đề (captions) bật nhanh trên TikTok/Reels.            |
| **iOS Sheet / Drawer**                                            | m = 1.0, k = 280.0, c = 27.4                     | zeta = 0.82 (bounce = 0.18)                                               | **1.1%**                              | 377 ms                                  | 10f / 12f / 23f                              | Trượt bảng chọn iOS Sheet, bàn phím ảo, ngăn kéo điều hướng (Drawer).        |
| **Crisp SaaS Card** | m = 1.0, k = 300.0, c = 24.0                     | zeta = 0.69 (bounce = 0.31)                                               | **4.9%**                              | 411 ms                                  | 10f / 13f / 25f                              | Thẻ giao diện SaaS, hộp thoại Modal xuất hiện với đúng 1 nhịp nảy tinh tế.   |
| **Critically Damped Smooth**                                      | m = 1.0, k = 200.0, c = 28.3                     | zeta = 1.00 (bounce = 0.00)                                               | **0.0%** (Không vọt lố)               | 612 ms                                  | 15f / 19f / 37f                              | **Bắt buộc cho Biểu đồ dữ liệu (Data Viz)**, bộ đếm số, opacity và color.    |
| **Playful Pop / Explainer**                                       | m = 1.0, k = 250.0, c = 14.0                     | zeta = 0.44 (bounce = 0.56)                                               | **21.2%**                             | 673 ms                                  | 17f / 21f / 41f                              | Nhãn dán (Stickers), huy hiệu thông báo, điểm nhấn video quảng cáo sôi động. |
| **Heavy Cinematic / Luxury**                                      | m = 2.0, k = 90.0, c = 24.0                      | zeta = 0.89 (bounce = 0.11)                                               | **0.2%**                              | 902 ms                                  | 22f / 28f / 55f                              | Chuyển động có khối lượng nặng, tiêu đề phim điện ảnh, thương hiệu cao cấp.  |
| **Remotion Default** *(Hạn chế dùng)*                             | m = 1.0, k = 100.0, c = 10.0                     | zeta = 0.50 (bounce = 0.50) | **16.3%**                             | 950 ms                                  | 23f / 29f / 57f                              | Mặc định của Remotion/Framer; quá rung và kéo dài cho UI tiêu chuẩn.         |
| **Elastic Boing / Cartoon**                                       | m = 1.0, k = 180.0, c = 8.0                      | zeta = 0.30 (bounce = 0.70)                                               | **37.5%**                             | 1163 ms                                 | 28f / 35f / 70f                              | Hoạt hình 2D phóng đại, ứng dụng thiếu nhi hoặc hiệu ứng dây thun cao su.    |

#### B. Hệ thống Token Lò xo của Material Design 3 Expressive (Spatial vs. Effects)

Hệ thống vật lý chuyển động của Google Material 3 chia mọi lò xo thành 2
chủng loại hành vi kết hợp với 3 cấp tốc độ (fast, default, slow) và 2
phong cách (Expressive và Standard). **Spatial Springs (Lò xo Không
gian)** được dùng cho các thuộc tính di chuyển hoặc biến đổi hình thái
trên màn hình (Position X/Y, Rotation, Scale, Size, Rounded Corners) và
được phép vọt lố nhẹ (Overshoot) trước khi ổn định. Trên môi trường
Web/CSS, Material 3 cung cấp các thông số xấp xỉ đường cong và thời
lượng tương ứng gồm: Expressive Fast Spatial (0.42, 1.67, 0.21, 0.90,
350ms, tương ứng dampingRatio 0.6 trong Compose), Expressive Default
Spatial (0.38, 1.21, 0.22, 1.00, 500ms), Expressive Slow Spatial (0.39,
1.29, 0.35, 0.98, 650ms), và bộ Standard Fast / Default / Slow Spatial
(0.27, 1.06, 0.18, 1.00 với thời lượng 350ms / 500ms / 750ms). Ngược
lại, **Effects Springs (Lò xo Hiệu ứng)** được dùng để diễn hoạt các
thuộc tính như màu sắc và độ trong suốt (Opacity, Color), nơi **tuyệt
đối không được phép có bất kỳ độ vọt lố nào (zeta = 1.00)** gồm: Fast
Effects (0.31, 0.94, 0.34, 1.00, 150ms), Default Effects (0.34, 0.80,
0.34, 1.00, 200ms) và Slow Effects (0.34, 0.88, 0.34, 1.00, 300ms).

#### C. Phân biệt Toán học giữa Overshoot (Inertial Bounce) và Bounce (Va chạm nảy lùi) trong After Effects

Trong cộng đồng After Effects, hai khái niệm này thường bị gọi chung là
"Inertial Bounce", nhưng như Dan Ebberts (motionscript.com) và tài liệu
của Flexile đã phân tích, chúng tuân theo hai mô hình toán học hoàn toàn
khác nhau:

1.  **Overshoot / Inertial Bounce (Dao động điều hòa tắt dần quanh vị
    trí đích):** Hoạt động giống như một thanh lò xo hoặc con lắc, giá
    trị **đi vượt qua keyframe đích**, lắc qua lắc lại với **tần số
    không đổi (freq hoặc wobbles)** trong khi biên độ giảm dần theo
    hàm mũ \exp(-\text{decay} \cdot t). Để chuyển động không bị gãy
    khúc tại keyframe, vận tốc đi vào ngay trước keyframe
    (v\_{\text{in}}) được chia cho tần số góc \omega = 2\pi \cdot
    \text{freq}: \text{Value}(t) = V\_{\text{key}} + v\_{\text{in}}
    \cdot \text{springiness} \cdot \frac{\sin(\omega \cdot \Delta
    t)}{\omega \cdot \exp(\text{settle} \cdot \Delta t)} Thông số mặc
    định chuẩn của công cụ Flexile và Dan Ebberts là springiness = 1
    (hoặc hệ số nhân amp = 0.05–0.1 trong bản rút gọn), wobbles / freq
    = 2.5–3.0 (số chu kỳ lắc mỗi giây), và settle / decay = 5.0–8.0
    (tốc độ tắt dần).

2.  **Parabolic Bounce (Nảy bật ngược lại như quả bóng chạm sàn):** Khi
    vật thể chạm mặt sàn cứng tại keyframe đích, nó **dừng lại ngay
    tại giá trị đích và không bao giờ đi xuyên qua đích**, mà bật
    ngược trở lại hướng vừa lao tới theo một chuỗi các đường parabol
    liên tiếp. Khác với Overshoot có tần số cố định, mỗi lần quả bóng
    nảy lên nó mất năng lượng theo hệ số đàn hồi e \in (0, 1), khiến
    **cả biên độ lẫn thời lượng của từng nhịp nảy đều giảm dần**
    (\text{segDur}\_n = \text{segDur}\_0 \cdot e^n, tức càng về cuối
    bóng nảy càng nhanh và thấp). Với vận tốc bật lên đầu tiên s_0 =
    \|v\_{\text{in}}\|
    \cdot e và thời lượng nhịp đầu d_0 = \frac{2 s_0}{g}, độ cao bật
    lùi tại nhịp thứ n (sau thời gian \delta t tính từ đầu nhịp n, với
    s_n = s_0 \cdot e^n) là: \text{lift}(\delta t) = s_n \cdot \delta
    t - \frac{1}{2} g \cdot (\delta t)^2 Thông số mặc định chuẩn gồm
    elasticity (e) = 0.6–0.7 (0.3 cho vật nặng rơi bịch xuống sàn, 0.8
    cho bóng cao su nảy mạnh), gravity (g) = 3000–5000 (tính theo đơn
    vị của thuộc tính trên mỗi giây bình phương, phù hợp với pixel của
    Position; cần giảm nhỏ tương ứng nếu áp dụng cho Scale hoặc
    Rotation), và maxBounces = 4.

3.  **Quy tắc Bắt buộc khi kết hợp Expression với Graph Editor:** Cả hai
    biểu thức trên đều đọc velocityAtTime() ngay trước keyframe đích
    để tính biên độ nảy. Nếu người dùng hoặc AI nhấn F9 (Easy Ease) ở
    phía đi vào của keyframe đích và để vận tốc bằng 0 trên Speed
    Graph, biểu thức sẽ mất hoàn toàn tác dụng (không có chuyển động
    nảy xảy ra). Do đó, **phía đi vào (Incoming side) của keyframe áp
    dụng biểu thức Bounce/Overshoot bắt buộc phải giữ ở trạng thái
    Linear hoặc điều chỉnh Incoming Speed \> 0** trên Speed Graph. Nếu
    muốn tạo hiệu ứng này thủ công bằng keyframe mà không dùng
    expression, các tài liệu đào tạo khuyến nghị thêm 2–3 frames lấy
    đà (anticipation), 1 frame ở đỉnh vọt lố (overshoot) và 4–6 frames
    thu hồi về trạng thái nghỉ (settle) rồi áp dụng Easy Ease cho các
    điểm đổi chiều.

### 2.6. Bảo toàn Thể tích trong Squash & Stretch và Toán học Dàn dựng Nhịp điệu (Choreography & Pacing)

Để hoàn thiện cấu trúc chuyển động, AI cần tuân thủ các công thức toán
học chi phối biến dạng cơ học và phân bổ thời gian giữa các phần tử:

- **Định luật Bảo toàn Diện tích / Thể tích trong Squash & Stretch (x \*
  > y = 10000):** Khi một vật thể bị nén lại (Squash) lúc chạm đất hoặc
  > kéo giãn ra (Stretch) khi tăng tốc, tổng diện tích/thể tích của nó
  > phải được giữ xấp xỉ không đổi. Trong hoạt hình quả bóng nảy, mức
  > biến dạng chuẩn khi tiếp đất là nén khoảng **20% giữ trong đúng 1
  > frame**; trong khi ở giao diện UI, mức biến dạng tinh tế là
  > **2%–5%** (như Modal đạt scale 102% rồi về 100%, hoặc nút bấm nhấn
  > xuống scale 0.97 hoặc 0.95). Thay vì keyframe cả hai trục Scale rời
  > rạc, biểu thức chuẩn của Dan Ebberts chỉ biến thiên trục x và tự
  > động tính trục y để bảo toàn diện tích lớp: y =
  > \frac{\text{scale}\[0\] \times \text{scale}\[1\]}{x} Nếu vật thể di
  > chuyển theo đường chéo trong After Effects, kỹ thuật của Joey
  > Korenman (School of Motion) sử dụng chuỗi 3 hiệu ứng Transform nối
  > tiếp nhau: Transform 1 xoay vật thể theo góc bay, Transform 2 thực
  > hiện kéo giãn Squash & Stretch, và Transform 3 xoay ngược lại để
  > hình khối biến dạng chính xác dọc theo hướng bay.

- **Quy tắc Bất đối xứng Vào/Ra (Enter/Exit Asymmetry Rule):** Thời
  > lượng phần tử xuất hiện (Enter) luôn phải dài hơn thời lượng biến
  > mất (Exit) theo tỷ lệ khoảng **1.5:1 đến 2:1** (tức Exit chỉ chiếm
  > khoảng 50%–60% thời lượng Enter; ví dụ: Enter 300ms hoặc ~20 frames
  > ở 30fps thì Exit 200ms hoặc ~10 frames ở 30fps; ở Material 3, Enter
  > dài 500ms thì Exit ngắn 200ms). Trong các hệ thống dùng Spring hoặc
  > các thành phần xuất hiện tại chỗ, chiều Exit cần được làm đơn giản
  > hơn bằng cách **giảm số lượng thuộc tính diễn hoạt** (Enter kết hợp
  > Spatial + Effects như opacity + translateY + scale + blur, còn Exit
  > chỉ dùng Effects hoặc biên độ translateY nhỏ hơn, tuyệt đối **không
  > dùng Spring Overshoot hay Stagger khi Exit**—mọi phần tử biến mất
  > đồng thời).

- **Công thức Tính Thời lượng Động theo Khoảng cách và Kích thước
  > (Dynamic Duration Scaling):** Thời lượng chuyển động không nên gán
  > cố định một con số cho mọi vật thể mà phải tỷ lệ thuận với quãng
  > đường di chuyển (d\_{\text{px}}) và diện tích phần tử theo công
  > thức: \text{duration}\_{\text{ms}} =
  > \text{clamp}\left(100\text{ms},\\ \text{base\\duration} + 0.8 \times
  > d\_{\text{px}},\\ 500\text{ms}\right) Trong đó, phần tử nhỏ /
  > Micro-interactions (công tắc, checkbox, icon) dùng **100–150ms**;
  > phần tử trung bình / Standard UI (tooltip, dropdown, card) dùng
  > **150–300ms** (Emil Kowalski khuyến nghị mức dưới 300ms với
  > **180ms** là điểm ngọt lý tưởng cho các công cụ năng suất, trong khi
  > Jakub Krehel dùng **200–500ms** cho độ mượt sản phẩm tiêu dùng);
  > phần tử lớn (modal, drawer, sheet) dùng **300–500ms**; và chuyển
  > cảnh toàn màn hình dùng **400–700ms** (không vượt quá 1000ms cho
  > chuyển động tương tác). Ngoài ra, cần áp dụng **Cổng Tần suất
  > (Frequency Gate)**: các thao tác lặp lại trên 100 lần/ngày hoặc kích
  > hoạt bằng phím tắt bàn phím (như mở thanh lệnh Raycast) tuyệt đối
  > không được gắn animation làm chậm thao tác người dùng.

- **Toán học Dàn dựng Lệch pha (Stagger Choreography Mathematics):**
  > Không cho phép các phần tử trong một danh sách, cụm từ, tia sáng hay
  > lưới thẻ xuất hiện cùng một lúc. Tuy nhiên, tổng thời gian trễ của
  > cả chuỗi Stagger phải được giới hạn ở mức tối đa **300ms–400ms** và
  > chỉ áp dụng cho **6–8 phần tử đầu tiên** (các phần tử từ vị trí thứ
  > 8 trở đi xuất hiện cùng lúc ở mức trễ trần) để tránh cảm giác chờ
  > đợi như xem trình chiếu slide. Hai công thức Stagger chuẩn gồm:
  > \text{Linear Capped Delay}(i) = \min\left(i \times \Delta
  > t\_{\text{step}},\\ \text{maxStaggerDelay}\right) \quad (\Delta
  > t\_{\text{step}} \in \[30\text{ms}, 60\text{ms}\] \text{ hoặc }
  > 3\text{–}6\text{ frames}) \text{Decelerating Stagger Delay}(i) =
  > \min\left(i^{1.5} \times 15\text{ms},\\ 350\text{ms}\right)

- **Nhịp điệu Cấu trúc Cảnh (Scene Pacing & Screen Motion Budget):**
  > Trong các dự án video Motion Graphics (như Remotion), mỗi cảnh tuân
  > theo nhịp **HIT → Hold (15–20 frames tĩnh) → Build → HIT**. Bắt buộc
  > phải có chuyển động ngay trong **15 frames đầu tiên**, không bao giờ
  > để quá **90 frames** mà không có phần tử thị giác mới xuất hiện, và
  > mọi phần tử đứng trên màn hình quá **2 giây** phải được gắn chuyển
  > động thở vi mô theo hàm sin (sin-wave micro-motion). Đồng thời, cần
  > tuân thủ **Ngân sách Chuyển động Màn hình (Screen Motion Budget)**:
  > giới hạn tối đa **3 chuyển động độc lập hiển thị cùng lúc** trên một
  > màn hình để tránh gây quá tải nhận thức.

## Phần 3: Ma Trận Ứng Dụng Liên Lĩnh Vực (Cross-Domain Video & Motion Graphics Blueprints)

Khi người dùng yêu cầu AI tạo video thuộc các lĩnh vực khác nhau (từ
TikTok/Reels ngắn, Video ra mắt sản phẩm SaaS, Đồ họa dữ liệu tài chính,
Kinetic Typography cho đến Logo Intro), AI cần tra cứu và áp dụng cấu
trúc **Shape + Graph** tương ứng với đặc thù của từng lĩnh vực:

| Lĩnh Vực Video / Ứng Dụng                                                              | Cấu Trúc Tạo Shape Chủ Đạo (Shape Architecture)                                                                                                                                                                                                                                                                                                                                                                                           | Cấu Trúc Đồ Thị & Vật Lý (Graph & Spring Specs)                                                                                                                                                                                                                                                                                                                                      | Ngân Sách Thời Gian & Nhịp Điệu (Frame & Pacing Rules)                                                                                                                                                                                                                                                                                                                                               | Quy Tắc Cấm & Kiểm Duyệt Đặc Thù (Domain Guardrails)                                                                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1. Short-Form Social Video (TikTok, Reels, YouTube Shorts 9:16)**                    | \- Hộp phụ đề động dùng Rectangle ('rc') bo góc gắn sourceRectAtTime() tự co giãn theo từng cụm từ. - Các tia nhấn mạnh (Accent Bursts) dùng Basic Line + Trim Paths ('tm') + Repeater ('rp') tỏa tròn từ \[0,0\]. - Khung nền 5 lớp: BgMesh -\> OffthreadVideo / KenBurns Still -\> Vector/Type -\> Color Grade -\> Grain + Vignette.                                                                                                    | \- Phụ đề và Sticker xuất hiện bằng Spring nảy nhanh: Snappy UI (m=1, k=400, c=28, zeta=0.70) hoặc Playful Pop (m=1, k=250, c=14, zeta=0.44). - Chuyển cảnh cắt cúp (Zoom/Pan) dùng explosive-enter-10-90 cubic-bezier(0.10, 0, 0.10, 1) (V_peak = 3.33x). - Ảnh tĩnh bắt buộc gắn Ken Burns (Scale 1.00 -\> 1.08 + Pan nhẹ).          | \- **Swipe Zone (0–3s đầu):** Theo các phân tích tối ưu hóa video ngắn, khoảng 65% người xem rời đi trong 3s đầu nếu không có điểm thu hút; cần tạo chuyển động ngay trong **15 frames đầu tiên**. - **Pattern Interrupt:** Thay đổi góc máy hoặc chèn B-roll/Motion Graphic mỗi **1–2 giây đến 3–5 giây** (các bài viết chuyên ngành ghi nhận mức tăng khoảng 32% tỷ lệ giữ chân so với cảnh tĩnh). | \- Tránh mở đầu chậm kiểu *"Xin chào mình là..."*; đặt bối cảnh sau khi đã tung Hook. - Giữ toàn bộ chữ và đồ họa quan trọng trong **75% diện tích giữa theo chiều dọc** (tránh bị giao diện TikTok/Reels che khuất ở đỉnh và đáy). - Tránh dùng Emoji hệ thống làm icon vì lệch bảng màu.                                                                                                                         |
| **2. UI/UX & SaaS Product Launch / Explainer (Góc nhìn Emil Kowalski & Jakub Krehel)** | \- Giao diện giả lập dùng Rectangle ('rc') bo góc chuẩn, đổ bóng mềm (thay vì viền cứng trên nền biến thiên) và căn chỉnh quang học (Optical Alignment) cho nút Play/Icon. - Hiệu ứng mở rộng thẻ thành màn hình chi tiết dùng **Container Transform** (bo góc giảm từ 12px -\> 0px đồng bộ với kích thước). - Dùng clip-path hoặc Merge Paths (Intersect) cho các hiệu ứng lật trạng thái. | \- **Vào màn hình (Enter):** Kết hợp 3–4 thuộc tính đồng thời: opacity (0 -\> 1) + translateY + scale (0.95 -\> 1.00) + blur. - Dùng apple-ios-sheet cubic-bezier(0.32, 0.72, 0, 1) hoặc Spring Crisp SaaS Card (m=1, k=300, c=24, zeta=0.69, vọt lố 4.9%). - Di chuyển trên màn hình dùng pro-standard-75 (0.75, 0, 0.25, 1).                                                       | \- Micro-interactions: **100–150ms**; UI tiêu chuẩn: **150–250ms** (180ms lý tưởng); Polish cho sản phẩm/video (Jakub lens): **200–500ms**. - Stagger danh sách (như danh sách issue của Linear): trễ **30–40ms** giữa các dòng, chồng lấp (overlap) 35–50ms giữa cảnh ra và cảnh vào.                                                                                                               | \- **Cấm scale(0):** Không bao giờ phóng to phần tử UI từ 0; luôn bắt đầu từ **scale(0.90) đến scale(0.95)**. - **Paired Elements Rule:** Modal và lớp nền mờ (Backdrop/Scrim) hoặc Tooltip và mũi tên phải đồng bộ đường cong (hoặc Scrim fade độc lập ở 300ms). - Chỉ diễn hoạt transform, opacity, filter (blur \< 20px); cấm diễn hoạt width, height, top, left, margin và luôn hỗ trợ prefers-reduced-motion. |
| **3. Data Visualization & FinTech Motion Graphics (Biểu đồ, Số liệu)**                 | \- **Biểu đồ đường (Line Chart) & Biểu đồ tròn (Donut Chart):** Dùng Path ('sh') hoặc Ellipse ('el') với Stroke, điều khiển Trim Paths ('tm') chạy End: 0% -\> Value%. - **Biểu đồ cột (Bar Chart):** Dùng Rectangle với tâm neo đặt ở cạnh đáy hoặc dùng Repeater ('rp') nhân bản trục lưới.                                                                                                                                             | \- **Quy tắc T-007 (Cấm vọt lố dữ liệu):** Tuyệt đối **KHÔNG dùng lò xo nảy (Underdamped Spring / EaseOutBack)** cho các phần tử mà vị trí hoặc kích thước biểu thị số liệu dữ liệu. - Bắt buộc dùng **Critically Damped Smooth** (m=1, k=200, c=28.3, zeta=1.00, Overshoot = 0.0%) hoặc punchy-enter-15-85 cubic-bezier(0.15, 0, 0.15, 1) cho thanh biểu đồ và bộ đếm số (Counter). | \- Thời lượng vẽ đường/cột chính: **450–650ms (14–20 frames @ 30fps)** để mắt người kịp theo dõi độ dốc tăng trưởng. - Các cột trong biểu đồ dùng **Decelerating Stagger** (delay(i) = i^1.5 \* 15ms, tổng trễ \<= 350ms). - Giữ tĩnh (Hold) **15–20 frames** sau khi số liệu dừng hẳn.                                                                                                              | \- Bắt buộc bật extrapolateLeft/Right: "clamp" để giá trị không vượt ngoài biên \[0, Max\]. - Chỉ sử dụng **1 màu nhấn chủ đạo (Hero Color)** cho tối đa 1 phần tử tiêu điểm trên mỗi khung hình; các chuỗi đối chiếu dùng tông xám phân cấp (#AAAAAA, \#CCCCCC).                                                                                                                                                  |
| **4. Kinetic Typography & Broadcast Templates (Chữ động theo nhịp nhạc/giọng nói)**    | \- Chia văn bản thành các nhóm từ/cụm từ có ý nghĩa (**Word-level / Phrase-level Group**) bọc trong mặt nạ cắt (Merge Paths Intersect hoặc overflow: hidden). - Sử dụng tối đa **2 bộ font** trong một dự án (1 font Display cho tiêu đề/từ khóa Hero, 1 font phụ trợ dễ đọc).                                                                                                                                                            | \- Từ khóa nhấn mạnh (Beat-synced Hero Word): dùng extreme-snap-90 cubic-bezier(0.90, 0, 0.10, 1) (V_peak = 10.0x) hoặc biểu thức **3D Sequential Overshoot** của Dan Ebberts (freq=2, decay=5, dur=0.12s, delay=0.15s). - Chữ trượt tiêu chuẩn: kết hợp translateY + Group Skew với m3-emphasized-decelerate (0.05, 0.70, 0.10, 1).                                                 | \- Dựng **Beat Map** trước khi diễn hoạt: điểm rơi của từ khóa phải khớp với nhịp nhạc hoặc trọng âm giọng đọc. - Nhịp cảnh tuân thủ HIT -\> Hold (15–20 frames tĩnh) -\> Build -\> HIT để người xem kịp đọc hiểu nội dung.                                                                                                                                                                          | \- **Lỗi phổ biến nhất cần tránh:** Cấm diễn hoạt từng chữ cái rời rạc (animating every letter) cho toàn bộ câu dài vì làm mất trọng tâm và gây khó đọc. - Chỉ nhấn mạnh **1 từ khóa Hero tại một thời điểm**. - Đảm bảo thông điệp đọc hiểu được hoàn toàn khi tắt âm thanh (sound-off viewing).                                                                                                                  |
| **5. Brand Logo Stings & Generative Abstract Art (Intro/Outro thương hiệu)**           | \- Tận dụng **Nối chuỗi Repeater** (Repeater 1 ngang + Repeater 2 dọc) hoặc Duplicator + Falloff + Oscillator để tạo hoa văn hình học đồng tâm. - Dùng **Liquid Geometry** (Merge Paths Add + Offset Paths Round Join) và **Morphing Bézier** (đồng bộ First Vertex & Vertex Count) để kết tụ các mảnh hình học thành biểu tượng Logo.                                                                                                    | \- Pha dẫn nhập (Anticipation + Launch): dùng ease-in-back (0.36, 0, 0.66, -0.56) lùi nhẹ -9.8% rồi bung ra bằng EaseOutBack (0.34, 1.56, 0.64, 1) hoặc Inertial Bounce (springiness=1, wobbles=2.5, settle=6). - Đối với thương hiệu sang trọng/điện ảnh: dùng lò xo nặng **Heavy Cinematic** (m=2.0, k=90, c=24, zeta=0.89) trượt êm trong 902ms.                                  | \- Bắt buộc có chuyển động trong **15 frames đầu tiên**; kết hợp tia dẫn hướng (Trim Paths + Quỹ đạo cung tròn Separate Dimensions độ cong 36.5%), hợp nhất khối Logo, Stagger tên thương hiệu (3–6f offset) và giữ tĩnh kèm Idle Breathing.                                                                                                                                                         | \- Kiểm tra Rule of Zero (Group Position = \[0,0\]) trước khi bung hoa văn đối xứng để tâm xoay không bị lệch khỏi tâm khung hình. - Nếu xuất sang định dạng **Lottie JSON / .lottie** cho Web/App: giữ tổng số layer \< 20, tốc độ 24–30fps, làm tròn tọa độ còn 2–3 chữ số thập phân, tắt layer ẩn và nén qua .lottie (giảm 50–80% dung lượng, giữ tổng file \< 100 KB).                                         |

## Phần 4: Đóng Gói AI Skill (SKILL.md & theme.ts)

Phần này đã được tách thành file riêng trong trụ cột này: [`PILLAR.md`](PILLAR.md) (SKILL.md gốc, giữ nguyên) và [`theme.ts`](theme.ts) (token toán học, đã typecheck strict). Đính chính số liệu: [`ERRATA.md`](ERRATA.md).

## Phần 5: Hướng Dẫn Tích Hợp & Vận Hành Thực Tế Cho Người Viết Prompt

Để khai thác tối đa sức mạnh của gói Skill trên trong quy trình sản xuất
video đa lĩnh vực, bạn có thể áp dụng quy trình 3 bước tuần tự dưới đây:

1.  **Cài đặt vào môi trường AI Agent:** Với Claude Code, Cursor hoặc
    Windsurf, hãy tạo thư mục .claude/skills/motion-architecture/
    trong dự án của bạn, lưu nội dung mục **4.1** thành SKILL.md và
    lưu nội dung mục **4.2** thành src/theme.ts. Với ChatGPT, Claude
    Web, Gemini hoặc TypingMind, hãy tải file SKILL.md lên phần
    *Project Instructions / Custom Instructions / Skills* để mô hình
    đọc bộ quy tắc này trước khi xử lý mọi yêu cầu liên quan đến video
    hoặc animation.

2.  **Viết câu lệnh Prompt kích hoạt theo Token (Token-Driven
    Prompting):** Khi giao việc cho AI, bạn không cần phải tự viết lại
    các con số toán học mà chỉ cần gọi tên các **Chế độ (Regimes)** đã
    được định nghĩa sẵn trong Skill. Chẳng hạn, với *Short-form Video
    (Reels/TikTok)*, hãy yêu cầu: *"Dựng cảnh 6 giây (30fps,
    1080x1920) giới thiệu tính năng AI mới theo SKILL.md: dùng cấu
    trúc 5-layer stack, mở đầu frame 1 bằng EXPLOSIVE_ENTER_10_90, các
    thẻ tính năng dùng Nested Merge Paths và xuất hiện theo quỹ đạo
    NATURAL_QUARTER_ARC với Spring SAAS_CARD, kèm Pattern Interrupt ở
    giây thứ 3."* Với *Data Visualization / FinTech*, hãy yêu cầu:
    *"Dựng biểu đồ tăng trưởng doanh thu 4 quý bằng Trim Paths và
    Repeater; tuân thủ quy tắc T-007 trong SKILL.md: dùng
    SPRING_CRITICALLY_DAMPED (zeta = 1.0, không vọt lố) kết hợp
    Decelerating Stagger, giữ Hold 20 frames sau khi cột đạt đỉnh."*

3.  **Thực thi Vòng lặp Kiểm thử Thị giác (Visual Verification Loop):**
    Yêu cầu AI luôn chạy bước trích xuất khung hình tĩnh (npx remotion
    still hoặc ffmpeg) tại các thời điểm trọng yếu (ví dụ: tại frame
    15, 45, 90, 150 hoặc tại điểm đạt vận tốc đỉnh t_peak và điểm dừng
    t_settle) để tự đối chiếu với **Pre-Delivery Audit Checklist** ở
    cuối SKILL.md. Quy trình kiểm tra này đảm bảo không có phần tử nào
    tràn khỏi vùng an toàn 75%, không có đường cong tuyến tính bị bỏ
    sót, và thứ tự xếp lớp vector hoàn toàn chuẩn xác trước khi xuất
    bản video cuối cùng.

#### Nguồn trích dẫn

1\. After Effects Shape Layer Masterclass,
https://designkkashi.com/en/after-effects-shape-layer-repeater-merge-paths/
2. GitHub - haidrrrry/claude-remotion-skill: Open-source Claude agent,
https://github.com/haidrrrry/claude-remotion-skill 3.
claude-remotion-skill/remotion-motion-graphics/SKILL.md at main,
https://github.com/haidrrrry/claude-remotion-skill/blob/main/remotion-motion-graphics/SKILL.md
4. What silly things do you know by heart from being a motion designer,
https://www.reddit.com/r/AfterEffects/comments/1766s8d/what_silly_things_do_you_know_by_heart_from_being/
5. Advanced Shape Layer Techniques in After Effects - School of Motion,
https://schoolofmotion.com/blog/how-to-use-alpha-mattes-and-pre-comps 6.
When to use speed vs value graph? : r/AfterEffects - Reddit,
https://www.reddit.com/r/AfterEffects/comments/193jzni/when_to_use_speed_vs_value_graph/
7. Realistic Bounce and Overshoot - MotionScript.com,
https://motionscript.com/articles/bounce-and-overshoot.html 8. Overview
of shape layers, paths, and vector graphics \| After Effects,
https://helpx.adobe.com/sg/after-effects/desktop/drawing-painting-and-paths/vector-graphics-and-raster-images/overview-shape-layers-paths-vector.html
9. Speed graph to value graph mathematics - Adobe Community,
https://community.adobe.com/questions-529/speed-graph-to-value-graph-mathematics-59321
10. The Meaning, Maths, and Physics of SwiftUI Spring Animation: Amos,
https://medium.com/@amosgyamfi/the-meaning-maths-and-physics-of-swiftui-spring-animation-amos-gyamfis-manifesto-0044755da208
11. AE Best Practices: Lottie Optimization \| by Debanjana - Medium,
https://medium.com/@debanjanah/ae-best-practices-lottie-optimization-1430c4d1d2e2
12. Shapes - Lottie Docs - GitHub Pages,
https://lottiefiles.github.io/lottie-docs/shapes/ 13. Tutorial: Squash
and Stretch in After Effects - School of Motion,
https://schoolofmotion.com/blog/squash-stretch-after-effects 14.
Duplicator \| Cavalry,
https://cavalry.studio/docs/nodes/shapes/duplicator/ 15. Paint and path
operations, Shape attributes for shape layers,
https://helpx.adobe.com/si/after-effects/desktop/drawing-painting-and-paths/shapes-and-shape-attributes/shape-attributes-paint-operations-path.html
16. Optimize Lottie JSON – Reduce File Size & Improve Performance,
https://lottiewizard.com/optimize-lottie-json 17. Oscillator - Cavalry,
https://cavalry.studio/docs/nodes/behaviours/oscillator/ 18. Quick Start
\| Cavalry, https://cavalry.studio/docs/getting-started/quick-start/ 19.
Falloff \| Cavalry, https://cavalry.studio/docs/nodes/utilities/falloff/
20. Shapes and Paths Overview - Rive.app,
https://rive.app/docs/editor/fundamentals/shapes-and-paths-overview 21.
Trim Path - Rive,
https://rive.app/docs/editor/manipulating-shapes/trim-path 22. State
Machine Overview - Rive.app,
https://rive.app/docs/editor/state-machine/state-machine 23. Joysticks -
Rive, https://rive.app/docs/editor/manipulating-shapes/joysticks 24.
Rive animation guide 2026: complete tutorial for interactive motion,
https://hedrick.io/post/rive-animation-guide-2026 25. Rive 101 - State
Machine Overview - YouTube, https://www.youtube.com/watch?v=0Hb7SlEW6MI
26. Tips for rendering - Lottie Docs - GitHub Pages,
https://lottiefiles.github.io/lottie-docs/rendering/ 27. JSON Schema -
Lottie Docs - GitHub Pages,
https://lottiefiles.github.io/lottie-docs/schema/ 28. Manipulating
Shapes Overview - Rive,
https://rive.app/docs/editor/manipulating-shapes/manipulating-shapes 29.
Shape Layer Match Names - After Effects Scripting Guide,
https://ae-scripting.docsforadobe.dev/matchnames/layer/shapelayer/ 30.
Timing in Animation: Principles, Charts & Game-Ready Guide 2026,
https://sunstrikestudios.com/en/blog/timing_in_animation/ 31. Timing and
Spacing in Animation: Essential Fundamentals,
https://www.artemisiacollege.com/feeds/blog/timing-spacing-animation 32.
After Effects Graph Editor: The Beginner's Guide - DjordanMedia,
https://djordanmedia.com/blogs/news/after-effects-graph-editor-tutorial
33. How to Use the Graph Editor in After Effects \| Mt. Mograph,
https://mtmograph.com/blogs/tools/how-to-use-the-graph-editor-in-after-effects
34. CSS Cubic Bezier Generator,
https://www.cssportal.com/css-cubic-bezier-generator/ 35. Flow Will
Change How You Work With Ae's Graph Editor - Lesterbanks,
https://lesterbanks.com/2016/09/flow-will-change-work-aes-graph-editor/
36. Easing - LottieFiles Developer Portal — Lottie Animation Docs,
https://docs.lottiefiles.com/en/creator/07_animation/easing 37.
Translate KeyFrameEasing to Cubic Beziers - Adobe Community,
https://community.adobe.com/questions-529/translate-keyframeeasing-to-cubic-beziers-74848
38. Easing and duration – Material Design 3,
https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
39. Cubic Bezier easings for smooth animations - GitHub Gist,
https://gist.github.com/Jezfx/1f7c85b436e4c447ce59c81c8f7730da 40.
Design Motion Principles (Grade A) - Claude Skill - Skills Directory,
https://www.skillsdirectory.com/skills/intense-visions-design-motion-principles
41. Overshoot and bounce in After Effects: keyframes or expressions,
https://flexile.io/blog/bounce-and-overshoot-expressions 42. Live
Encore: Creating Realistic Movement in Animation \| Jake Bartlett,
https://www.skillshare.com/en/classes/live-encore-creating-realistic-movement-in-animation/492137231
43. Mastering the Graph Editor in After Effects - Pixflow.Net,
https://pixflow.net/blog/beyond-keyframes-mastering-the-graph-editor-for-precise-timing-and-easing-in-after-effects/
44. SKILL.md - Material Design 3 - GitHub,
https://github.com/hamen/material-3-skill/blob/master/skills/material-3/SKILL.md
45. Motion – Material Design 3,
https://m3.material.io/styles/motion/overview/specs 46.
interpolatingSpring(mass:stiffness:damping:initialVelocity:),
https://developer.apple.com/documentation/swiftui/animation/interpolatingspring(mass:stiffness:damping:initialvelocity:)
47. Customizing animations \| React Native Reanimated,
https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/customizing-animation/
48. Determine springWithDamping and initialSpringVelocity based off,
https://stackoverflow.com/questions/50029666/determine-springwithdamping-and-initialspringvelocity-based-off-from-friction-an
49. Spring \| Apple Developer Documentation,
https://developer.apple.com/documentation/swiftui/spring 50. Compose
Material 3 Expressive - YLabZ,
https://zoewave.medium.com/compose-material-3-expressive-89f4147df5b8
51. STANDARDS.md - rock3r/android-ux-skills - GitHub,
https://github.com/rock3r/android-ux-skills/blob/main/STANDARDS.md 52.
spring(duration:bounce:blendDuration:) - Apple Developer,
https://developer.apple.com/documentation/swiftui/animation/spring(duration:bounce:blendduration:)
53. SwiftUI animation timing - Nil Coalescing,
https://nilcoalescing.com/blog/AnimationTimingInSwiftUI 54. Adding
Motion Physics with Jetpack Compose - Material Design,
https://m3.material.io/blog/m3-expressive-motion-theming 55. Keyframe
Overshoot - ReelSmart Productions,
https://reelsmart.co/expression-library/keyframe-overshoot/ 56. Inertial
Bounce Expression for AE \| PDF - Scribd,
https://www.scribd.com/document/645479878/Bounce-Expression-GFXMentor
57. Top Five AE Expressions - Harry J. Frank,
https://www.graymachine.com/top-5-effects-expressions 58. Stretch and
Squash Tutorial in After Effects - Noble Desktop Blog,
https://blog.nobledesktop.com/learn/after-effects/stretch-and-squash-technique
59. Squash and Stretch - MotionScript.com,
https://motionscript.com/expressions-lab-ae65/squash-and-stretch.html
60. MYP Design 13.6 Animation and Motion Graphics Notes,
https://www.revisiondojo.com/myp/myp-design/myp-design-animation-and-motion-graphics/notes
61. super easy animations - 5 After Effects Expressions - Cinecom,
https://www.cinecom.net/adobe-after-effects-tutorials/super-easy-animations-expressions/
62. Squash and Stretch Animation Expression \| After Effects Expression,
https://www.plainlyvideos.com/after-effects-expressions-library/squash-stretch
63. Tasteful Web Animation - GitHub,
https://gist.github.com/corysimmons/1e2f64603ae234602f92dafe2b549ea9 64.
Optimal Short Form Video Length for Retention (2026 Analysis),
https://www.bytecap.io/blog/optimal-short-form-video-length-retention-analysis
65. How to Write Video Hooks for the First 3 Seconds - SocialKit,
https://socialk.it/en/blog/video-hooks-first-three-seconds 66. Remotion
Motion Graphics by haidrrrry — AI Skill for Any LLM,
https://www.typingmind.com/skills/haidrrrry-remotion-motion-graphics 67.
LottieFiles Tools - LottieFiles Blog,
https://lottiefiles.com/blog/lottiefiles-tools
