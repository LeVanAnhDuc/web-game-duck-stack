# ADR-0014 · Bảng điểm cao tách theo độ khó, nickname là nhãn cục bộ

> **Ngày:** 2026-09-07
> **Trạng thái:** accepted
> **Liên quan:** FR-32 · FR-33 · FR-34 · US-03 · NFR-REL-02 · NFR-REL-03 ·
> NFR-I18N-03 · ADR-0004 · ADR-0013

## 1. Bối cảnh

`FR-31` đã xong từ `core-gameplay`: kết thúc lượt hiện chỉ số của lượt đó. Không có
gì được lưu, nên đóng tab là mất — `US-03` mô tả đúng phần thiếu này.

Ràng buộc nặng nhất có trước: **ADR-0013 §4**. `easy` nhân đường cong gravity 0.6,
`hard` nhân 1.8. Cùng một tay chơi sẽ ra điểm cao hơn hẳn ở `easy` chỉ vì có nhiều
thời gian hơn cho mỗi khối. Và `custom` không phải một mức mà là một **dải liên tục**
từ 0.25 tới 20 ô/giây.

Ràng buộc thứ hai: Non-Goals của `overview.md` — không leaderboard server, và **không
hệ thống tài khoản riêng của game**; khi cần định danh thì đi qua Ducker ID (ADR-0004),
mà Ducker ID hôm nay vẫn chưa có endpoint OAuth nào.

## 2. Quyết định

**a. Bốn bảng riêng, không bao giờ gộp.** `easy` · `normal` · `hard` · `custom`, mỗi
bảng xếp và cắt độc lập. Giao diện cho chọn bảng bằng segmented control, mở sẵn ở
bảng ứng với độ khó đang chơi.

**b. `custom` là một bảng, và mỗi dòng hiện tốc độ của chính nó.** Kèm một câu nói rõ
các dòng trong bảng này không so được với nhau. Trung thực hơn cả hai phương án còn
lại: gộp `custom` vào `normal` là nói sai, còn tách một bảng cho mỗi giá trị tốc độ là
vô số bảng.

**c. Thời điểm lưu là `epoch ms`, định dạng lúc render** bằng `Intl.DateTimeFormat`
theo locale đang chọn. Đây chính là FR-33: người chơi đổi được ngôn ngữ **sau** khi
điểm đã lưu. `dateStyle: 'short'` chứ không `medium` — đo ở 375 thì bản `medium` đẩy
dòng phụ sang dòng thứ ba, mất trọn một hàng đang thấy được.

**d. Nickname có repository RIÊNG, không nằm trong `Settings`.** `IdentityRepository`
là interface thứ ba mà ADR-0004 hứa và tới feature này mới cần. Nickname là **nhãn
hiển thị**: không mật khẩu, không duy nhất, không xác thực, không có gì rời khỏi máy.
Non-Goal "không hệ thống tài khoản riêng" vẫn nguyên: không bảng user, không đăng nhập.

**e. Mỗi bảng tối đa 10 dòng, và không lưu lượt trắng** (`score === 0 && lines === 0`).
Chặn trên kích thước trong `localStorage`, và một bảng dài hơn 10 thì không còn là
điểm *cao*.

**f. Ghi đúng một lần cho mỗi lượt, khoá theo `runId`** do `useGameSession` cấp và
publish trong HUD. HUD được publish ~10Hz và React ở StrictMode gọi effect hai lần,
nên điều kiện "phase là gameOver" sẽ ghi lặp lại cùng một lượt. `session.ts` **không**
tự lưu — nó không được thấy storage (architecture.md §3).

