# Duck Stack — UX persona review · 2026-09-12

> 3 phiên hợp lệ (`p01-blind` + `p01-RR-04` + `p01-RR-05` · `p03-RR-07` · `p05-RR-03` +
> `p05-RR-08`) · 3 persona · **5/10 Red Route `live`** được phủ
> Công cụ: **playwright** (hạng 1) — **degrade đã công bố: không có throttle mạng**, nên không
> một nhận định nào về tốc độ tải xuất hiện trong báo cáo này
> Bản được thử: **deploy production** <https://levananhduc.github.io/web-game-duck-stack/>,
> commit `8dbd9b0` = `origin/main` HEAD
> Red route chốt theo `red-routes.md` · Token đối chiếu: `docs/design-system/tetris/MASTER.md`
> §1, §2 · Lần chạy đầu tiên sau ADR-0016

**Phạm vi đã mất, nói trước mọi thứ khác:** 3/6 persona không có log dùng được — p02 hết hạn
mức API, còn p01/p02/p03/p04/p05 lần 1 bị huỷ vì nhiễm chéo (xem `2026-09-12-logs/00-dieu-phoi-va-hai-loi.md`).
Hệ quả nặng nhất: **RR-01 và RR-02 không có persona nào phủ**, mà RR-01 là route `red-routes.md`
gọi là *"đây là toàn bộ sản phẩm"*. Báo cáo này **không** trả lời được câu *"người chưa từng chơi
có tự mò ra cách chơi từ thanh gợi ý phím không"*.

## Trạng thái xử lý

| ID | Mức | Tóm tắt | Trạng thái |
| --- | --- | --- | --- |
| **F3** | **Critical** | Chế độ không-dùng-màu không phủ ô `Hold` và hàng chờ `Next` | ✅ **đã fix** — `cellFace`, ADR-0017 |
| **F1** | **High** | Bấm `Done` đóng cài đặt lại đẩy vào hộp `Paused`, không về ván | ✅ **đã fix** — `shouldAutoPause`, ADR-0017 |
| **F2** | **High** | DAS/ARR chỉ có đơn vị `tick`, không có ms để đối chiếu | ✅ **đã fix** — `ticksToMs` |
| **F5** | Medium | Tên được chụp lúc ghi ván, không có gì nói ra thứ tự đó | ✅ **đã fix** — thêm một câu vào gợi ý |
| **F4** | Medium | Ô `Display name` nằm ở bảng điểm, người dùng tìm trong `Cài đặt` | ⏳ backlog — dời đi thì phá một quyết định đã đo (MASTER.md §7) |
| **F6** | Low | HUD không nằm trên nhịp lưới của bàn chơi (MASTER.md §1) | ⏳ backlog — cần một pass thiết kế, 0/3 persona vấp |
| **F7** | Low | Overlay tạm dừng làm mờ luôn HUD — thứ người chơi dùng để tự kiểm | ⏳ backlog |
| **F8** | Low | Trang mở ra là vào ván luôn, đồng hồ đã chạy | ❌ **không sửa** — đúng thiết kế |
| — | (số đo) | Khổ 375 **không hiện `Số hàng`** (`display: none`) | ⏳ backlog — chưa persona nào xác nhận |

---

## Ấn tượng đầu

| Thước | Kết quả |
| --- | --- |
| Đoán đúng đây là trang gì | **3/3** |
| Dám nhập email | **KHÔNG ÁP DỤNG** — sản phẩm không có ô email/sđt nào |
| Lý do người không dám | — (thước không áp dụng) |

Cả ba persona tự nói ra việc không có ô nào để nhập mà không được hỏi riêng. p01: *"Không thấy
chỗ nào đòi nhập gì cả, nên chưa phải nghĩ tới chuyện đó"*.

**Đoán đúng 3/3, và đoán rất sát.** p01: *"Thấy PPS + Hold + Next queue kiểu tetr.io, tôi đoán
nó nhắm tới người biết luật"*. p05: *"Nhìn cái là biết ngay"*. Wordmark, `SCORE/LINES/LEVEL`,
`HOLD`, `NEXT` và thanh gợi ý phím đều hiện ngay trong khung đầu tiên. **Thông điệp chính của
trang chủ tới được, ở thước gắt nhất** — và gắt hơn bình thường ở đây, vì không có màn hình chờ
nào để giải thích trang này là gì.

**Ba từ trước → sau:**

