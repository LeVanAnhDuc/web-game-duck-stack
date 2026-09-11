# Brief của lần chạy 2026-09-12-0055

Mỗi file là brief **nguyên văn** đã gửi cho một agent `ux-persona`. Giữ lại để lần chạy sau
lặp lại được y hệt, và để `ux-expert` đối chiếu được "persona này đã được nói những gì".

## Quyết định điều phối của lần chạy này

| Quyết định | Thay vì | Vì sao |
| --- | --- | --- |
| **Chạy trên bản deploy** `https://levananhduc.github.io/web-game-duck-stack/` | `http://localhost:5173` như `red-routes.md` khai | Người dùng yêu cầu. Lợi thế thật: đo đúng **production build** trên GitHub Pages (base path `./`, asset hash, không HMR). Deploy đang ở commit `8dbd9b0` = `origin/main` HEAD, nên không có khoảng lệch giữa thứ được test và thứ nằm trên `main` |
| **`chrome-devtools-mcp`** (hạng 2) | `playwright` (hạng 1) | `playwright` MCP **không có** năng lực throttle mạng, mà `browser-capability.md` xếp nó vào nhóm bắt buộc và cấm degrade âm thầm. `chrome-devtools-mcp` có đủ cả 7, **cộng** `isolatedContext` cho cookie/localStorage sạch từng phiên |
| **Tuần tự, không 4 phiên song song** | trần 4 phiên đồng thời | Chỉ có **một** instance Chrome cho cả server MCP. Hai agent cùng lúc sẽ tranh cùng một tab và ghi nhận xét của nhau. Trần 4 giả định mỗi phiên một browser context độc lập — điều kiện đó không có ở đây |
| **6 dispatch cho 12 mã phiên** | 12 dispatch | Ấn tượng đầu *chỉ xảy ra một lần cho mỗi persona* (`frameworks.md` §Bảng ấn tượng đầu), nên gộp các route của cùng một người vào một phiên liền mạch là **đúng hơn** về phương pháp, không chỉ rẻ hơn. Mã phiên vẫn tách theo route để ảnh không lẫn |
| **Trần 40 hành động chỉ đếm thao tác giao diện** | đếm mọi thao tác | Cùng quy ước với `min_steps` ở `red-routes.md`: bấm phím điều khiển khối không phải "bước" trong một cái game |
| **Rào "không thao tác không hoàn tác" được mở riêng cho RR-10** | giữ rào nguyên vẹn | RR-10 *là* route xoá dữ liệu. Dữ liệu đó do người điều phối gieo vào một `isolatedContext` tách biệt, xoá không mất gì thật |

## Hạn chế phải nói ra, không được che

**Độ trễ công cụ.** Mỗi tool call mất vài giây, trong khi khối rơi liên tục. Nghĩa là persona
**không** chơi ở tốc độ người thật — họ chơi kiểu tua từng nấc. Hệ quả: `done_when` của RR-01
(Lines ≥ 1) và RR-09 có thể không đạt vì **công cụ**, không vì UX.

`ux-expert` được dặn tách hai nguyên nhân đó ra, và mọi phiên được dặn nói rõ "không kịp vì mỗi
thao tác mất vài giây" thay vì kết luận "game chạy quá nhanh". Phát hiện nào chỉ dựa vào việc
persona không bắt kịp khối rơi thì **không phải phát hiện**.

## Brief được lắp từ ba mảnh, không lưu trùng ở đây

`ux-persona` chỉ có tool trình duyệt + `ToolSearch` — nó **không có `Read`**, nên brief phải
truyền inline khi dispatch. Lưu lại bản sao đầy đủ ở đây là nhân đôi nội dung đã có trên đĩa,
nên chỉ ghi công thức lắp:

1. **Phần kỹ thuật** — đoạn dưới đây, giống nhau ở mọi phiên, chỉ đổi `isolatedContext`,
   `viewport` và `networkConditions`.
