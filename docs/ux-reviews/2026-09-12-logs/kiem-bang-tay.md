# Kiểm bằng tay — KHÔNG PHẢI PHIÊN PERSONA

Người điều phối tự lái playwright, ngày 2026-09-12, trên
`https://levananhduc.github.io/web-game-duck-stack/` (deploy của commit `8dbd9b0`).

**Vì sao có file này:** ba route `live` không có persona nào phủ — RR-01/RR-02 (phiên `p02`
chết giữa đường), RR-06, RR-09, RR-10. Thay vì để trống, tôi kiểm **các sự thật quan sát
được** của chúng.

**Giới hạn phải nhớ, và nó lớn:** cái này trả lời *"sản phẩm có làm đúng không"*. Nó **không**
trả lời *"một người lạ có mò ra không"* — thứ duy nhất mà một phiên persona trả lời được. Tôi
đã biết trước nút nào ở đâu, nên tôi **không phải** người mới tinh và không đo được gì về việc
tự học. Mọi thứ dưới đây là **số đo**, không phải trải nghiệm, và không được trích như lời
persona.

---

## 1. NFR-A11Y-03 — vùng bấm ≥ 44×44px trên cảm ứng · ✅ ĐẠT

`nfr.md:67` đặt ngưỡng này với cách kiểm là **"review mockup"** — tức là chưa ai đo trên bản
chạy thật. Đây là số đo đầu tiên.

Viewport `375×667`, đo bằng `getBoundingClientRect()` trên mọi `button`, `input`,
`[role="switch"]` đang hiện:

| Chỗ đo | Số phần tử | Dưới 44px | Kết quả |
| --- | --- | --- | --- |
| Màn chơi (thanh trên + touchband) | 11 | **0** | đạt |
| Màn `Cài đặt` mở ra | 24 | **0** | đạt |

`document.documentElement.scrollWidth === 375` ở cả hai trạng thái → **không có cuộn ngang**,
đúng yêu cầu. Overlay của dialog khít đúng `375×667`, không tràn viewport.

Đây là kết quả **dương tính** và nên được ghi vào `nfr.md` như một lần đo thật, thay cho
"review mockup".

## 2. RR-06 — chuỗi hiển thị khi đổi sang tiếng Việt · ✅ SẠCH

Đổi sang `VI`, rồi đối chiếu `document.body.innerText` với **31 chuỗi UI** lấy từ `en.json`
(`Difficulty`, `Handling`, `Keys`, `Display`, `Sound effects`, `Volume`, `Language`, `Done`,
`Reset to defaults`, `Landing hint`, `Distinguish without colour`, `Smooth sideways motion`,
`Fall speed`, `High scores`, `Paused`, `Game over`, `Play again`, `Restart`, `Resume`, `Score`,
`Lines`, `Level`, `Hold`, `Next`, `Move`, `Soft drop`, `Hard drop`, `Rotate`, `Pause`,
`Display name`, `Close settings`):

```
chuoiAnhConSot: []
```

**Không sót chuỗi nào.** Giao diện hiện `ĐIỂM · CẤP ĐỘ · GIỮ · KẾ TIẾP · CÀI ĐẶT · ĐỘ KHÓ ·
ĐIỀU KHIỂN · PHÍM · Sang trái · Xong`. `NFR-I18N-01` và bất biến #10 giữ được.

**Phần tiếng Anh còn lại là tên phím, không phải chuỗi giao diện:** `Left`, `Right`, `Down`,
`Space`, `Z`, `X / Up`, `Escape / P`. Chúng suy ra từ `KeyboardEvent.code`, tức là **tên in
trên bàn phím vật lý** — bàn phím không dịch theo locale. **Đây không phải lỗi, và tôi không
biến nó thành phát hiện.** Ghi ra để lần sau không ai "sửa" nó.

## 3. F1 — xác nhận bằng số đo, không qua persona

Bấm `Xong` để đóng `Cài đặt`, rồi đọc DOM:

```
overlay: "Đang tạm dừng"
```

Hộp tạm dừng **vẫn còn đó** sau khi đóng cài đặt. Đây là xác nhận thứ ba, độc lập với hai
persona đã vấp (p01 2 lần, p03 1 lần, p05 1 lần bị hộp này chắn mất nút ở thanh trên).

## 4. Phát hiện MỚI từ bước kiểm này: khổ điện thoại **không hiện số hàng đã xoá**

Ở viewport `375×667`:

```
topbar: "ĐIỂM | 0 | CẤP ĐỘ | 1 | VI"
.topbar__stack  →  ĐIỂM   display: flex   w: 48
.topbar__stack  →  Số hàng display: none  w: 0     ← bị ẩn
.topbar__stack  →  CẤP ĐỘ display: flex   w: 47
```

`Số hàng` (Lines) bị `display: none` ở khổ nhỏ, trong khi `Điểm` và `Cấp độ` vẫn hiện.

**Vì sao đây là chuyện đáng nói, không phải chuyện thẩm mỹ:**

- `journeys.md` US-01 bước 4 hứa nguyên văn: *"hàng biến mất, điểm và **số hàng** tăng"*. Trên
  điện thoại lời hứa đó không được giữ.
- `red-routes.md` RR-01 định nghĩa `done_when` bằng **chính ô Lines** ("ô Lines chuyển từ 0 lên
  ≥ 1"). Ở khổ điện thoại, cái thước đó không tồn tại trên màn hình.
- Số hàng là thước tiến bộ chính của chế độ Marathon — `Cấp độ` suy ra **từ** nó. Giữ hệ quả
  mà ẩn nguyên nhân là ngược.

Ảnh: `kiem-tay-01-mobile-375-thieu-so-hang.png`

**Xếp loại:** đây là **số đo**, không có persona nào vấp (phiên `p04` chết trước khi tới). Theo
`lib/frameworks.md` §Luật chống bịa thì nó **không đủ điều kiện thành một "phát hiện" của báo
cáo persona**. Nó đi vào `backlog.md` §Việc tiếp theo với nhãn đúng của nó: một lỗi tìm ra bằng
đo, chờ một phiên persona mobile xác nhận mức độ khó chịu thật.

## 5. Chưa kiểm được

| Route | Vì sao |
| --- | --- |
| RR-01 / RR-02 | Cần chơi tới lúc chồng khối tới nóc. Kiểm bằng tay được, nhưng câu hỏi thật của RR-01 là *"người chưa từng chơi có tự học được từ thanh gợi ý phím không"* — **chỉ persona trả lời được**, nên kiểm tay ở đây gần như vô giá trị |
| RR-09 | Nửa "44×44px" đã kiểm ở mục 1 và đạt. Nửa "nút che mất bàn chơi khi chơi bằng một ngón cái" cần một người thật chạm, không đo được |
| RR-10 | Cần bảng điểm có dữ liệu; `localStorage` vừa bị xoá giữa các phiên. Bỏ qua lần này |
