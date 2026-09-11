# p01 — phiên `p01-blind` + `p01-RR-04` + `p01-RR-05`

> Log thô, nguyên văn lời persona kể lại. Chạy tuần tự, một mình, sau khi người điều phối
> đã `localStorage.clear()`. Công cụ: playwright. Viewport 1920×1080.

## 1. Ấn tượng 5 giây

- **Đây là trang gì? Làm được gì cho tôi?** Một game Tetris tên "Duck Stack", vào là chơi luôn, không cần đăng nhập. Có Score/Lines/Level, có PPS, có Hold và Next — giống mấy site tôi hay vào.
- **Dành cho ai?** Thấy PPS + Hold + Next queue kiểu tetr.io, tôi đoán nó nhắm tới người biết luật, không chỉ trẻ con chơi cho vui.
- **Có tin để nhập email/sđt không?** Không thấy chỗ nào đòi nhập gì cả, nên chưa phải nghĩ tới chuyện đó.
- **Ba từ:** quen mắt, gọn, hơi bất ngờ (đồng hồ đã chạy 00:06 dù tôi chưa bấm gì).

## 2. Chuyện đã xảy ra

### Việc 1 — `p01-blind`

Tôi thấy: trang mở ra là vào thẳng ván chơi, đồng hồ 00:06 chạy sẵn, header có Score/Lines/Level, hai bên là Hold và Next, footer ghi sẵn chú thích phím (Move/Soft drop/Space=Hard drop/Z-X=Rotate/Shift=Hold/Esc=Pause).

Tôi tưởng: đây là kiểu web-tetris tự bắt đầu ngay, không có màn "Start".

Tôi làm: bấm ArrowRight 4 lần đẩy khối sang phải, bấm X để xoay (test wall kick), bấm Shift để hold, rồi bấm Shift lần 2 ngay sau đó (test luật hold-một-lần-mỗi-khối).

Rồi sao: đây là chỗ tôi bị giới hạn bởi chính công cụ — mỗi lệnh của tôi cách nhau vài giây thật, nên tôi không dựng được thế cụ thể để nhìn bằng mắt xem xoay sát tường có kick đúng luật không, và playfield được vẽ bằng canvas nên snapshot text không cho tôi thấy vị trí khối, chỉ thấy Score/Lines/PPS thay đổi (PPS đi từ 0.00 → 0.04 → 0.05, Score/Lines vẫn 0). Tôi không xác nhận được rõ ràng luật xoay-lách-tường hay luật hold có đúng chuẩn không — **đây là tôi thiếu dữ liệu để kiểm, không phải tôi kết luận trang sai.**

Sau đó tôi đi tìm cài đặt bằng biểu tượng như thói quen: quét góc trên phải, thấy ngay 3 icon — High scores, Settings (bánh răng), Language (EN). Không phải đọc chữ gì cả.

### Việc 2 — `p01-RR-04` (đổi phím thả khối)

- Mở Settings (bấm bánh răng) → cuộn tới mục "Keys" → dòng "Hard drop" đang gán "Space".
- Bấm nút "Rebind Hard drop" → nút đổi chữ thành "Press a key…".
- Tôi bấm `Enter` (phím tôi chọn) → nút đổi ngay thành "Enter", **và** thanh chú thích phím ở footer dưới cùng cũng tự cập nhật theo cùng lúc, không cần reload.
- Bấm "Done" để đóng Settings.
- **Bất ngờ:** đóng xong không quay lại ván chơi mà bật ra khung "Paused" (Resume / Settings / High scores / Restart) — **tôi không hề bấm pause.** Rõ ràng mở Settings tự pause game, và "Done" không tự resume.
- Bấm "Resume" để quay lại ván chơi, rồi bấm `Enter` để kiểm — Score nhảy từ 0 lên 10 ngay lập tức, tức là khối vừa bị thả cứng xuống đáy đúng như tôi muốn.

**Đếm bước** (từ lúc quyết định đổi phím tới lúc phím mới chạy được): **6 bước** — (1) mở Settings, (2) bấm "Rebind Hard drop", (3) bấm Enter để gán, (4) bấm "Done", (5) bấm "Resume" (vì bị đẩy vào màn Paused ngoài ý muốn), (6) bấm Enter trong ván để xác nhận nó thả khối.

### Việc 3 — `p01-RR-05` (chỉnh DAS/ARR)

