# Dàn persona — Duck Stack

6 người, **cố định giữa các lần chạy** (`persona-rules.md` §7). Đổi dàn là mất khả năng so
sánh trước/sau khi sửa — thứ đắt nhất skill này tạo ra. Thêm người mới thì cấp `pNN` mới, không
sửa người cũ.

Dàn này thoả ba ràng buộc bắt buộc: **hai** persona tiếp cận (p03 mù màu, p05 viêm khớp),
**đúng một** negative (p06), và **một** người dùng điện thoại trên mạng chậm (p04).

| ID | Ai | Loại Cooper | Thiết bị | Ngôn ngữ | `patience_threshold` |
| --- | --- | --- | --- | --- | --- |
| p01 | Guideline veteran từ tetr.io | primary | desktop 1920×1080, bàn phím cơ | `en` | 3 |
| p02 | Người chưa từng chơi Tetris hiện đại | secondary | laptop 1366×768 | `vi` (trình duyệt `en`) | 5 |
| p03 | Người chơi mù màu đỏ-lục | primary + a11y | desktop 1920×1080 | `en` | 6 |
| p04 | Người tình cờ mở trên điện thoại | secondary | 375×667, 3G mô phỏng | `vi` | 2 |
| p05 | Người viêm khớp dạng thấp | supplemental + a11y | desktop 1920×1080 | `vi` | 4 |
| p06 | Người tìm game casual giết 2 phút | **negative** | 390×844, wifi | `vi` | 2 |

## Phân công Red Route → persona

10 route `live` → 10 phiên có mục tiêu, cộng 2 phiên mù = **12 phiên**
(`lib/orchestration.md` §Danh sách phiên). Mỗi ô là persona *hợp nhất*, không phải persona
*duy nhất dùng được* — nhưng đừng đổi tuỳ tiện giữa các lần chạy, vì đổi người là đổi kết quả.

| Red Route | Persona | Vì sao người này |
| --- | --- | --- |
| RR-01 xoá hàng đầu tiên | **p02** | người duy nhất trong dàn thật sự không biết chơi |
| RR-02 chết → chơi lại | **p02** | cùng phiên với RR-01 thì ván đầu của họ tự nhiên dẫn tới đây |
| RR-03 tạm dừng → chơi tiếp | **p05** | người duy nhất **cần** nghỉ giữa ván vì lý do thể chất |
| RR-04 đổi phím | **p01** | ngưỡng 60 giây ở `overview.md` §6.3 được đặt cho đúng nhóm này |
| RR-05 chỉnh DAS/ARR | **p01** | và đây là chỗ lệch đơn vị tick ↔ ms (`persona-rules.md` §6b) |
| RR-06 đổi ngôn ngữ | **p04** | người Việt, trình duyệt tiếng Việt, và đọc UI trên màn hình nhỏ nơi chuỗi dài dễ vỡ |
| RR-07 không phân biệt được màu | **p03** | ràng buộc a11y quan trọng nhất của project |
| RR-08 thấy tên mình trên bảng đúng độ khó | **p05** | người theo dõi tiến bộ của mình qua nhiều ngày |
| RR-09 chơi bằng cảm ứng, 3G | **p04** | đúng định nghĩa nhóm phụ ở `overview.md` §3 |
| RR-10 xoá sạch một bảng điểm | **p06** | negative persona: người bấm mọi nút, kể cả nút không hoàn lại được |
| *phiên mù 1* — trình độ số thấp, điện thoại | **p06** | |
| *phiên mù 2* — power user, desktop | **p01** | |

`p01` và `p04` mỗi người chạy 3 phiên, `p02` và `p05` mỗi người 2, `p03` 1, `p06` 2.

## Mã phiên

Đặt theo `lib/orchestration.md` §Mã phiên: `p<NN>-<RR-id>` cho phiên có mục tiêu,
`p<NN>-blind` cho phiên mù. `NN` **là số persona ở bảng trên** và mã phiên phải duy nhất trong
cả lần chạy — một persona chạy 3 phiên thì được 3 mã khác nhau (`p01-RR-04`, `p01-RR-05`,
`p01-blind`), không phải 3 lần cùng một mã. Phiên chạy lại lấy mã mới.
