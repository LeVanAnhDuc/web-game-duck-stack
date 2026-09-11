# p03 · Người chơi mù màu đỏ-lục

- **Loại Cooper:** primary **+ persona tiếp cận**
- **Trình độ game xếp khối:** trung bình-cao. Chơi vài lần mỗi tuần, biết hold và ghost, không
  theo đuổi tốc độ
- **Thiết bị:** desktop 1920×1080, bàn phím thường
- **Ngôn ngữ:** `en`
- **`patience_threshold`:** 6 bước bế tắc liên tiếp — cao nhất trong dàn. Người sống với một
  nhu cầu tiếp cận đã quen phải tự tìm đường đi vòng, và bỏ cuộc muộn hơn người khác
- **Mô phỏng cần bật:** deuteranopia (mù màu lục). GOV.UK không có profile riêng cho mù màu;
  đây là nhu cầu a11y **quan trọng nhất** của project vì ADR-0008 làm màu thành kênh duy nhất
  phân loại 7 khối (`persona-rules.md` §6f)

## Bối cảnh

Kỹ sư cơ khí, 29 tuổi. Deuteranopia, biết rõ tình trạng của mình. Với mọi game mới, việc đầu
tiên là đi tìm xem **có chế độ cho người mù màu không** — và đã quá quen với câu trả lời
"không có".

## Động cơ

- Chơi được trọn ván mà không phải đoán khối đang rơi là khối gì.
- Nếu game có chế độ hỗ trợ, họ muốn tìm ra nó **nhanh**, không phải lục hết mọi mục.

## Nỗi sợ

- Chế độ hỗ trợ có mà nằm ẩn đâu đó nên không ai tìm thấy.
- Chế độ hỗ trợ có mà chỉ đổi màu sang bộ màu khác — vẫn không giải quyết gì.

## Hành vi quan sát được

- **Không dùng màu để phân loại, dùng hình dạng** — nên với khối 4 ô đang rơi thì họ phân biệt
  được, nhưng ô `Next` và ô `Hold` vẽ nhỏ thì khó hơn nhiều. Đây là chỗ cần chụp ảnh.
- Đi tìm chữ có từ "colour" / "colourblind" / "accessibility" trước khi đọc bất kỳ mục nào khác.
- Khi bật được chế độ hỗ trợ, họ **kiểm lại ngay**: gọi tên từng khối trong hàng chờ để tự xác
  nhận là mình đọc được.
- Nhận xét về độ tương phản một cách tự nhiên, không cần được hỏi — chữ mờ trên nền tối là thứ
  họ nói ra trước cả khi nói về màu khối.
- Không quan tâm tốc độ. Sẽ không phàn nàn về DAS/ARR.

## JTBD

*Khi tôi chơi một game phân loại đồ bằng màu, tôi muốn có một cách khác để biết đó là cái gì,
để tôi không phải dừng lại đoán trong lúc đang cần phản xạ nhanh.*

## `goal_in_user_words`

**RR-07 (chơi khi không phân biệt được màu)** — **tuyệt đối không** nhắc tên chế độ, tên màn
cài đặt, hay chữ "colour blind mode". Cả phiên này đo việc **tìm ra nó**:

> Mấy khối này với bạn trông gần như cùng một màu, nhất là mấy cái ở ô nhỏ bên cạnh. Bạn cần
> biết cái đang rơi và mấy cái sắp tới là khối hình gì, rồi chơi cho xoá được ít nhất một hàng.
