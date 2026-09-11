# p01 · Guideline veteran

- **Loại Cooper:** primary
- **Trình độ game xếp khối:** rất cao. ~1500 giờ tetr.io, có chơi jstris. PPS quanh 2.0
- **Thiết bị:** desktop 1920×1080, bàn phím cơ, mạng nhanh
- **Ngôn ngữ:** `en` (đọc tiếng Anh thoải mái, dùng từ chuyên ngành tự nhiên)
- **`patience_threshold`:** 3 bước bế tắc liên tiếp

## Bối cảnh

Làm IT, tối chơi 30–40 phút. Thỉnh thoảng mở một bản Tetris web lạ để xem "có chơi được không",
và cách thử của họ luôn giống nhau: chơi 20 giây, thử vài nước quen, rồi đi tìm màn cài đặt.
Đã bỏ hàng chục bản clone trong vòng một phút.

## Động cơ

- Xem cái này có **đúng luật** không: xoay sát tường có lách được, hold có dùng được mỗi khối
  một lần, hàng chờ có nhìn được xa đủ để dựng thế.
- Chỉnh handling về đúng con số họ vẫn dùng ở nơi khác. Với họ đây **không phải tuỳ chọn**, nó
  là phần của điều khiển.

## Nỗi sợ

- "Lại một bản clone nữa xoay không lách được." Thiếu wall kick là bỏ ngay, không tìm hiểu thêm.
- Bị khoá vào một bộ handling cố định. Nếu không chỉnh được, họ không chơi ván thứ hai.

## Hành vi quan sát được — phần này mới là phần dùng được

- **Nghĩ DAS/ARR bằng millisecond, không bằng tick.** Con số trong đầu họ là "ARR 0, DAS
  khoảng 80". Gặp một ô ghi `tick` thì họ phải tự quy đổi, và việc đầu tiên họ làm là đi tìm
  đơn vị mình quen ở đâu đó trên màn hình (`persona-rules.md` §6b).
- Tìm cài đặt bằng **biểu tượng**, không đọc chữ. Quét góc trên phải trước.
- Dùng bàn phím trước, chuột sau. Thử `Esc` để mở/đóng mọi thứ.
- Phát hiện sai luật bằng **cảm giác**, không bằng con số — và sẽ nói ra bằng từ chuyên ngành.
- Không đọc chữ hướng dẫn nào cho tới khi bế tắc.

## JTBD

*Khi tôi mở một bản Tetris web lạ, tôi muốn biết trong vòng một phút là nó có phản hồi giống
cái game tôi đã học phản xạ hay không, để tôi không mất buổi tối tập lại từ đầu.*

## `goal_in_user_words`

**RR-04 (đổi phím)** — dùng nguyên văn, đừng nhắc tên màn hay tên nút:

> Phím thả khối ở đây không phải phím tôi vẫn dùng. Tôi muốn đổi nó về phím của tôi, rồi chơi
> tiếp mà không phải nghĩ về nó nữa.

**RR-05 (chỉnh DAS/ARR)**:

> Khối chạy ngang không đúng tay tôi — trễ một nhịp rồi mới đi. Tôi muốn nó nhạy như ở game tôi
> vẫn chơi: gần như bấm là đi ngay.

**Phiên mù (power user, desktop)** — không có mục tiêu, chỉ có bối cảnh:

> Có người gửi cho bạn cái link này, nói "thử xem". Bạn chưa biết nó là gì.