2. **Phần "Bạn là ai"** — `references/personas/pNN-*.md`, bỏ phần `JTBD` và bỏ mọi câu nói về
   *vì sao* persona đó có mặt trong dàn (persona không được biết mình là công cụ đo cái gì).
3. **Phần việc cần làm** — đúng khối `goal_in_user_words` của route đó trong file persona.

### Phần kỹ thuật (nguyên văn)

- Nạp tool bằng **một** lần `ToolSearch` với `select:` liệt kê:
  `new_page`, `take_screenshot`, `take_snapshot`, `click`, `press_key`, `fill`,
  `list_console_messages`, `emulate`, `list_pages` — tất cả mang tiền tố
  `mcp__plugin_chrome-devtools-mcp_chrome-devtools__`.
- Mở trang bằng `new_page` với `isolatedContext: "<pNN>"` → trình duyệt sạch, chưa từng vào
  trang này. **Đây là thứ làm cho "người mới tinh" đúng nghĩa**, kể cả khi dùng công cụ hạng 2.
- `emulate` đặt `viewport` (và `networkConditions: "Slow 3G"` cho p04).
- Cấm `evaluate_script` — người dùng không mở devtools ra đọc code.
- Gọi `list_console_messages` một lần ở cuối, dán nguyên trạng.
- Nói rõ về độ trễ công cụ, kèm câu dặn **không** kết luận "game chạy quá nhanh".
- Trần 40 hành động, chỉ đếm thao tác giao diện.
- Đường dẫn ảnh tuyệt đối + mã phiên, theo đúng `lib/persona-brief.tpl`.

### Viewport và mạng theo phiên

| Phiên | `isolatedContext` | `viewport` | `networkConditions` |
| --- | --- | --- | --- |
| p01-blind · p01-RR-04 · p01-RR-05 | `p01` | `1920x1080x1` | — |
| p02-RR-01 · p02-RR-02 | `p02` | `1366x768x1` | — |
| p03-RR-07 | `p03` | `1920x1080x1` | — |
| p04-RR-09 · p04-RR-06 | `p04` | `375x667x2,mobile,touch` | `Slow 3G` |
| p05-RR-03 · p05-RR-08 | `p05` | `1920x1080x1` | — |
| p06-blind · p06-RR-10 | `p06` | `390x844x3,mobile,touch` | — |

p03 không được nói là "mù màu" theo kiểu y khoa trong brief; brief tả **hệ quả**: "mấy khối này
với bạn trông gần như cùng một màu". Nói tên bệnh thì agent sẽ diễn, tả hệ quả thì agent hành
xử. Không dùng mô phỏng deuteranopia ở tầng trình duyệt vì `chrome-devtools-mcp` không phơi
`Emulation.setEmulatedVisionDeficiency` ra thành tool — ghi vào §Ghi chú của báo cáo.

---

# ĐỔI CÔNG CỤ GIỮA LẦN CHẠY — đọc trước khi đọc bất kỳ log nào

Quyết định ban đầu (`chrome-devtools-mcp`) đã bị **đảo lại sau phiên đầu tiên**. Ghi đầy đủ vì
nó quyết định log nào dùng được.

## Phiên `p02` lần 1 — BỊ HUỶ, không dùng làm dẫn chứng

Persona kể: mở trang ra đã thấy hộp **"ĐANG TẠM DỪNG"**, bấm *Chơi tiếp* hai lần không ăn, bấm
`Esc` không ăn, bấm *Chơi lại* thì vào được ván nhưng **khối không nhúc nhích** và `THỜI GIAN`
đứng ở `00:00` suốt. Bỏ cuộc sau 8 lần bấm vào chỗ không phản hồi.