- Mở lại Settings, mục "Handling" hiện: DAS = "8 ticks before auto-repeat", ARR = "2 ticks between repeats".
- Đây là chỗ tôi khựng lại đúng như tôi sợ: **tôi nghĩ bằng mili giây (quen DAS ~80ms, ARR 0ms ở tetr.io/jstris), nhưng ở đây đơn vị là "ticks", không có số ms đi kèm ở bất kỳ đâu — không tooltip, không chữ nhỏ, không nút đổi đơn vị.**
- Tôi bấm vào từng slider (DAS rồi ARR), dùng phím `Home` để đẩy về mức nhỏ nhất — cả hai về "0 ticks". Đó là sàn của thanh trượt.
- Đóng Settings ("Done") → **lại bị đẩy vào "Paused" y như lần trước** → bấm "Resume" → thử `ArrowLeft`.
- Vì mỗi lệnh của tôi cách nhau vài giây thật, tôi **không kịp** cảm nhận việc di chuyển ngang có "nhạy" hay không qua cách thao tác này — đây là giới hạn công cụ, tôi không kết luận gì về cảm giác điều khiển thật.

**Trả lời câu hỏi của việc 3:** Tôi đặt được hai số về mức thấp nhất mà thanh trượt cho phép (0/0), nhưng không đặt được "đúng mức tôi muốn" theo nghĩa chính xác — **vì tôi không biết 0 tick tương đương bao nhiêu mili giây. Tôi bị chặn ở chỗ thiếu quy đổi đơn vị**, không phải chặn ở giới hạn số của slider.

## 3. Con số

- Số hành động điều hướng (không tính phím điều khiển khối): khoảng 25.
- **Số lần phải quay lui: 2 lần — cả hai lần đóng Settings đều bị đẩy vào màn "Paused" ngoài dự tính, phải bấm Resume để quay lại ván chơi.**
- Số lần bấm vào chỗ không có phản hồi: 0 — mọi lần bấm đều có phản hồi rõ (kể cả cái Paused ngoài ý muốn, chỉ là không phải cái tôi mong).
- Kết quả: xong cả 3 việc, không bỏ cuộc.
- Thời lượng: không đo được bằng đồng hồ thật (công cụ có độ trễ mỗi lệnh vài giây), đồng hồ trong game chạy tới khoảng 01:45 lúc hoàn thành Việc 3.

## 4. Ba từ sau khi dùng

**Quen thuộc, hụt một nhịp, tạm ổn.**

So với ba từ ban đầu (quen mắt, gọn, hơi bất ngờ): phần "quen mắt/gọn" được củng cố thêm ở việc rebind phím — mượt, phản hồi tức thì, tự cập nhật cả footer. Nhưng "hơi bất ngờ" ban đầu (đồng hồ tự chạy) biến thành "hụt một nhịp" cụ thể hơn: bị đẩy vào Paused ngoài ý muốn 2 lần, và nhất là DAS/ARR chỉ có "ticks" chứ không quy đổi ra ms — đúng cái tôi sợ nhất khi mở một bản clone lạ.

Tôi có quay lại không? **Có, nhưng có điều kiện.** Phần bind phím đủ tốt để tôi chơi ngay được. Nhưng nếu phải chỉnh handling khớp tuyệt đối với con số tôi quen dùng ở tetr.io, tôi sẽ ngần ngại vì không có gì để đối chiếu — trừ khi tự tìm được đâu đó 1 tick = bao nhiêu ms.

## 5. Đính kèm thô

- `anh-tho/p01-blind-01-vua-mo-trang.png` — lúc vừa mở trang
- `anh-tho/p01-blind-02-truoc-khi-choi.png`
- `anh-tho/p01-blind-03-thu-di-chuyen-xoay.png`
- `anh-tho/p01-blind-04-test-hold-lan-2.png`
- `anh-tho/p01-RR-04-01-mo-cai-dat.png`
- `anh-tho/p01-RR-04-02-da-doi-thanh-enter.png`
- `anh-tho/p01-RR-04-03-paused-bat-ngo.png` — **chỗ bị kẹt: Paused hiện ra ngoài ý muốn**
- `anh-tho/p01-RR-05-01-das-arr-ve-0-tick.png`
- `anh-tho/p01-RR-05-02-thu-di-ngang.png`
- `anh-tho/p01-RR-05-03-anh-cuoi.png`

Console log (gọi 1 lần cuối phiên):

```
Total messages: 0 (Errors: 0, Warnings: 0)
```
