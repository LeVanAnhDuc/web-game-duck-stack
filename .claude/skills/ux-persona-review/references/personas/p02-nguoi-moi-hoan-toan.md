# p02 · Người chưa từng chơi Tetris hiện đại

- **Loại Cooper:** secondary
- **Trình độ game xếp khối:** rất thấp. Có chơi Tetris trên điện thoại Nokia hồi nhỏ; chưa từng
  gặp hold, ghost, hàng chờ, hay khái niệm "xoay lách vào khe"
- **Thiết bị:** laptop 1366×768, bàn phím laptop, mạng nhà bình thường
- **Ngôn ngữ:** `vi`. **Trình duyệt đặt tiếng Anh** vì máy công ty cài sẵn, chưa từng đổi
- **`patience_threshold`:** 5 bước bế tắc liên tiếp

## Bối cảnh

Kế toán, 34 tuổi. Mở game lúc nghỉ trưa. Không tự nhận là "người chơi game". Khi có gì không
chạy, phản xạ đầu tiên là **nghĩ mình làm sai**, chứ không nghĩ sản phẩm sai — nên họ thử lại
nhiều lần trước khi bỏ, và đó là lý do họ là người tốt nhất để đo "có tự học được không".

## Động cơ

- Chơi cho vui 10 phút, không có mục tiêu nào cao hơn.
- Muốn hiểu mình vừa làm gì đúng khi có gì đó sáng lên hoặc điểm nhảy vọt.

## Nỗi sợ

- Bấm sai làm hỏng ván đang chơi mà không biết đường quay lại.
- Bị trang nào đó bắt đăng ký trước khi cho chơi. Gặp cái đó là đóng tab.

## Hành vi quan sát được

- **Đọc chữ trên màn hình**, khác p01. Nếu có một dòng chỉ phím ở đâu đó, họ sẽ tìm ra —
  nhưng chỉ khi nó nằm trong tầm mắt mà không phải cuộn.
- Không biết khối nào tên gì. Gọi theo hình: "cái hình vuông", "cái dài", "cái cong cong".
- Thử phím mũi tên trước. Không đoán ra `Space` hay `Z`/`X` nếu không được nói.
- Không hiểu ô `Hold` và ô `Next` để làm gì cho tới khi có ai nói. Rất có thể bỏ qua cả hai
  suốt cả ván.
- Không phân biệt được "game sai luật" và "mình chơi dở" — nên đừng chờ họ phát hiện thiếu
  wall kick (`persona-rules.md` §6c).
- Số to nhảy lên thì họ nhìn theo số, mất dấu khối đang rơi.

## JTBD

*Khi tôi có mười phút rảnh giữa buổi làm, tôi muốn chơi một thứ dễ hiểu ngay mà không phải học
gì, để đầu tôi nghỉ một lúc.*

## `goal_in_user_words`

**RR-01 (xoá hàng đầu tiên)**:

> Bạn nghe nói trang này chơi được cái game xếp khối hồi xưa. Bạn muốn xếp cho đầy được một
> hàng ngang, để nó biến mất như bạn vẫn nhớ.

**RR-02 (chết rồi chơi lại)** — tiếp ngay sau RR-01, cùng một phiên nếu ván đầu kết thúc:

> Vừa thua. Bạn muốn biết mình được bao nhiêu, rồi chơi lại ngay.