| | Trước | Sau |
| --- | --- | --- |
| p01 | quen mắt, gọn, **hơi bất ngờ** | Quen thuộc, **hụt một nhịp**, tạm ổn |
| p03 | tò mò, **hơi ngờ vực**, chờ xem | Nhẹ người, mừng, **vẫn thiếu** |
| p05 | gọn gàng, **hơi lạ**, dễ chịu | Yên tâm, **hơi vòng vèo**, hài lòng |

**Đổi theo hướng:** cả ba đều **dịch lên**, không ai xuống. Cả ba trả lời **có** cho câu quay
lại — và cả ba kèm một điều kiện.

**Hai mẫu lặp, là phát hiện chứ không phải cảm tính:**

1. **3/3 đặt một từ dè dặt có chữ "hơi" vào ba từ đầu.** Chỉ p01 và p03 nói được nguyên nhân của
   mình, nên **không quy được nguyên nhân chung** — chỉ ghi lại rằng hình thế "nhìn hiểu ngay
   nhưng vẫn giữ một chút dè" xuất hiện ở cả ba.
2. **3/3 kết thúc bằng một từ nghĩa "gần đủ, còn thiếu một khúc"** — *hụt một nhịp · vẫn thiếu ·
   hơi vòng vèo*. Ba người, ba route, ba khúc thiếu khác nhau (F1, F3, F4). Đây là hình dạng
   chung của sản phẩm ở lần chạy này: **không ai bỏ cuộc, không ai thấy vỡ, nhưng không ai ra
   khỏi phiên mà trọn vẹn.**

---

## Bảng điểm theo Red Route

`min_steps` đếm **thao tác giao diện**, không đếm nước đi khối.

| Red Route | Hiệu quả | Hiệu suất | Hài lòng — nguyên văn |
| --- | --- | --- | --- |
| **RR-03** Tạm dừng rồi chơi tiếp (p05) | **1/1** | **2 / 2** | *"Tôi tin chắc ván đã đứng thật"* · *"đúng y chỗ tôi để lại, không mất gì cả"* |
| **RR-04** Đổi phím (p01) | **1/1** | **6 / 4** | *"mượt, phản hồi tức thì"* · nhưng *"hụt một nhịp"* |
| **RR-05** Chỉnh DAS/ARR (p01) | **0/1** | ≈ **5 / 4** | *"Đây là chỗ tôi khựng lại đúng như tôi sợ"* |
| **RR-07** Chơi khi không phân biệt màu (p03) | **0/1** | ≈ **4 / 3** | *"chưa từng thấy game nào làm tử tế như vậy"* · và *"Chỉ giải quyết một nửa"* |
| **RR-08** Tên mình trên bảng điểm (p05) | **1/1** | ≈ **6 / 4** | *"à, tìm ra rồi!"* · *"mừng quá"* · nhưng *"hơi vòng vèo"* |

**Hai ô `0/1` khác nhau về bản chất:**

- **RR-05** là **lỗi sản phẩm**. Nửa đầu `done_when` đạt (nhãn đổi sang số tick mới), nhưng p01
  tự khai không đạt mục tiêu của mình: *"Tôi bị chặn ở chỗ thiếu quy đổi đơn vị, không phải chặn
  ở giới hạn số của slider."*
- **RR-07** có **hai nguyên nhân, phải tách**: phần "gọi tên được khối trong `Next`" trượt **vì
  sản phẩm** (F3); phần "xoá được ít nhất một hàng" trượt **vì công cụ** — p03 viết thẳng: *"hạn
  chế do tốc độ thao tác chậm qua công cụ, không phải do trang web"*. **Việc p03 không xoá được
  hàng nào không được tính là phát hiện.**

**Không persona nào thử:** RR-01, RR-02, RR-06, RR-09, RR-10. Năm route này **không có ô điểm**,
và không được suy ra từ bất cứ thứ gì.

---

## Phát hiện

### F3 · Critical · Visual craft · Interaction Design · Visual hierarchy · Trust

**Ở đâu:** RR-07 — chế độ `Distinguish without colour`; ô **HOLD** và dãy **NEXT**.

**Chuyện gì xảy ra:** Bật công tắc thì **bàn chơi** được in chữ cái trắng vào giữa từng ô —
hoạt động đúng. Nhưng **ô Hold và cả dãy Next không nhận chữ nào**: giữ nguyên màu rực, vẫn chỉ
là mấy mảng màu bé. Đúng chỗ p03 khai ngay từ đầu là khó nhất với mình.

