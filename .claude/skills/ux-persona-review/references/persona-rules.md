# Rule tạo persona — bản đã fetch cho Duck Stack

Fetch ngày **2026-09-12**. Bản này **thay** bản seed offline. Nguồn ghi ở cuối file, kèm cái
nào lấy được nguyên văn và cái nào chỉ lấy được qua kết quả tìm kiếm.

Phần 1–5 là rule chung. **Phần 6 là phần riêng của domain này** — nó là phần dễ sai nhất khi
viết persona cho một cái game, và là lý do không dùng bản seed.

---

## 1. Phân loại (Cooper, *About Face*)

Sáu loại, không phải bốn:

| Loại | Nghĩa |
| --- | --- |
| primary | người mà **một** giao diện được thiết kế cho. Cooper: *"Design each interface for a single, primary persona."* Không phục vụ được họ là hỏng |
| secondary | phần lớn mục tiêu của họ được đáp ứng khi ta nhắm vào primary, nhưng còn thiếu vài thứ |
| supplemental | không được nhắm tới, nhưng nhu cầu của họ vẫn được thoả khi ta phục vụ primary |
| customer | người **quyết định mua**. ⚪ Không áp dụng ở đây — không ai trả tiền (`overview.md` §5) |
| served | không tự dùng sản phẩm, nhưng bị ảnh hưởng bởi việc người khác dùng nó |
| negative | loại người sản phẩm **không** được thiết kế cho. Có mặt để phát hiện đang phục vụ nhầm ai |

Ở dàn của Duck Stack: **đúng một** negative, và `customer` bỏ hẳn.

## 2. Cảnh báo persona bịa (NN/g)