**Đó là artifact công cụ, không phải lỗi sản phẩm.** Nguyên nhân đã truy ra tận dòng:
`src/runtime/loop.ts:70` tự tạm dừng khi `document.hidden` (đúng `NFR-REL-01`), và trong lúc
hidden thì vòng lặp **không publish HUD** — nên bấm *Chơi tiếp* có đổi state của engine mà giao
diện không bao giờ vẽ lại. Tab do `chrome-devtools-mcp` mở **không được đưa lên foreground**,
nên `document.hidden === true` cả phiên.

Kiểm chứng bằng tay trên playwright, cùng URL, cùng commit:
`{hidden: false, visibilityState: "visible", hasFocus: true}`, không có overlay nào, bấm `Space`
một lần → `SCORE 28 · PPS 0.17 · TIME 00:05`. App chạy bình thường.

**Người thật không chạm được vào một tab đang ẩn**, nên triệu chứng này không tái hiện được ngoài
đời. Log p02 lần 1 bị loại toàn bộ; p02 được chạy lại từ đầu với ấn tượng đầu mới.

Ba ảnh/12 ảnh của phiên đó cũng mất: agent **không truyền `filePath`** cho `take_screenshot` nên
ảnh rơi vào thư mục tạm của Chrome. Brief từ lần 2 trở đi nói thẳng rằng không truyền đường dẫn
là mất dẫn chứng, kèm ví dụ đường dẫn đầy đủ.

## Vì sao bỏ `chrome-devtools-mcp` hẳn

| Vấn đề | Chi tiết |
| --- | --- |
| **Tab không foreground → `document.hidden`** | Biến mọi phiên thành một game đóng băng. Không có tool nào trong bộ đó bắt tab lên foreground một cách đáng tin |
| **Một chrome-profile cho tất cả** | Đếm được **5 instance server** `chrome-devtools-mcp` đang chạy (mỗi agent một server), tất cả trỏ vào `~/.cache/chrome-devtools-mcp/chrome-profile` → `lockfile` bị giữ, server thứ hai báo *"The browser is already running"*. Song song là bất khả, và ngay cả tuần tự cũng bị chặn bởi Chrome còn sót của phiên trước |
| **Profile bền, có extension** | Log console của p02 lần 1 toàn lỗi `chrome-extension://hfgkoaeng.../content.js`. Profile đó mang extension của chủ máy — đúng cái mà `browser-capability.md` gọi là "persona mang sẵn session của chủ máy không còn là người lạ nữa" |

## Công cụ dùng thật: `playwright` (hạng 1)

Đảo lại về đúng thứ tự ưu tiên mà `browser-capability.md` đặt ra. Đã kiểm: page `visible`, có
focus, ảnh ghi được vào đúng `anh-tho/` (playwright giải `filename` theo cwd = project root, nên
brief dùng đường dẫn **tương đối**), profile sạch không extension.

**Năng lực thiếu: throttle mạng.** Playwright MCP không phơi nó ra thành tool. Theo
`browser-capability.md` thì thiếu năng lực bắt buộc là phải **dừng và báo, không degrade âm thầm**
— nên đây là bản báo cáo đó:

> **RR-09 chạy ở mạng thường, KHÔNG phải 3G.** Mọi nhận định về "tải lâu", "trang trắng vài giây",
> "chưa kịp chơi thì xe tới" của p04 **không có giá trị** trong lần chạy này và phải bị loại.
> Nửa còn lại của RR-09 — viewport 375×667, cảm ứng, một ngón cái, nút che bàn chơi, vùng bấm
> 44×44px (`NFR-A11Y-03`) — vẫn đo được đầy đủ, và đó là nửa quan trọng hơn.

Muốn đo `NFR-PERF-05` (tải xong và chơi được trong ≤ 2s trên 3G) thì dùng Lighthouse, không dùng
persona. Nó đã nằm ở `backlog.md` §Việc tiếp theo như một việc riêng.