**Dẫn chứng:** p03, Câu 3 — *"cả hai chỗ đó **không có chữ cái nào cả**, chỉ là các ô màu nhỏ
xếp cạnh nhau y như lúc chưa bật… đúng thứ mà tôi đã nói ngay từ đầu là khó với tôi."* Câu 4:
*"Chỉ giải quyết một nửa… **mất hết lợi thế lẽ ra phải có khi nhìn trước hàng chờ.**"*

Ảnh `2026-09-12-logs/p03-RR-07-04-hold-va-next-sau-hold.png` — **mở ra nhìn thì nặng hơn lời
kể**: bàn chơi chuyển **xám hoàn toàn** (chữ `I`/`T`/`O` trắng), trong khi HOLD giữ một khối
**xanh dương rực** và NEXT vẫn **đỏ/cam/xanh lá/xanh lơ**, không một chữ nào. Hai khung cạnh
nhau trong cùng màn hình đang nói **hai ngôn ngữ thị giác khác nhau về cùng một loại vật thể** —
và chế độ hỗ trợ **đảo ngược** signature element ở MASTER.md §1: màu chỉ còn tồn tại **ngoài**
bàn chơi.

**Đối chiếu token (thắng cảm nhận thẩm mỹ chung):** MASTER.md §2 đã **đo**: T vs Z **1.20** ·
S vs O **1.25** · L vs O **1.39** · I vs J **2.18**, và kết luận *"for a player who cannot
separate T from Z, a 1.20 ratio means those two pieces are **the same piece**"*. Ảnh cho thấy
khối `S` xanh lá và `O` vàng nằm liền nhau trong NEXT — đúng cặp **1.25**.

**Bao nhiêu người vấp:** **1/1 đã thử.** Không nâng bậc (p03 là persona a11y duy nhất trong
dàn). Mức Critical đến từ dải "chặn hoàn thành `done_when`" — RR-07 đòi nguyên văn *"gọi tên
được khối đang rơi **và khối trong ô `Next`**"*, nửa `Next` bị chặn hẳn.

**✅ Đã fix.** `cellFace(kind, colorBlind)` là nơi duy nhất quyết định mặt một ô; canvas và DOM
đều đọc nó. Ảnh sau fix: `2026-09-12-logs/fix-01-hold-next-co-chu.png`. Xem ADR-0017.

### F1 · High · Interaction Design · Trigger words · ISO 9241-11

**Ở đâu:** RR-04, RR-05, RR-07 — nút `Done` của màn `Cài đặt`.

**Chuyện gì xảy ra:** Mở `Cài đặt` thì ván tự tạm dừng (đúng thiết kế). Nhưng `Done` **không**
trả người chơi về ván — nó để lộ hộp `PAUSED`, đòi thêm một lần bấm `Resume`. Chữ trên nút là
`Done`, thứ nhận được là một màn hình nữa. Không ai trong ba persona chủ động bấm pause trước.

**Dẫn chứng:**

- **p01** — *"**Bất ngờ:** đóng xong không quay lại ván chơi mà bật ra khung 'Paused'… **tôi
  không hề bấm pause.**"*, rồi *"lại bị đẩy vào 'Paused' y như lần trước"*. Con số của p01:
  *"Số lần phải quay lui: **2 lần** — cả hai lần đóng Settings"*. Ảnh
  `2026-09-12-logs/p01-RR-04-03-paused-bat-ngo.png`.
- **p03** — *"**Bấm 'Done' xong thì game tự chuyển sang màn hình 'Paused'** (chắc phím tắt đóng
  bảng trùng với phím Pause)"*. Đáng chú ý: p03 **đoán sai nguyên nhân** — đó chính là thứ một
  phản hồi mờ gây ra, người dùng tự dựng một mô hình sai về sản phẩm.
- **p05**, biến thể cùng overlay — *"bấm nút 'High scores' ở thanh trên cùng mà **bị hộp thoại
  Paused chặn mất**"*, kèm *"bấm vào chỗ không phản hồi: 1 lần"*.

**Bao nhiêu người vấp:** **2/3** vấp đúng triệu chứng `Done → Paused` (p01 hai lần, p03 một
lần) → Medium **nâng một bậc thành High**. **3/3** nếu tính cú bấm chết của p05. Xác nhận thứ
ba không phải persona: đọc DOM sau khi bấm `Xong` → `overlay: "Đang tạm dừng"`.

