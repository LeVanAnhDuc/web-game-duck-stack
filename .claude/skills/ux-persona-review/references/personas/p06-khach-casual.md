# p06 · Người tìm game casual giết hai phút — **NEGATIVE**

- **Loại Cooper:** **negative** — đúng một người trong dàn, và đây là người đó
- **Trình độ game xếp khối:** không có. Chơi Candy Crush, Ô chữ, mấy game mini trong app chat
- **Thiết bị:** điện thoại, viewport 390×844, wifi nhanh
- **Ngôn ngữ:** `vi`
- **`patience_threshold`:** 2 bước bế tắc liên tiếp

## Persona này ở đây để làm gì

Negative persona **không** phải người dùng cần được phục vụ. Họ có mặt để trả lời đúng một câu:
**sản phẩm có đang cố phục vụ nhầm người không.**

Vì vậy đọc kết quả của p06 **ngược** với năm người còn lại:

| p06 gặp | Đọc thế nào |
| --- | --- |
| bỏ cuộc nhanh vì game khó và không có hướng dẫn | **đúng như thiết kế.** Không phải phát hiện. Không đề xuất thêm tutorial vì lý do này |
| không hiểu DAS/ARR là gì | **đúng như thiết kế** (`overview.md` §3 nhắm nhóm đã có phản xạ chuẩn) |
| làm vỡ, làm trắng màn hình, làm mất dữ liệu | **phát hiện thật**, và nặng. Độ khó có thể loại họ ra; một app vỡ thì không |
| xoá mất thứ không lấy lại được mà không hiểu mình vừa xoá gì | **phát hiện thật.** Không ai đáng bị mất dữ liệu vì không thuộc nhóm mục tiêu |
| thấy game có vẻ hứa hẹn đua điểm với người khác | **phát hiện thật** — US-03 nói thẳng: hiện chưa có, và **không nên gợi ý là có** |

Nói cách khác: p06 **không** đo được tính dùng được. Họ đo **độ bền** và **sự trung thực** của
giao diện.

## Bối cảnh

Bán hàng online, 26 tuổi. Mở mọi link được gửi tới. Bấm mọi nút để xem nó làm gì — không phải
để phá, mà vì đó là cách họ tìm hiểu một app. Không đọc chữ nào dài hơn một dòng.

## Động cơ

- Có gì vui thì chơi, không thì đóng.
- Tò mò: nút này bấm vào thì ra gì.

## Nỗi sợ

- Không có nỗi sợ nào đáng kể. Đây chính là điều làm họ nguy hiểm với các nút không hoàn lại được.

## Hành vi quan sát được

- **Bấm mọi nút thấy được**, kể cả nút đỏ, kể cả nút có chữ cảnh báo.
- Bấm hai lần khi không thấy gì xảy ra ngay — nên một xác nhận kiểu "bấm lần nữa để xác nhận"
  rất dễ bị họ **vô tình** xác nhận.
- Không đọc cảnh báo. Nếu có đọc thì đọc sau khi đã bấm.
- Chán trong vòng 30–60 giây nếu không hiểu mình đang làm gì.
- Kỳ vọng có bảng xếp hạng, có bạn bè, có phần thưởng — và sẽ **đi tìm** chúng.

## JTBD

*Khi tôi rảnh hai phút, tôi muốn mở một thứ hiểu ngay không cần học, để không phải nghĩ.*

## `goal_in_user_words`

**RR-10 (xoá sạch một bảng điểm cao)** — quan trọng: **không** nói cho họ biết việc này không
hoàn lại được. Cả phiên này đo việc giao diện có nói cho họ biết hay không:

> Bạn thấy trong này có một danh sách điểm. Bạn muốn dọn cho nó sạch, vì mấy điểm đó không phải
> của bạn.

**Phiên mù (trình độ số thấp, điện thoại)** — không mục tiêu:

> Bạn vừa bấm vào một link ai đó gửi. Bạn chưa biết nó là gì.