**Locale:** playwright chạy `navigator.language = en-US`, nên UI hiện tiếng Anh. Với p02/p04/p05/p06
(người Việt) đây **đúng** ngữ cảnh chứ không sai: `actor` của RR-06 vốn ghi "người dùng tiếng Việt
mở trang có trình duyệt đặt tiếng Anh". Không đổi được locale ở tầng tool nên không thử chiều
ngược lại — ghi vào §Ghi chú của báo cáo.

---

# LỖI THỨ HAI CỦA NGƯỜI ĐIỀU PHỐI: chạy song song làm nhiễm chéo các phiên

`orchestration.md` cho phép **4 phiên đồng thời** với điều kiện "mỗi phiên một browser context
riêng, sạch cookie". Điều kiện đó **không có** ở môi trường này, và tôi đã giả định là có.

## Bằng chứng

p01 và p02 được dispatch song song. Trong log của p02 có ba câu không thể tự giải thích được:

- *"lúc đầu chữ ghi 'Space — Hard drop', nhưng sau đó dòng chữ đó đổi thành 'Enter — Hard drop'
  (tôi không cố ý bấm vào đâu để đổi cả)"* — **`Enter` chính là phím p01 vừa gán** ở việc 2 của nó.
- *"Score đang 106 tụt về 46, đồng hồ nhảy về 00:19, và hiện ra 1 bảng 'Paused' tôi không hề bấm
  gì để mở"* — hai lần.
- *"điểm cao nhất của mình là 106"* — điểm 106 xuất hiện ở **cả hai** log.

Chiều ngược lại cũng có: p01 kể *"lần snapshot kế tiếp thì Score đã về 0, Time về 00:03"* và
*"mỗi lần mở Settings, dialog tự chuyển qua Paused"* — những thứ đó là thao tác của p02.

Kiểm chứng ở tầng storage: sau khi giết 3 agent, tôi mở trang và đọc `localStorage` thì thấy
`tetris.settings.v1` và `tetris.scores.v1` **vẫn còn nguyên** từ các phiên trước.

## Nguyên nhân

Mỗi subagent có MCP server riêng, nhưng playwright MCP dùng **một profile Chrome bền dùng chung**,
nên các phiên chia nhau **cùng một browser và cùng một `localStorage`**. Thêm một tầng nữa: hai
page trong cùng browser thì chỉ một page `visible`, page kia thành `document.hidden` → app **tự
tạm dừng** (đúng `NFR-REL-01`, `loop.ts:70`). Đó là nguồn của những hộp "Paused tự bật".

## Đã làm gì

1. Giết 3 agent đang chạy (p03, p05, p04) ngay khi phát hiện — chúng đã nhiễm.
2. Dồn **59 ảnh** của 5 phiên nhiễm sang `nhiem-song-song/`. Không xoá: chúng là bằng chứng của
   chính lỗi này. **Không ảnh nào trong đó được dùng làm dẫn chứng.**
3. Huỷ toàn bộ log của p01 (lần 1), p02 (lần 1 và lần 2), p03, p05, p04.
4. Chạy lại **strictly tuần tự, mỗi lúc đúng một agent**, và giữa hai phiên thì người điều phối
   tự `localStorage.clear()` rồi đóng page của mình để không tranh browser với agent.
5. Thêm vào brief một câu mới: *"Bạn là phiên DUY NHẤT đang chạy lúc này. Nếu bạn thấy một thay
   đổi mà bạn không tự gây ra thì đó là chuyện của trang web và bạn phải kể lại nguyên văn."*
   Câu này biến nhiễm chéo từ thứ vô hình thành thứ tự tố giác.

## Bài học cho `lib/orchestration.md` của máy phát

Trần "4 phiên đồng thời" đang được viết như một **giới hạn tài nguyên**, trong khi nó thật ra là
một **điều kiện đúng đắn**: song song chỉ hợp lệ khi mỗi phiên có browser context riêng **và**
storage riêng. Trần đó cần đổi thành một bước dò: kiểm xem công cụ có cách ly được storage không,
không thì tuần tự. Ghi vào `backlog.md` như một việc cho máy phát.