Một lưu ý phụ trên ảnh `p01-RR-04-03`: trong lúc hộp `PAUSED` mở, **vòng focus trắng nằm trên
nút bánh răng ở thanh trên** — focus bàn phím ở ngoài hộp thoại. Chưa persona nào chạm tới.

**✅ Đã fix.** `shouldAutoPause(phase)` trả lời cả hai chiều; `closeDialog` bỏ **đúng** cái tạm
dừng mà việc mở đã gây ra. Người tự bấm tạm dừng rồi vào cài đặt vẫn được trả về hộp tạm dừng.
Lưu ý focus ring vẫn còn → backlog.

### F2 · High · Trigger words · Form design · ISO 9241-11

**Ở đâu:** RR-05 — mục `Handling`, hai thanh trượt `DAS` và `ARR`.

**Chuyện gì xảy ra:** Hai giá trị chỉ diễn đạt bằng **tick**, không chỗ nào quy đổi sang ms —
đơn vị mà nhóm người dùng chính nghĩ bằng. p01 đặt được cả hai về sàn nhưng **không** đạt việc
mình đến để làm.

**Dẫn chứng:** p01 — *"tôi nghĩ bằng mili giây (quen DAS ~80ms, ARR 0ms ở tetr.io/jstris), nhưng
ở đây đơn vị là 'ticks', **không có số ms đi kèm ở bất kỳ đâu — không tooltip, không chữ nhỏ,
không nút đổi đơn vị**"*. Hệ quả tới ý muốn quay lại: *"tôi sẽ ngần ngại vì không có gì để đối
chiếu — trừ khi tự tìm được đâu đó 1 tick = bao nhiêu ms."* Ảnh
`2026-09-12-logs/p01-RR-05-01-das-arr-ve-0-tick.png`.

**Bao nhiêu người vấp:** **1/1 đã thử.** Không nâng bậc. Mức High đến từ dải "chặn `done_when`"
và từ chỗ `overview.md` §6.3 đặt DAS/ARR làm **một trong ba tiêu chí thành công của sản phẩm**,
cho đúng người vừa nói câu trên.

