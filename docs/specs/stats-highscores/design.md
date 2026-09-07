> **Liên quan:** FR-31 → FR-34 · US-03 · NFR-REL-02 · NFR-REL-03 · NFR-I18N-03 ·
> NFR-A11Y-02 · ADR-0004 · ADR-0013 · ADR-0014

# Thiết kế · `stats-highscores`

## 1. Vấn đề

`FR-31` đã xong từ `core-gameplay`: modal kết thúc lượt hiện chỉ số của **lượt vừa
rồi**. Cái còn thiếu là ký ức — đóng tab là mất hết, nên không có gì để so. `US-03`
mô tả đúng phần thiếu đó: mở lại trang sau vài ngày và biết mình đã làm được tới đâu.

Ba chức năng còn nợ:

| ID | Nội dung |
| --- | --- |
| FR-32 | Điểm cao cục bộ **theo từng chế độ** |
| FR-33 | Hiển thị thời điểm đạt điểm theo locale đang chọn |
| FR-34 | Định danh cục bộ bằng nickname |

## 2. Ràng buộc đã có trước, không được vi phạm

**ADR-0013 §4 — điểm giữa các độ khó không so được với nhau.** Đây là ràng buộc
nặng nhất và nó quyết định cả hình dạng dữ liệu. `easy` nhân gravity 0.6, `hard` nhân
1.8; cùng một tay chơi sẽ ra điểm cao hơn hẳn ở `easy` vì có nhiều thời gian hơn cho
mỗi khối. Một bảng gộp không đo kỹ năng, nó đo **ai đã chọn Dễ**. Nên bảng tách theo
độ khó, và bốn bảng đó không bao giờ được cộng lại hay xếp chung.

**`custom` là một dải liên tục, không phải một mức.** 0.25 ô/giây và 20 ô/giây đều là
`custom`, và giữa chúng thì mọi so sánh đều vô nghĩa. Nhưng gộp chúng vào `normal`
thì tệ hơn. Nên: `custom` là **một bảng riêng, và mỗi dòng hiện tốc độ của chính nó** —
bảng vẫn xếp theo điểm, nhưng người đọc thấy ngay dòng nào chạy nhanh hơn dòng nào.
Trung thực hơn là giả vờ chúng ngang nhau.

**ADR-0004 — identity đi sau interface.** Nickname **không phải tài khoản**: không
mật khẩu, không duy nhất, không xác thực, không đồng bộ. Nó là một nhãn hiển thị nằm
cạnh điểm. Đây là lý do nó **không nằm trong `Settings`** mà có repository riêng: khi
Ducker ID có endpoint thật, cái bị thay là `IdentityRepository`, không phải file
settings của người chơi. Non-Goal "không hệ thống tài khoản riêng" vẫn nguyên vẹn —
kiểm tra lại: không có bảng user, không có đăng nhập, không có gì rời khỏi máy.

**Non-Goal "không leaderboard server".** Giao diện không được gợi ý là có so với
người khác. Nên màn hình nói thẳng một câu: chỉ nằm trên máy này.

## 3. Dữ liệu

```ts
type Bucket = 'easy' | 'normal' | 'hard' | 'custom'   // = Difficulty

interface ScoreEntry {
  id: string          // để làm React key và để đánh dấu lượt vừa xong
  nickname: string    // rỗng = chưa đặt, hiện nhãn mặc định
  score: number
  lines: number
  level: number
  seconds: number
  pps: number
  cellsPerSecond: number | null   // chỉ có nghĩa ở bảng `custom`
  at: number          // epoch ms
}

interface ScoreBoard { schemaVersion: number; boards: Record<Bucket, ScoreEntry[]> }
```

**`at` lưu là epoch ms, không lưu chuỗi đã định dạng.** Đây chính là FR-33: locale đổi
được sau khi điểm đã lưu, nên nếu lưu `"07/09/2026"` thì đổi sang tiếng Anh vẫn ra
chuỗi tiếng Việt cũ. Định dạng xảy ra lúc render, bằng `Intl.DateTimeFormat(locale)`.
Cùng lý do đó áp cho mọi con số trong bảng (NFR-I18N-03).

**Mỗi bảng giữ tối đa 10 dòng.** `localStorage` có quota và một người chơi nhiều có
thể tạo ra hàng nghìn lượt. Cắt ở 10 giữ kích thước chặn trên ~4KB, và một bảng điểm
cao dài hơn 10 thì không còn là điểm *cao*.

**Không lưu lượt trắng.** `score === 0 && lines === 0` là mở trang rồi để chết, không
phải một kỷ lục. Lưu nó thì bảng đầy rác ngay và đẩy các dòng thật ra ngoài.