NN/g chia ba mức: **proto-persona** (dựng từ giả định của nhóm, 2–4 tiếng, "inherently
inaccurate"), **qualitative** (5–30 phỏng vấn), **statistical** (100–500+ mẫu, phân cụm).

Dàn persona của skill này là **proto-persona**, không cần giả vờ khác. Hệ quả phải chấp nhận:
nó bắt được *vấn đề giao diện*, nó **không** chứng minh được *ai là người dùng thật*. Mọi báo
cáo sinh ra từ đây nói được "một người mới sẽ vấp ở đây", không nói được "người chơi của chúng
ta muốn X".

Luật NN/g áp trực tiếp vào lúc viết file persona: persona dự báo hành vi nhờ **bối cảnh và
động cơ**, không nhờ nhân khẩu học. *"If you don't know why someone did something, you're going
to have to make assumptions, which are often wrong."* Dựng persona từ dữ liệu nhân khẩu hay
analytics mà không có bối cảnh thì cho ra thứ "limited utility for UX decision making".

Áp dụng: mỗi dòng trong file persona phải **đổi được thành một hành vi quan sát được**.
Tuổi và nghề chỉ được viết khi chúng đổi cách người đó chơi. "Nam, 22 tuổi, sinh viên" không
dự báo gì. "Từ tetr.io sang, nghĩ DAS bằng **millisecond** nên đọc số `tick` là không hiểu" thì có.

## 3. Trường bắt buộc của mỗi persona

| Trường | Vì sao bắt buộc |
| --- | --- |
| bối cảnh, nghề nghiệp | để lời persona kể nghe như người thật, và để biết họ đang chơi lúc nào |
| loại Cooper | primary · secondary · supplemental · served · negative |
| trình độ với **game xếp khối** (không phải trình độ số nói chung) | quyết định mức chịu đựng thuật ngữ: một người từ tetr.io sang và một người lần đầu chơi vấp ở hai chỗ hoàn toàn khác nhau |
| thiết bị + điều kiện mạng | đổi thẳng thành viewport và network throttle của phiên |
| nhu cầu tiếp cận | dàn **bắt buộc** có ít nhất một người: mù màu, chỉ dùng bàn phím, hoặc thị lực kém |
| động cơ, nỗi sợ | định hướng cái persona chú ý tới trong 5 giây đầu |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc. Đây là điều kiện dừng thật của phiên (`lib/orchestration.md`), không phải trang trí |
| ngôn ngữ | `vi` hoặc `en` — quyết định cả locale trình duyệt của phiên |
| JTBD | một câu, xem phần 4 |
| `goal_in_user_words` cho từng Red Route `live` | xem phần 5 |

## 4. Jobs-To-Be-Done

Dạng câu (Klement / Intercom): ***Khi \_\_\_, tôi muốn \_\_\_, để \_\_\_.*** — hoàn cảnh, động
cơ, kết quả mong đợi.

Nó khác user story ở chỗ user story (*"là một X, tôi muốn Y, để Z"*) khoá sẵn cả loại người
dùng lẫn giải pháp, còn job story chỉ nêu **hoàn cảnh**. Luật bắt buộc: job phải **không dính
tới giải pháp** (solution-agnostic). Viết "tôi muốn mở màn cài đặt để đổi DAS" là đã hỏng — đó
là giải pháp. Viết "khi tay tôi không kịp theo khối lúc nó rơi nhanh, tôi muốn nó phản hồi
giống cái game tôi vẫn chơi, để tôi không phải học lại phản xạ" thì đúng.

Câu JTBD này là **nguyên liệu** để sinh `goal_in_user_words`, không phải bản thân nó.

## 5. `goal_in_user_words` — luật nghiêm nhất của file này

Với mỗi Red Route `live`, viết nhu cầu bằng **từ ngữ người chơi**, cố ý tránh từ ngữ sản phẩm.
Persona **không được biết** tên nút, tên màn, tên tính năng — nếu biết thì phiên đó không còn
đo được "có tự mò ra không", mà chỉ đo được "có bấm đúng nút được chỉ không".

| Sai (từ của sản phẩm) | Đúng (từ của người chơi) |
| --- | --- |
| "mở Settings rồi bật Distinguish without colour" | "mấy khối này với tôi trông gần như cùng một màu, tôi cần biết cái đang rơi là khối gì" |
| "bấm Play again ở modal Game over" | "vừa thua, muốn chơi lại ngay" |
| "đổi keybind cho hardDrop" | "phím thả khối không đúng tay tôi, tôi muốn đổi" |
| "xem bảng high score theo bucket difficulty" | "lần trước tôi được bao nhiêu điểm nhỉ" |

## 6. Riêng domain này — người chơi game xếp khối

Sáu điều dưới đây đổi thẳng cách viết persona cho Duck Stack. Chúng là thứ bản seed không có.

### 6a. Hai nhóm người chơi nói hai ngôn ngữ khác nhau

`overview.md` §3 chia nhóm chính (đã có phản xạ chuẩn hiện đại) và nhóm phụ (tình cờ mở trên
điện thoại). Khoảng cách từ vựng giữa hai nhóm này lớn hơn hầu hết sản phẩm:

| Nhóm chính nói | Nhóm phụ nói |
| --- | --- |
| hold, ghost, 7-bag, T-spin, B2B, combo, perfect clear, top out | "để dành khối", "cái bóng mờ", "khối tiếp theo", "ăn 4 hàng" |
| DAS, ARR, SDF, finesse, handling | "nó chạy ngang nhanh quá / chậm quá" |
| block out / lock out | "chết rồi" |

Persona nhóm chính **được phép** dùng từ chuyên ngành trong lời kể của họ — đó là từ của
*người dùng đó*, không phải từ của sản phẩm, nên không vi phạm phần 5. Persona nhóm phụ thì
tuyệt đối không.

### 6b. Đơn vị DAS/ARR là chỗ lệch đã biết trước

Người chơi tetr.io/jstris nghĩ DAS/ARR bằng **millisecond hoặc frame**: thực tế phổ biến là
ARR 0 (khối "teleport" ngay khi DAS sạc xong) và DAS khoảng 60–100ms; "almost all serious
players will use 0 arr". Duck Stack hiện hiện hai số này bằng **`tick`** (`settings.dasHint`:
"{n} ticks before auto-repeat").

Đây là một lệch **có thật, kiểm được**, không phải giả định — nên nó phải nằm trong một persona
nhóm chính và persona đó phải đi tìm đơn vị mình quen. Đừng viết sẵn kết luận vào persona; để
họ tự vấp rồi kể lại.

### 6c. "Đúng luật" là tiêu chí cảm nhận, không phải tiêu chí chức năng

`overview.md` §2: với người đã có phản xạ, **sai một chi tiết luật là chơi không được**. Thiếu
wall kick thì nước xoay vào khe quen bị chặn và họ kết luận "game này sai". Persona nhóm chính
phải có trong động cơ một câu dạng *"tôi thử ngay vài nước quen để xem cái này có đúng luật
không"* — và trong nỗi sợ là *"lại một bản clone nữa xoay không lách được"*.

Ngược lại, nhóm phụ **không thể** phát hiện sai luật. Đừng gán cho họ khả năng đó.

### 6d. Người chơi game phán xét trong vài giây, và phán xét bằng cảm giác điều khiển

Khác sản phẩm công cụ: ở game, thứ quyết định "có chơi tiếp không" là độ nảy của phản hồi —
khối có đi theo tay không, có trễ không. Vì vậy trong bốn câu ấn tượng đầu, câu "trang này là
gì" ở đây **dễ** (thấy bàn xếp khối là biết), nhưng câu "ba từ sau khi dùng" **gắt** và phải
được đọc như nhận xét về *cảm giác điều khiển*, không phải về thẩm mỹ.

### 6e. Không có tài khoản, nên không có nỗi sợ quen thuộc nào về dữ liệu