**g. Bảng và tốc độ của một lượt được CHỤP lúc lượt bắt đầu**, đi kèm `runId` trong
HUD — không đọc settings sống lúc lưu. Gravity của một lượt đã đóng băng từ khi
session được dựng (ADR-0013), còn settings thì đổi được ngay. Đọc settings sống nghĩa
là: chơi Dễ tới 20.000 điểm → tạm dừng → đổi sang Khó → chơi tiếp lượt cũ → kết thúc,
và lượt chạy ở gravity ×0.6 bị xếp vào bảng **Khó**. Đúng cái trộn độ khó mà §2a tồn
tại để ngăn. Cùng lỗi trên trục `custom`: kéo thanh tốc độ giữa lượt sẽ ghi tốc độ
*mới* cho một lượt chạy ở tốc độ cũ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Một bảng gộp mọi độ khó | ADR-0013 §4: đo được ai chọn Dễ, không đo kỹ năng |
| Chuẩn hoá điểm theo hệ số độ khó rồi xếp chung | Con số chuẩn hoá không mang nghĩa nào — `easy` không phải "cùng lượt đó chậm hơn 1.67 lần" |
| Gộp `custom` vào `normal` | 0.25 và 20 ô/giây cùng một bảng với `normal` là nói sai về cả ba |
| Nickname nằm trong `Settings` | Khi Ducker ID vào, danh tính phải thay được mà không đụng cách lưu keybind (ADR-0004) |
| Lưu thời điểm dạng chuỗi đã định dạng | Đổi ngôn ngữ là bảng nói sai ngôn ngữ — vi phạm thẳng FR-33 |
| Lưu replay theo mỗi kỷ lục | Quota. Replay chỉ có ích khi có màn xem lại, mà màn đó chưa có |
| Không giới hạn số dòng | Quota tăng không chặn trên |
| Lưu điểm trong `session.ts` khi lượt kết thúc | Đặt I/O vào thứ mà loop gọi 60 lần/giây; và phá ranh giới module ở architecture.md §3 |
| Chống ghi lặp bằng cách so `phase` trước/sau | Không đủ: StrictMode gọi effect hai lần với cùng một `phase`. Phải khoá theo danh tính của lượt |
| Đọc `settings` sống lúc lưu để biết bảng nào | Xếp lượt vào bảng sai nếu người chơi đổi độ khó giữa lượt (§2g) |
| Kẹp `at` ở `Number.MAX_SAFE_INTEGER` | Lớn hơn `Date` hợp lệ tối đa (8.64e15), nên `toISOString()` ném `RangeError` lúc render — một dòng hỏng làm trắng cả app vì không có error boundary |
| Lưu nickname mỗi lần gõ một ký tự | 16 lần ghi `localStorage` để nhập một cái tên, mỗi lần render lại mọi consumer của context. Đã hoãn 400ms và flush khi unmount |
| Một biến `status` dùng chung cho điểm và danh tính | Ghi danh tính bị chặn thì màn hình báo *bảng điểm* không lưu được; và một lần ghi thành công xoá mất cảnh báo `recovered` vẫn còn đúng |

## 4. Hệ quả

**Được:**
- Bảng điểm nói được điều đúng: so trong cùng một độ khó.
- Ba interface của ADR-0004 giờ đã có cả ba, mỗi cái đúng một implementation.
- Nhánh lỗi storage test được: hỏng · bị chặn · hết quota · một dòng hỏng.

**Mất / phải chấp nhận:**
- Bốn bảng nhỏ thay vì một bảng dài. Người chơi đổi độ khó sẽ thấy bảng "trống" và
  phải hiểu vì sao — nên bảng trống nói rõ "chưa có lượt nào **ở mức này**".
- Bảng `custom` xếp theo điểm dù các dòng khác tốc độ. Không có cách xếp nào đúng
  hơn; chỉ có cách **nói rõ**, và đó là câu ghi chú ở đầu bảng.
- Điểm cũ từ trước feature này không tồn tại — không có gì để migrate, và
  `migrateScores` vẫn phải chịu được dữ liệu lạ vì bản sau này sẽ có.

**Điều kiện xem lại:** khi có mode Sprint/Ultra (backlog) — chúng đo bằng **thời gian
ngắn nhất** chứ không phải điểm cao nhất, nên `compareEntries` sẽ cần một chiều xếp
thứ hai, không phải thêm một bảng nữa.
