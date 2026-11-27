
# Motion Foundation Core

## Vai trò và thứ tự ưu tiên

Đây là bước nền tảng của mọi tác vụ motion thuộc phạm vi skill. Hoàn thành preflight trước khi sửa source hoặc dựng motion thực thi. Skill bổ sung kỷ luật thiết kế cho công cụ dựng video; nó không tự tạo quyền điều khiển AE, truy cập file hoặc ghi đè chỉ dẫn có ưu tiên cao hơn. Chỉ dẫn rõ ràng của người dùng được ưu tiên hơn mặc định của skill.

Phân biệt quy trình bắt buộc với thông số mặc định: mục tiêu, source audit, hierarchy, hình học, thời gian đọc và bằng chứng kiểm tra luôn cần được xử lý. Màu #004AAD, khổ 1080×1920, 30 fps, 6 giây/cảnh, grid và 20 mẫu là lựa chọn tham khảo; thay đổi chúng khi brief hoặc source yêu cầu. Ghi ngắn lý do reflow.

## Đọc tài liệu theo tầng

1. Đọc [foundations.md](references/foundations.md) trước tác vụ motion đầu tiên trong phiên; giữ các nguyên tắc này trong mọi lần sửa tiếp theo.
2. Đọc [source-and-gates.md](references/source-and-gates.md) và [plan-contract.md](references/plan-contract.md) trước lần preflight đầu.
3. Đọc `references/library/01_Grid_Coordinates.md`, `02_Text_Shape_Components.md` và `03_Motion_Timing.md` khi đặt grid hoặc motion mới.
4. Tra `references/library/07_84_Motion_Reference.md` để chọn A/B/C/D/E/F/G; tra `04_Layout_Index.md` rồi chỉ đọc file `layouts/Lxx.md` cần dùng. Mã L là layout; M là preset timeline; không đánh đồng với mã C/D/E.
   Khi có typography hoặc lựa chọn motion mới, đọc [text-and-motion-selection.md](references/text-and-motion-selection.md) để chọn treatment chữ T, hành vi C và nhịp G độc lập.
5. Không tải toàn bộ 20 layout hoặc lặp lại toàn bộ thư viện cho một thay đổi nhỏ. Khi sửa cục bộ, giữ plan và asset đã xác minh, kiểm tra lại phần ảnh hưởng và các phụ thuộc.

## Sáu câu hỏi phải được trả lời bằng đặc tả

- Người xem cần hiểu điều gì trong cảnh này?
- Điểm nhìn đầu tiên là gì, rồi đến phần nào?
- Chữ và shape nằm ở đâu trong quan hệ với source?
- Chuyển động nào diễn đạt thông tin hoặc dẫn sự chú ý?
- Trạng thái đọc nằm ở mốc nào và được giữ bao lâu?
- Nội dung nào của source phải được bảo toàn, và điều gì đã được kiểm tra thật?

Không yêu cầu người dùng trả lời lại những thông tin có trong brief, file hoặc phiên làm việc. Tự giải quyết lựa chọn thiết kế có thể đảo ngược. Chỉ hỏi phần thực sự cản trở hành động tiếp theo; vẫn tiếp tục các việc độc lập trong lúc chờ.

## Quy trình bắt buộc trước khi edit

### G0 Xác định tác vụ và phạm vi

Phân loại `create_new` hoặc `edit_existing`; ghi deliverable là plan, template hoặc final video. Tóm tắt mục tiêu, đối tượng, CTA nếu cần, yêu cầu giữ nguyên và phần được phép sửa. Không dùng yêu cầu «bắt mắt» làm lý do đủ để chọn hiệu ứng.

### G1 Kiểm tra source và năng lực công cụ

Tìm source đã được cung cấp trước khi hỏi người dùng. Với video có sẵn, kiểm tra metadata thật, tỷ lệ, fps có thể ở dạng phân số, thời lượng, audio, các cảnh quan trọng và chữ/logo/QR/phụ đề hoặc chủ thể cần bảo toàn. Xem mẫu ở đầu, giữa, cuối và các điểm cắt liên quan; bổ sung mẫu tại vùng chuyển động quan trọng.

Ghi công cụ và bằng chứng đã dùng. Tách metadata, quan sát khung hình và transcript/audio. Một kết quả ffprobe không đồng nghĩa đã nhìn video hoặc nghe audio. Nếu không mở được source thì chỉ lập plan sơ bộ, liệt kê phần thiếu và không mô tả source như đã xem. Nếu thiếu runtime dựng, tạo đặc tả cụ thể và ghi rõ chưa render.

Giữ source gốc; dùng bản sao, layer hoặc phiên bản output riêng. Không sửa file read-only, ghi đè project đang dùng, crop mất chủ thể, thay nhạc/voice hay đổi logo ngoài phạm vi được phép.

### G2 Chia cảnh theo ngữ nghĩa

Mỗi cảnh có một mục đích chính; liệt kê thông tin chính/phụ, source segment, chữ thực tế, voice hoặc mốc âm thanh. Chọn điểm cắt theo diễn biến và thời gian hiểu nội dung. Đặt khoảng giữ bằng nội dung thật; không ép mọi cảnh thành 6 giây.

### G3 Chọn bố cục và tạo style frame

