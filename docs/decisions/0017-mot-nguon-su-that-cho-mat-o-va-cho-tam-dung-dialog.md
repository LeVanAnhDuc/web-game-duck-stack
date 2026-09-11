# ADR-0017 · Một nguồn sự thật cho "mặt ô" và cho việc tạm dừng khi mở dialog

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** FR-04 · FR-05 · FR-13 · FR-23 · FR-24 · FR-26 · NFR-A11Y-06 · ADR-0009 ·
> ADR-0012 · ADR-0016

## 1. Bối cảnh

Lần chạy `ux-persona-review` đầu tiên (2026-09-12, ADR-0016) tìm ra hai lỗi **cùng một dạng**:
hai chỗ trong code trả lời cùng một câu hỏi, độc lập với nhau, và đã lệch nhau mà không công cụ
nào phát hiện được.

**Chỗ thứ nhất — mặt của một ô khối.** `buildSprites` (canvas) làm xám ô và dán chữ khi bật chế
độ không dựa vào màu. `PiecePreview` (DOM — ô `Hold` và hàng chờ `Next`) đọc `PIECE_COLORS`
trực tiếp và không dán gì. Bật chế độ hỗ trợ xong thì hàng chờ vẫn **y nguyên như chưa bật**.

Đây không phải chuyện nhất quán thị giác. `MASTER.md` §2 **đã đo** tương phản từng cặp khối và
viết thẳng: T vs Z là **1.20:1**, và *"for a player who cannot separate T from Z, a 1.20 ratio
means those two pieces are the same piece"* — chính là lý do có `FR-26`/`NFR-A11Y-06`. Thêm nữa,
câu gợi ý của chính cái công tắc đó hứa *"Marks each piece with its letter"* (tiếng Việt: *"Ghi
ký tự lên từng khối"*). Lời hứa bị phá ở đúng chỗ quan trọng nhất: hàng chờ là nơi duy nhất
trong Tetris mà biết trước khối là toàn bộ giá trị.

Và nó còn tạo ra một hệ quả ngược: bàn chơi thành xám, hai rail vẫn còn màu, nên chế độ hỗ trợ
**đảo ngược** signature element ở `MASTER.md` §1 ("colour exists only inside the board") — màu
chỉ còn tồn tại **ngoài** bàn.

**Chỗ thứ hai — ai tạm dừng thì ai bỏ tạm dừng.** `openSettings`/`openScores` có điều kiện
`phase !== 'paused' && phase !== 'gameOver'` rồi mới `press('pause')`. Đường đóng thì chỉ
`setSettingsOpen(false)` — **không có điều kiện nào cả**. Nên người mở cài đặt từ thanh trên
giữa ván bị đẩy vào hộp `Paused` họ không hề yêu cầu.

Ba persona vấp trong một lần chạy: p01 hai lần (và đếm được **6 bước** cho việc đổi phím, so với
`min_steps: 4` của RR-04), p03 một lần, p05 một lần bị hộp đó chắn mất nút ở thanh trên. Người
điều phối xác nhận lại bằng số đo: sau khi bấm `Xong`, `document.querySelector('.overlay')` vẫn
trả về hộp tạm dừng.

**Điểm chung của cả hai:** không có gì trong hệ thống kiểu buộc hai nửa phải khớp, và 222 test
cùng `tsc` đều xanh trong suốt thời gian chúng lệch nhau.

## 2. Quyết định

**Gom mỗi cặp về một hàm thuần duy nhất, và cho cả hai phía đọc nó.**

- `cellFace(kind, colorBlind): { fill, letter }` trong `render/sprites.ts` là nơi **duy nhất**
  quyết định một ô được vẽ thế nào. `buildSprites` đọc nó; `PiecePreview` đọc nó. `CB_FILL` và
  `CB_LETTER` được export để không ai viết lại hằng màu lần thứ hai.
- `shouldAutoPause(phase)` trong `views/Play/dialogPause.ts` trả lời **cả hai** chiều: mở có phải
  tạm dừng không, và do đó đóng có phải tiếp tục không. `closeDialog` chỉ bỏ **đúng** cái tạm
  dừng mà việc mở đã gây ra — người tự bấm tạm dừng rồi vào cài đặt từ hộp đó thì vẫn được trả
  về hộp tạm dừng, vì đó là trạng thái họ chọn.

`colorBlind` được **truyền vào** `PiecePreview` qua prop, không đọc từ context bên trong: tầng
renderer của bàn chơi cũng được *bảo* theo cách đó (`setOptions`), nên hai phía nhận thiết lập
giống nhau và component giữ nguyên tính trình bày thuần.

**Phụ:** gợi ý DAS/ARR hiện thêm millisecond cạnh tick (`ticksToMs`, `TICK_HZ = 60`), tick giữ
vị trí dẫn vì tick là thứ được lưu và là thứ engine đếm (bất biến #4).

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Dán chữ cho preview bằng code riêng trong `PiecePreview` | Đây **chính là** nguyên nhân của lỗi: hai hiện thực cho một câu hỏi. Sửa bằng cách thêm hiện thực thứ hai là bảo đảm sẽ lệch lần nữa |
| Vẽ preview bằng canvas luôn cho dùng chung `buildSprites` | ADR-0012 đặt preview ở DOM có lý do: chúng đổi một lần mỗi khối, không phải mỗi frame. Đổi sang canvas là đánh đổi kiến trúc để lấy một sự nhất quán mà một hàm thuần đã giải quyết xong |
| Đổi `PIECE_COLORS` thành bộ màu thân thiện mù màu, bỏ chế độ chữ | `MASTER.md` §2 đã đo và kết luận **không thể**: bảy hue trên một nền tối không thể đôi một phân biệt, và thứ tự hue là quy ước của Tetris, không phải lựa chọn của dự án |
| Cho `closeDialog` luôn `press('pause')` để tiếp tục | Sai với người tự tạm dừng trước rồi mới mở cài đặt — họ sẽ bị **bỏ** tạm dừng ngoài ý muốn. Đó là đổi một hướng của lỗi thành hướng ngược lại |
| Đừng tạm dừng khi mở dialog nữa, thì không phải bỏ tạm dừng | Đọc thanh trượt trong lúc khối đang rơi là bẫy — chính lý do việc tạm dừng tồn tại. Cái thiếu là **chuyến về**, không phải chuyến đi |
| Đổi hẳn đơn vị DAS/ARR sang millisecond | Engine đếm bằng tick nguyên (bất biến #4). Hiện bằng ms thì bước trượt thành không đều và số lưu không còn là số hiện — đắt hơn hẳn việc hiện cả hai |
| Thêm `@testing-library` để test `PiecePreview` render thật | Là một quyết định về hạ tầng test, đã cố ý hoãn trong `backlog.md`. Trộn nó vào đây là trộn hai việc trong một PR. Hai hàm thuần ở trên test được ở môi trường `node`, không thêm dependency nào |

## 4. Hệ quả

**Được:**

- `NFR-A11Y-06` lần đầu đúng trên **toàn bộ** bề mặt hiển thị khối, không chỉ bàn chơi.
- Hai bất biến vốn chỉ tồn tại trong đầu người viết giờ là **test chạy trong CI**: một fill và
  một chữ cho mỗi kind, dùng chung bởi cả hai bề mặt; một predicate cho cả hai chiều tạm dừng.
- Lỗi lệch canvas/DOM kiểu này về sau sẽ vỡ ở `cellFace`, tức là vỡ ở một chỗ có test.

**Mất / phải chấp nhận:**

- `PiecePreview` giờ có một prop nữa, và `Queue` phải chuyển tiếp nó. Ba call site trong
  `views/Play/index.tsx` phải truyền `settings.colorBlindMode`. Quên một chỗ thì chỗ đó lặng lẽ
  quay về chế độ màu — **không** có test nào bắt được, vì vẫn không có test render.
- Chữ trong hàng chờ ở khổ điện thoại vẽ ở **7px** (sàn của `Math.max(7, cell * 0.6)` với
  `cell = 9`). Đọc được khi nhìn kỹ, nhưng đây là chữ nhỏ nhất trong sản phẩm và nó **không**
  thoả ngưỡng chữ thường của `NFR-A11Y-01` nếu coi nó là chữ. Coi nó là **nhãn trên một đối
  tượng đồ hoạ** thì hợp hơn — và nếu sau này có người chơi báo không đọc được, cách sửa là
  tăng `cell` của hàng chờ ở khổ nhỏ, không phải tăng cỡ chữ trong ô.
- Lần chạy persona này **không** phủ RR-01/RR-02 (phiên chết giữa đường) và RR-09/RR-10, nên ba
  fix ở đây được xác nhận bởi 3 persona, không phải 6.

**Điều kiện xem lại quyết định này:** khi repo có test render cho tầng view — lúc đó prop
`colorBlind` nên được khoá bằng một test render thật, và `closeDialog` nên có test hành vi thay
vì chỉ test predicate.