**✅ Đã fix.** Gợi ý hiện `8 ticks before auto-repeat (133 ms)`; tick giữ vị trí dẫn vì tick là
thứ được lưu và là thứ engine đếm (bất biến #4).

### F4 · Medium · LATCH · Trigger words

**Ở đâu:** RR-08 — ô `Display name`, ở đáy màn `High scores`.

**Dẫn chứng:** p05 — *"Tôi mở Settings tìm chỗ ghi tên mình, **lục hết các mục Difficulty,
Handling, Keys, Display, Sound, Language — không thấy đâu cả.**"* → *"Tôi đóng Settings, mở nút
'High scores' — **à, tìm ra rồi!**"* Cô quy đúng chuyện này vào một trong ba từ kết: *"'hơi vòng
vèo' vì chỗ ghi tên không nằm ở nơi tôi nghĩ tới đầu tiên"*.

Đáng ghi nhận mặt tốt: chú thích `Shown next to your scores. Not an account.` **làm đúng việc
của nó** — p05 hiểu ngay đây không phải tài khoản.

**Bao nhiêu người vấp:** 1/1 đã thử. Chỉ tốn thêm bước → Medium.

**⏳ Backlog.** Đây là lệch trục LATCH thuần: người dùng tìm theo **Category** ("thứ tôi cấu
hình"), sản phẩm xếp theo **Location** ("nơi cái tên được dùng"). Cả hai đều có lý. **Không dời
vội:** MASTER.md §7 ghi rằng đưa ô nickname vào trong vùng cuộn của hộp điểm đã trả lại **170px**
cho danh sách ở khổ 375 — vị trí hiện tại là quyết định có số đo, không phải vô tình. Cái thiếu
là một **con đường** từ `Cài đặt`, không phải một lần dời.

### F5 · Medium · Interaction Design · Form design

**Ở đâu:** RR-08 — thứ tự giữa ô `Display name` và lúc ván được ghi.

**Chuyện gì xảy ra:** Tên được chụp **vào lúc ván được ghi** (ADR-0014), nên nhập tên **sau** khi
chết thì hàng vừa tạo mang `Player` mãi mãi — và **không có dòng chữ nào nói ra quy tắc đó**.

**Dẫn chứng:** p05, Câu 3 nguyên văn — *"**Không có.** Tôi nhập tên trước lúc ván kết thúc là do
tình cờ… **chứ trang không nói gì về thứ tự.**"*

**Bao nhiêu người vấp:** **0/1 bị hại thật** — p05 đi qua bẫy mà không sập. Dẫn chứng là **sự
vắng mặt của một lời cảnh báo**, do chính persona xác nhận, cộng với `red-routes.md` RR-08
`why_red` vốn đã dự đoán. Giữ Medium và nói thẳng: cần một phiên persona **chơi trước rồi mới
đi tìm chỗ ghi tên** để nâng mức này.

**✅ Đã fix, bằng cách rẻ nhất và không đụng ADR-0014:** gợi ý dưới ô tên giờ nói ra quy tắc.
Không đổi mô hình "tên được chụp lúc ghi" — đổi nó là đổi ý nghĩa của mọi hàng đã lưu.

### F6 · Low · Visual craft · Visual hierarchy

**Ở đâu:** màn chơi ở 1920×1080 — HUD và hai cột `HOLD`/`NEXT`.

**Đo trên ba ảnh "vừa mở trang" của ba phiên khác nhau:** bàn chơi trục giữa ≈ 960; `SCORE`
quanh x ≈ 880 (lệch ~75px); `LINES`/`LEVEL` dồn sang x ≈ 1570→1670 (cách rìa phải bàn ~360px);
cột `NEXT` áp sát bàn (~28px) còn hộp `HOLD` cách bàn **~135px**.

**Đối chiếu token:** MASTER.md §1 đặt nguyên tắc *"the HUD sits on the board's own grid rhythm…
so the HUD reads as an extension of the board, not as a panel parked next to it"*, và §6 nói
*"hold left · next right, **both** on the board's grid rhythm"*. Hình đang chạy không làm thế.

**Bao nhiêu người vấp:** **0/3.** Không ai nhắc, không ai mất bước — p01 còn đọc được HUD ngay
và tìm thấy ba icon góc trên phải **không phải đọc chữ gì cả**. Low, và nó ở đây vì hai lăng
kính thị giác được chấm bằng ảnh + token, không bằng số persona.

**⏳ Backlog.** Nếu HUD được xem lại thì xem một lượt cho cả hai khổ — phép đo bằng tay tìm ra
chuyện nặng hơn ở khổ nhỏ (mục dưới).

### F7 · Low · Visual craft · Interaction Design

**Ở đâu:** RR-03 — overlay hộp `PAUSED` làm mờ **toàn bộ trang, gồm cả HUD**.

**Dẫn chứng:** p05 xác nhận ván đã dừng **bằng cách đọc chính mấy con số bị làm mờ đó**: *"đồng
hồ Time vẫn đứng y nguyên ở 00:44, điểm vẫn 70… vì cái đồng hồ không nhích lên chút nào"*.

**Bao nhiêu người vấp:** **0/1 bị cản.** p05 vẫn kết luận được và vẫn hài lòng → **quan sát thị
giác, không phải điểm kẹt**. ⏳ Backlog.

### F8 · Low · Interaction Design · Trust

**Ở đâu:** ấn tượng đầu — trang mở ra là vào ván luôn, đồng hồ đã chạy.

**Dẫn chứng:** p01 — *"hơi bất ngờ (đồng hồ đã chạy 00:06 dù tôi chưa bấm gì)"*. Chiều ngược lại
làm nhẹ mức này: p05 nhìn cùng hình mà **không** thấy lạ — *"Tôi tưởng đây là ván mới toanh,
đúng như game xếp khối bình thường tôi hay chơi ở nhà."* p03 không nhắc gì.

**Bao nhiêu người vấp:** **1/3**, và người đó tự giải thích được trong một câu.

**❌ Không sửa — đúng thiết kế.** `red-routes.md` §`entry` và `overview.md` §2 ("người chơi muốn
mở ra chơi ngay") đều nói đây là chủ ý. Xem lại **chỉ khi** một phiên p02 (người chưa từng chơi)
vấp vào cùng chỗ — và chính phiên đó là phiên không có log ở lần chạy này.

---

## Không phát hiện được gì ở

**RR-03 — tạm dừng rồi chơi tiếp.** Cả hai câu hỏi của route được trả lời dứt khoát về phía tốt.
`red-routes.md` gọi "dừng mà bàn vẫn chạy ngầm" là *"hỏng nặng nhất trong nhóm này"* — nó không
xảy ra.

**Cơ chế đổi phím của RR-04, phần lõi.** Bỏ F1 ra thì phần còn lại được persona khó tính nhất
khen: *"nút đổi ngay thành 'Enter', **và** thanh chú thích phím ở footer cũng tự cập nhật theo
cùng lúc, **không cần reload**"*, kiểm lại trong ván thì Score nhảy đúng mức hard-drop. **Lưu ý
về dẫn chứng:** trong ảnh đó thanh footer **bị blur** vì hộp thoại đang mở, nên chuyện footer tự
cập nhật hiện **chỉ có lời kể**, không có ảnh chứng minh.

**Nửa "phát hiện được đường vào" của RR-07 — điểm sáng nhất của cả lần chạy.** p03 mất **2
bước**, và: *"thấy ngay dòng 'Distinguish without colour' kèm câu giải thích… **câu này đúng y
như thứ tôi cần, không phải đoán mò gì cả**"*. Về phần bàn chơi: *"**Đây là điều tôi chưa từng
thấy game nào làm cho tử tế như vậy.**"* Đây là **Trigger words đạt điểm cao nhất trong báo
cáo**: nhãn dùng đúng chữ mà người dùng tự nghĩ ra.

**Lăng kính Form design — gần như không có đất, và không có gì bị bịa vào cho đủ tám.** Toàn bộ
"form" là màn `Cài đặt` và một ô `Display name`. Có đúng **hai** thứ dính được, đã ghi ở trên
(F2, F5). Không persona nào nhập sai rồi phải sửa, không ai gặp thông báo lỗi, không ai bỏ trống
trường bắt buộc — **vì không có trường bắt buộc nào.**

**Bảng `High scores` không hứa hẹn một bảng xếp hạng online** — mặt duy nhất của RR-13 kiểm được
ngay bây giờ. p05 đọc chú thích và hiểu đúng ngay, không nói câu nào kỳ vọng so điểm với người
khác. Một phản ứng phụ đáng ghi ở lăng kính Trust: *"**Tôi thấy yên tâm phần nào nhưng cũng hơi
lo vì nếu máy hỏng thì mất sạch điểm không ai báo trước.**"* Một người, chưa đủ thành phát hiện.

**Console sạch ở cả ba phiên:** `Total messages: 0 (Errors: 0, Warnings: 0)`. Trên production
build, không lỗi runtime nào lộ ra. Không phải phát hiện UX — ghi ra vì nó loại trừ một lớp
nguyên nhân cho mọi chuyện ở trên.

**Không route nào được chấm mà không có persona.** RR-01, RR-02, RR-06, RR-09, RR-10: **không
dữ liệu**. Không suy, không nội suy, không dùng 4 ảnh mồ côi của p02 để lấp.

---

## Kiểm bằng tay — KHÔNG PHẢI PHIÊN PERSONA

Toàn văn: `2026-09-12-logs/kiem-bang-tay.md`. Không một dòng nào ở đây được trộn vào §Phát hiện.

| Hạng mục | Kết quả đo |
| --- | --- |
| **`NFR-A11Y-03`** vùng bấm ≥44×44px ở 375×667 | **ĐẠT** — màn chơi 11/11, màn `Cài đặt` 24/24; `scrollWidth === 375`, không cuộn ngang. **Lần đo thật đầu tiên** cho ngưỡng mà `nfr.md` chỉ kiểm bằng "review mockup". Đã cập nhật vào `nfr.md` |
| **RR-06** chuỗi UI khi đổi sang tiếng Việt | **SẠCH** — đối chiếu 31 chuỗi từ `en.json` → `[]`. Phần tiếng Anh còn lại (`Left`, `Space`, `Escape/P`…) là **tên phím vật lý**, không phải chuỗi giao diện. **Không biến nó thành phát hiện** |
| **F1** xác nhận thứ ba | Bấm `Xong` → `overlay: "Đang tạm dừng"`. Củng cố F1, nhưng F1 đứng được **mà không cần** nó |
| **Khổ 375 không hiện `Số hàng`** | `.topbar__stack` của `Số hàng` → `display: none`, `w: 0`; `ĐIỂM` và `CẤP ĐỘ` vẫn `flex`. Ảnh `kiem-tay-01-mobile-375-thieu-so-hang.png`. **Không phải phát hiện persona.** Nhưng đắt về truy vết: US-01 bước 4 hứa *"điểm và **số hàng** tăng"*, và `RR-01.done_when` định nghĩa **bằng chính ô Lines** — ở khổ điện thoại cái thước đó không có trên màn hình |

---

## Ghi chú về chính lần chạy này

**1. Hai lỗi của người điều phối, và chúng quyết định báo cáo này gồm những gì.** Toàn văn ở
`2026-09-12-logs/00-dieu-phoi-va-hai-loi.md`. Tóm: (a) `chrome-devtools-mcp` mở tab không lên
foreground → `document.hidden` → `loop.ts:70` tự tạm dừng và không publish HUD → persona thấy
một cái game đóng băng; **toàn bộ log p02 lần 1 bị loại**. (b) Chạy song song làm các phiên
**trao đổi trạng thái qua cùng một `localStorage`** — p02 thấy chữ đổi từ `Space — Hard drop`
thành `Enter — Hard drop`, mà `Enter` **đúng là phím p01 vừa gán**; số `106` xuất hiện ở cả hai
log. **59 ảnh của 5 phiên nhiễm đã bị dồn sang `nhiem-song-song/` và không cái nào được mở,
trích, hay đếm.**

**2. Độ trễ công cụ — hai phát hiện đã bị chặn lại vì nó.** (a) p03 không xoá được hàng nào
trong 3 ván; (b) p01 không cảm nhận được DAS/ARR sau khi chỉnh. **Cả hai persona tự nói ra điều
này mà không cần được nhắc**, và cả hai **không** thành phát hiện.

**3. Không có throttle mạng → không một chữ nào về tốc độ tải.** `NFR-PERF-05` **không được
kiểm** ở lần chạy này. Nó cần Lighthouse, không cần persona.

**4. Mù màu được mô phỏng ở tầng hành vi, không ở tầng trình duyệt.** Brief của p03 **tả hệ
quả**, không đặt bộ lọc lên pixel. Nghĩa là F3 được xác nhận bằng **hành vi persona + số đo
tương phản của chính project**, không bằng một ảnh đã qua bộ lọc deuteranopia. Ảnh
`p03-RR-07-04` là ảnh **màu thật** — nó chứng minh **sự vắng mặt của chữ cái** ở Hold/Next, điều
không phụ thuộc thị giác của ai.

**5. Locale là `en-US`, và với dàn này thì đó là đúng ngữ cảnh** (`RR-06.actor` vốn là "người
Việt mở trang có trình duyệt tiếng Anh"). Chiều ngược lại không thử được. Hệ quả nhỏ có ảnh:
`p05-RR-08-04` hiện `9/12/26, 1:56 AM` — định dạng Mỹ, đúng theo locale đang chạy, nhưng p05 là
người Việt. **p05 không phàn nàn**, nên không dựng phát hiện.

**6. Một chỗ lệch giữa lời kể và ảnh, đã truy ra nguyên nhân.** p05 kể dòng điểm *"ghi rõ '114 —
your latest round'"*, nhưng cụm chữ đó **không xuất hiện dưới dạng chữ nhìn thấy được** trong
ảnh. `ux-expert` để ngỏ hai khả năng; đọc code thì dứt điểm: `scores.freshRow` được render trong
`<span className="sr-only">` (`HighScoresScreen/index.tsx:307`) — **nó là nhãn cho trình đọc màn
hình, đang hoạt động đúng thiết kế**, còn thị giác thì nhận vạch `data-fresh`. Không phải lỗi
của ai, và `RR-08.done_when` vẫn đạt.

**7. Phạm vi đọc của `ux-expert`:** nó **không mở được** file persona của p03 và p05 — chỉ có
`Read`, không liệt kê được thư mục, và không đoán đúng tên file. Chân dung hai persona đó trong
báo cáo dựng từ `personas/README.md` + chính log của họ. Không ảnh hưởng phát hiện nào, nhưng
nghĩa là `goal_in_user_words` gốc của p03/p05 **không** được đối chiếu với việc họ thật sự đã
làm. **Lần sau: đưa danh sách đường dẫn đầy đủ vào brief của `ux-expert`.**

**8. Việc quan trọng nhất cho lần chạy sau:** **chạy `p02` trước tiên.** Ba trong năm route chưa
được phủ (RR-01, RR-02, RR-09) chính là ba route nói về nhóm người dùng mà sản phẩm **chưa bao
giờ được một người lạ nào kiểm hộ**.