Chọn profile theo deliverable; giữ fps source khi có yêu cầu bảo toàn và chỉ đổi khi có lý do. Chọn Lxx hoặc tạo layout custom có cùng bộ trường. Đặt safe bbox theo ứng dụng/ngữ cảnh thực tế; safe bbox mẫu không phải vùng an toàn chính thức của nền tảng.

Ghi x/y/w/h, z-order, font, cỡ, leading, line break, màu, padding, anchor basis và vùng bảo vệ source. Bbox là vùng phân bổ; Position AE phụ thuộc anchor và transform. Reflow khi đổi tỷ lệ; không kéo méo chữ hoặc scale nguyên comp để giả reflow. Xử lý trường hợp chữ dài bằng sửa line break, viết gọn hoặc tách cảnh.

### G4 Chọn style text và motion theo vai trò

Chọn A cho diện mạo; B/L cho bố cục; C cho chữ; D cho shape; E cho chuyển cảnh; F cho loại cảnh; G cho nhịp; M cho thông số preset. Một cảnh không bắt buộc có đủ mọi nhóm.

Với mỗi chuyển động, nêu mục đích, đối tượng, trạng thái đầu, điểm đến, hold, exit, keyframe, easing và quan hệ với voice/source. Cho các thành phần xuất hiện theo hierarchy; giữ điểm nhấn chính tại từng thời điểm. Dùng shape để diễn đạt hoặc hỗ trợ bố cục; không thêm shape vô nghĩa để lấp chỗ trống.

Phân biệt masked reveal với slide+fade; match cut với morph; cuộn chữ số với thay giá trị; clip UI mô phỏng với UI tương tác thật. Biểu đồ cần thang đo, đơn vị, kỳ và nguồn. Nội dung minh họa/placeholder phải được ghi rõ, không biến thành số liệu doanh nghiệp.

### G5 Kiểm tra trước khi edit

Tạo `motion_plan.json` theo contract và chạy:

```text
python scripts/validate_plan.py motion_plan.json --phase edit
```

Chỉ thực thi khi `ready_to_edit=true`. Khi có lỗi, sửa plan hoặc giải quyết input; không tự đổi kết quả kiểm tra. Preflight là bước AI tự làm, không phải yêu cầu người dùng bấm duyệt bắt buộc. Trước gate này có thể đọc, phân tích source, làm storyboard và thử style frame không tác động source.

Nếu host không chạy được Python, dùng cùng checklist và xuất kết quả thủ công có bằng chứng; ghi `validation_mode=manual`, không tuyên bố đã chạy script. Hệ thống cần chặn bằng kỹ thuật phải tích hợp gate ở đường gọi công cụ, ví dụ wrapper `scripts/gated_command.py`; skill Markdown không tự chặn các công cụ khác.

## Dựng và kiểm tra trước khi xuất

### G6 Dựng bản thử

Sau gate edit, dựng bản không phá hủy source. Kiểm tra style frame và các mốc entry/build/hold/exit, điểm cắt, mapping crop, occlusion, dấu tiếng Việt, readability, audio và CTA. Các mốc F006/F024/F090/F168 chỉ phù hợp mẫu 180 frame; chọn mốc thật cho scene có độ dài khác.

Không coi SVG hay tính đúng tọa độ là bằng chứng đã render AE. Bbox tĩnh không chứng minh chuyển động không che chủ thể ở các frame trung gian. Kiểm tra frame thật hoặc preview thật ở các khoảng bị ảnh hưởng.

### G7 Kiểm tra trước khi export

Ghi evidence của preview, text fit, bảo vệ source, dữ liệu và audio trong plan rồi chạy:

```text
python scripts/validate_plan.py motion_plan.json --phase export
```

Chỉ gọi xuất video cuối khi `ready_to_export=true`. Trước gate này vẫn được render preview để thu thập bằng chứng. Sau khi export, mở output để xác nhận duration, dimensions, fps, audio và những vùng đã sửa. Phân biệt `plan`, `preview_rendered`, `final_exported` và `final_verified` trong báo cáo.

## Kết quả tối thiểu cần lưu

1. Brief và phạm vi thay đổi, source audit, các giả định thực sự cần thiết.
2. Storyboard có frame master và frame cục bộ; các khoảng dùng dạng [start,end).
3. Bảng text/shape/media có bbox và thông số; chữ đúng nội dung người dùng.
4. Motion theo từng layer và transition có boundary cụ thể.
5. Kết quả gate và evidence; chỉ dẫn source/output thực tế.

Ở cuộc trò chuyện, trình bày phần người dùng cần xem. Không đổ toàn bộ JSON, lý thuyết hoặc 84 mục vào phản hồi cho một sửa nhỏ. Không tuyên bố skill đã cài, luôn tự kích hoạt, hoặc đã kiểm tra chất lượng thị giác nếu host chưa cung cấp bằng chứng.

## Khi đang làm việc cùng công cụ hoặc skill khác

Áp dụng skill này trước lớp thực thi AE, dựng bằng code, compositor hoặc công cụ video khác. Tiếp tục tuân thủ các yêu cầu của công cụ được chọn. Không suy ra mọi effect trong AE đều được hỗ trợ bởi tool/runtime khác. Khi user chỉ muốn plan, hoàn thành plan và nêu mức readiness, không tự tạo hoặc thay video ngoài phạm vi đó.