Mọi thứ nằm trong `localStorage` trên máy người chơi (`nfr.md` §Data & Privacy: ⚪ chưa áp
dụng). Vậy **không** viết vào persona những nỗi sợ kiểu "sợ bị spam mail", "sợ lộ dữ liệu" —
không có chỗ nào để xảy ra. Nỗi sợ đúng ngữ cảnh là: *"điểm cao của tôi có mất không nếu tôi
dọn trình duyệt"* — và đó là câu app **có** trả lời (`scores.localOnly`), nên persona nào có
nỗi sợ đó là một phép thử thật.

### 6f. Persona a11y ở game khó hơn ở form

Theo cảnh báo của GOV.UK: **"A simulation is never a true representation of an impairment."**
Bộ 7 profile của họ (Claudia · Ashleigh · Ron · Chris · Pawel · Simone · Saleem) mô phỏng để
việc gì đó khó với người không khuyết tật **xấp xỉ** như nó khó với người khuyết tật — và
GOV.UK nói thẳng đây **không thay thế** việc test với người dùng thật.

Chọn profile cho một cái game hành động thời gian thực thì khác chọn cho một cái form:

| Profile GOV.UK | Dùng được ở Duck Stack? |
| --- | --- |
| **Claudia** (thị lực kém, phóng to màn hình) | **có** — bàn 10×20 + HUD + hàng chờ trên một màn hình phóng to là phép thử thật |
| **Chris** (viêm khớp dạng thấp) | **có** — game đòi bấm nhanh và giữ phím; DAS/ARR trở thành vấn đề tiếp cận, không phải tuỳ chọn |
| **Ashleigh** (mù, screen reader) | **không** — bàn chơi là một `<canvas>` có `aria-label` tĩnh. Không ai chơi Tetris bằng screen reader, và ép một phiên như vậy chỉ sinh ra một phát hiện đã biết trước |
| **Saleem** (khiếm thính) | **một phần** — chỉ để kiểm rằng âm thanh không phải kênh thông tin duy nhất; đây là hiệu ứng, không phải nhạc nền (Non-Goal) |
| Ron · Pawel · Simone | không nằm trong dàn hiện tại — ghi ra để lần sau không phải suy lại |

**Thêm một nhu cầu tiếp cận GOV.UK không có profile riêng: mù màu.** Ở project này nó là
nhu cầu a11y **quan trọng nhất**, vì `NFR-A11Y-06` + ADR-0008 làm màu thành kênh duy nhất phân
loại 7 khối. Đó là RR-07.

## 7. Kích thước dàn

5–7 người, **cố định giữa các lần chạy**. Đẻ persona mới mỗi lần chạy là tự tay phá thứ đắt
nhất skill này tạo ra: khả năng so sánh trước và sau khi sửa.

Bắt buộc trong dàn: ít nhất một persona tiếp cận · **đúng một** negative · ít nhất một người
dùng điện thoại trên mạng chậm.

---

## Nguồn

| Nguồn | Lấy được thế nào |
| --- | --- |
| NN/g — *Three Persona Types* (proto / qualitative / statistical, cảnh báo persona giả định) <https://www.nngroup.com/articles/persona-types/> | fetch được nguyên trang |
| GOV.UK Accessibility Personas (7 profile, câu "a simulation is never a true representation") <https://alphagov.github.io/accessibility-personas/> | fetch được nguyên trang |
| Cooper, *About Face* — 6 loại persona | **không** fetch được nguyên văn. IxDF chỉ xác nhận primary/secondary; bốn loại còn lại lấy qua kết quả tìm kiếm trích *About Face*. Coi phần này là **gián tiếp** |
| Alan Klement — job story *"When \_\_\_, I want to \_\_\_, so I can \_\_\_"* | lấy qua kết quả tìm kiếm; bài gốc trên Medium trả 403 |
| David Travis / Userfocus — Red Routes (tần suất × mức nghiêm trọng, đặt ra năm 2006) | <https://www.userfocus.co.uk/articles/redroutes.html> trả **403**; định nghĩa lấy qua kết quả tìm kiếm |
| TETR.IO FAQ + Jstris guide + r/Tetris — DAS/ARR/SDF, finesse, "0 ARR, DAS 60–100ms" | lấy qua kết quả tìm kiếm; dùng cho phần 6b |
| tetris.wiki — *Tetris Guideline* | trả **403**. Từ vựng ở phần 6a vì vậy lấy từ chính repo (`src/i18n/en.json`, `docs/01-product/glossary.md`) chứ không từ wiki |

**Hai nguồn trả 403 và một nguồn không có nguyên văn** — đó là lý do bảng này tồn tại thay vì
một dòng "đã fetch". Muốn lấy lại: `install.sh <project> --refresh-rules` rồi làm lại Bước 4
của `ux-persona-lab`.