## 4. Ghi vào đúng một lần cho mỗi lượt

Chỗ này dễ sai nhất. HUD được publish ~10Hz và React ở StrictMode gọi effect hai
lần, nên "khi `phase === 'gameOver'` thì lưu" sẽ lưu nhiều lần cho cùng một lượt.

Giải: `useGameSession` cấp một **`runId`** tăng lên mỗi lần `restart()` và mỗi lần
session được dựng lại, và publish nó trong HUD. `PlayScreen` giữ `savedRunRef` và chỉ
ghi khi `hud.runId !== savedRunRef.current`. Ref sống qua cả hai lần gọi effect của
StrictMode, nên guard đứng được.

`session.ts` không tự lưu — nó không được thấy storage (architecture.md §3). Quyết
định lưu là của `ui/`.

**Bảng và tốc độ cũng đi trong HUD, chụp lúc lượt bắt đầu** — xem ADR-0014 §2g. Đọc
`settings` sống lúc lưu sẽ xếp một lượt Dễ vào bảng Khó nếu người chơi tạm dừng giữa
lượt để đổi độ khó.

## 5. Giao diện

Một dialog, mở từ ba chỗ: nút cúp trên topbar, nút "Điểm cao" ở modal kết thúc lượt
(nút này có sẵn từ bản đầu nhưng bị vô hiệu — feature này bật nó lên), và modal tạm
dừng. Dùng lại nguyên vỏ dialog của `SettingsScreen`: Escape đóng, bẫy
focus, trả focus về chỗ cũ, và **nhả bàn phím cho dialog** qua `keyboardEnabled` —
không có cái cuối thì phím mũi tên trong ô nhập nickname bị game ăn mất (NFR-A11Y-02).

Hai chỗ phải làm khác `SettingsScreen` vì vỏ đó có sẵn lỗi: (1) trả focus phải có
đường dự phòng, vì nút mở dialog nằm trong modal tạm dừng và **bị unmount cùng lúc**
dialog mount — `document.activeElement` lúc effect chạy đã là `<body>`; (2) bẫy focus
phải xử lý trường hợp focus rơi ra ngoài tập focusable, vì xoá bảng làm chính cái nút
đang giữ focus thành `disabled`. Cả hai đã sửa ở cả hai màn.

**Một layout cho cả ba khổ**: hàng hai dòng — dòng trên hạng · điểm · nickname, dòng
dưới hàng · cấp · thời gian · ngày · (tốc độ, nếu là bảng `custom`). Đã loại phương án
bảng nhiều cột: 8 cột không vừa 375 và cần media query để gập lại, mà một bảng gập
được là một bảng có hai layout phải tự kiểm cả hai.

Lượt vừa xong được đánh dấu (`aria-current="true"` + vạch bên trái) — nếu không thì
người chơi vừa đạt hạng 4 phải tự dò xem dòng nào là mình.

Bảng trống nói rõ "chưa có lượt nào ở mức này" (US-03 §Điều gì có thể sai), không phải
một khung trắng.

## 6. Nhánh lỗi

| Tình huống | Xử lý |
| --- | --- |
| `localStorage` bị chặn / hết quota | Vẫn chơi được; dialog nói điểm không lưu được (NFR-REL-03) |
| Dữ liệu hỏng hoặc do bản cũ ghi | `migrateScores` trả bảng rỗng thay vì ném; trạng thái `recovered` được báo (NFR-REL-02) |
| Một dòng trong dữ liệu bị hỏng | Bỏ đúng dòng đó, giữ các dòng còn lành — mất một kỷ lục nhẹ hơn mất cả bảng |

## 7. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Một bảng gộp mọi độ khó | ADR-0013 §4: đo được ai chọn Dễ, không đo kỹ năng |
| Chuẩn hoá điểm theo hệ số độ khó rồi xếp chung | Con số chuẩn hoá không có nghĩa nào cả — `easy` không phải "cùng lượt đó chậm hơn 1.67 lần" |
| Nickname nằm trong `Settings` | Khi Ducker ID vào, danh tính phải thay được mà không đụng settings (ADR-0004) |
| Lưu thời điểm dưới dạng chuỗi đã định dạng | Đổi ngôn ngữ là bảng nói sai ngôn ngữ. Vi phạm thẳng FR-33 |
| Lưu cả replay theo mỗi kỷ lục | Quota. Replay có ích khi có màn xem lại, mà màn đó chưa có (backlog) |
| Không giới hạn số dòng | Quota tăng không chặn trên, và bảng dài không còn là "điểm cao" |
