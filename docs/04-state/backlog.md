# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-04 · commit df87816
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

<!-- CÁCH ĐIỀN
Mục "Đang làm" là chỗ một phiên làm việc MỚI đọc đầu tiên. Giữ nó ngắn: đang làm
gì, dừng ở bước nào, cái gì đang chặn. Cập nhật nó TRƯỚC KHI DỪNG phiên, không
phải sau.

Mục "Nợ kỹ thuật" chỉ ghi thứ CỐ Ý làm tạm, và ghi NGAY LÚC ĐÓ. Bug thì không
thuộc đây. Việc chưa làm cũng không — đó là mục 2.

KHÔNG chứa: tính năng ngoài phạm vi (-> 01-product/overview.md §Non-Goals).
-->

## Đang làm

**Đổi thương hiệu sang `Duck Stack`** (2026-09-08). Repo GitHub đổi từ
`web-game-tetris` thành `web-game-duck-stack`; GitHub redirect URL *repo* cũ nhưng
**không** redirect đường dẫn Pages cũ — địa chỉ chơi giờ là
<https://levananhduc.github.io/web-game-duck-stack/>. **Thư mục local vẫn là**
`web-game-tetris` — thương hiệu đổi, đường dẫn không.

Hai lý do, và lý do thứ hai quan trọng hơn: cả họ game dùng dạng `Duck X`, **và**
"Tetris" là nhãn hiệu của The Tetris Company, vốn thực thi rất mạnh với các bản clone
trên web. Lấy nguyên tên đó làm tiêu đề sản phẩm là rủi ro không cần thiết.

Từ "tetris" ở chỗ nói về *luật và thuật ngữ* được giữ nguyên — một lần ăn 4 hàng vẫn
gọi là "a tetris" (`src/audio`, `stats.tetrises`, `scoring.ts`, các test), và
"Modern Guideline"/"Tetris Guideline" vẫn là tên chuẩn luật đang theo. Khoá
`localStorage` (`tetris.settings.v1`, `tetris.scores.v1`, `tetris.identity.v1`)
**không** đổi: đổi là xoá sạch điểm cao và cài đặt của người đang chơi.

**Đã chạy `ux-persona-review` lần đầu và fix 4/8 phát hiện** (2026-09-12, ADR-0016 +
ADR-0017). Báo cáo: `docs/ux-reviews/2026-09-12-persona-review.md`.

Chạy trên **bản deploy production** (`8dbd9b0` = `origin/main` HEAD), không phải localhost.
**3/6 persona có log dùng được** — p02 hết hạn mức API, các phiên lần 1 bị huỷ vì nhiễm chéo.
Phủ **5/10 Red Route `live`**.

Đã fix: **F3** (Critical — chế độ không-dùng-màu bỏ qua `Hold`/`Next`), **F1** (High — đóng
cài đặt đẩy vào hộp `Paused`), **F2** (High — DAS/ARR không có ms), **F5** (Medium — thứ tự
nhập tên không được nói ra). Còn lại ở §Việc tiếp theo.

**Hai điều phải nhớ cho lần chạy sau, quan trọng hơn mọi phát hiện:**

1. **Chạy `p02` TRƯỚC TIÊN.** RR-01 là route `red-routes.md` gọi là "toàn bộ sản phẩm", và nó
   **chưa bao giờ được một người lạ nào kiểm hộ** — cùng với RR-02 và RR-09.
2. **KHÔNG chạy song song.** Trần "4 phiên đồng thời" của `lib/orchestration.md` giả định mỗi
   phiên một browser context riêng; playwright MCP ở đây dùng **một profile Chrome dùng chung**,
   nên các phiên trao đổi trạng thái qua cùng một `localStorage`. Đã xảy ra thật: p02 thấy phím
   hard-drop tự đổi thành `Enter` — phím p01 vừa gán.

**Không có việc nào đang dở.**

Feature `stats-highscores` đã xong (FR-32 → FR-34, ADR-0014). Với nó thì **44/44 FR
trong `scope.md` ở trạng thái xong** — hết phần chức năng đã cấp ID.

**Hệ quả phải nhớ:** bảng điểm tách theo độ khó và **không bao giờ được gộp**
(ADR-0014 §2a). Nếu sau này thêm mode Sprint/Ultra thì chúng đo bằng *thời gian ngắn
nhất*, nên `compareEntries` cần một chiều xếp thứ hai — không phải thêm bảng.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Feature `core-gameplay` | FR-01 → FR-22 | cao | vòng lặp cốt lõi; mọi feature khác phụ thuộc vào engine của nó |
| Feature `controls-settings` | FR-17 · FR-23 → FR-30 | **cao** | người chơi mục tiêu coi việc chỉnh DAS/ARR là bắt buộc; và FR-17 nợ từ `core-gameplay` phải trả ở đây |
| **Đo 4 NFR còn là ngưỡng chọn, chưa phải số đo** | NFR-PERF-01/02/03/05 | **cao** | chúng là ngưỡng duy nhất chưa ai chạy ra con số; NFR-PERF-04 (bundle) thì có đo mỗi lần build. Cần Performance panel + heap snapshot + Lighthouse, không cần code mới |
| Viết test cho hai script trong `.github/scripts/` | ADR-0011 | thấp | hiện chỉ kiểm bằng cách chạy tay 6 tình huống; chúng quyết định số version nên sai là sai vĩnh viễn |
| Chế độ Sprint 40 lines và Ultra 2 phút | — | thấp | dùng chung engine, chỉ khác điều kiện kết thúc và chỉ số hiển thị. **Không** phải Non-Goal — cấp FR mới khi làm |
| Màn hình xem lại replay | FR-18 | thấp | dữ liệu replay đã được ghi từ bản đầu (ADR-0002); chỉ thiếu giao diện |
| Leaderboard server + đăng nhập qua Ducker ID | ADR-0004 | thấp | **bị chặn bởi bên ngoài**: Ducker ID chưa có `/oauth/authorize`, `/oauth/token`, JWKS |
| **F4 — đường vào ô `Display name` từ `Cài đặt`** | FR-34 · ADR-0014 | **trung bình** | p05 lục hết 6 mục của `Cài đặt` rồi mới tìm ra nó ở bảng điểm. **Đừng dời:** MASTER.md §7 ghi việc đặt nó trong vùng cuộn của hộp điểm đã trả lại 170px cho danh sách ở khổ 375. Cái thiếu là một *con đường*, không phải một lần dời |
| **Khổ 375 không hiện `Số hàng`** (`display: none`) | FR-01 · US-01 | **trung bình** | Tìm ra bằng **số đo**, chưa persona nào vấp (p04 bị huỷ). US-01 bước 4 hứa "điểm và **số hàng** tăng", và `RR-01.done_when` định nghĩa bằng chính ô Lines — ở khổ điện thoại cái thước đó không có. Sửa thì phải quyết định **bỏ gì thay vào**, nên không làm kèm pass fix |
| **F6 — HUD không nằm trên nhịp lưới của bàn chơi** | — | thấp | Lệch khỏi MASTER.md §1/§6, đo trên ảnh: `HOLD` cách bàn ~135px còn `NEXT` ~28px. **0/3 persona vấp.** Cần một pass thiết kế có cổng mockup, làm cùng lượt với dòng trên |
| **F7 — overlay tạm dừng làm mờ luôn HUD** | FR-13 | thấp | p05 tự kiểm "ván đã dừng thật" **bằng cách đọc chính mấy con số bị làm mờ đó**. 0/1 bị cản, nên là quan sát thị giác |
| **Focus ring nằm ngoài hộp thoại khi `Paused` mở** | NFR-A11Y-02 | thấp | Thấy trên ảnh `p01-RR-04-03`: vòng focus trắng trên nút bánh răng ở thanh trên trong lúc hộp `PAUSED` đang mở. Chưa persona nào chạm tới |
| Hỗ trợ gamepad | FR-15 | thấp | rẻ nhờ ADR-0005, nhưng khó test tự động |
| PWA / chơi được khi offline | NFR-PERF-05 | thấp | game đã là tĩnh và client-only nên gần như chỉ cần thêm service worker |

## Nợ kỹ thuật — cố ý làm tạm
**Hoãn R-04 (`ghosts/`) vì tầng view không có test hành vi** (2026-09-11, ADR-0015).
`views/Play/index.tsx` giữ một `useEffect` gửi kết quả ván lên bảng điểm, kèm khoá
`savedRunRef` chống gửi trùng. Đó là ứng viên `ghosts/SubmitFinishedRun`. Chưa tách vì
12 file test của repo đều ở `engine/` `storage/` `audio/` `i18n/` `input/` `render/`
`runtime/`, và repo **không có E2E** — nên không gì bắt được lỗi đổi thứ tự effect.
Cũng hoãn R-12/R-21: repo chưa có ESLint (không config, không deps, không script).
**Buộc phải trả khi:** có test render cho `views/Play` hoặc một bộ E2E; lúc đó tách
ghost và dựng ESLint, mỗi việc một commit riêng.


| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Pass fix UX 2026-09-12 làm trên branch **tại chỗ**, không worktree | Lệch quy trình worktree của `.claude/CLAUDE.md`, lần thứ hai | `.gitignore` của pass này **mở ignore cho `.claude/agents/`**, tức là track thêm file trong `.claude/`. Trong worktree thì `.claude/` là một **bản COPY chỉ đọc** (ADR-0007) — commit file mới từ trong đó là commit bản copy, đúng thứ ADR-0007 cấm. Nên phần cài skill **buộc** phải commit từ checkout gốc; tách riêng phần `src/` sang worktree thì chia một thay đổi logic thành hai checkout mà không được gì | Pass sau có code mà **không** đụng `.claude/` thì quay lại dùng worktree |
| 4/8 phát hiện của review được fix, 4 còn lại vào §Việc tiếp theo | F4/F6/F7 và lỗi thiếu `Số hàng` ở khổ 375 chưa sửa | Ba cái đầu là **quyết định thiết kế**, không phải lỗi hiện thực: F4 dời đi thì phá một quyết định đã có số đo (MASTER.md §7), F6 cần một pass layout có cổng mockup, F7 là đánh đổi thị giác. Cái thứ tư cần quyết định **bỏ gì** khỏi thanh trên ở khổ 375. Nhồi chúng vào một pass fix là quyết thiết kế trong lúc đang sửa bug | Lần chạy persona sau, khi có p02/p04 xác nhận mức khó chịu thật ở khổ điện thoại |
| Chữ trong hàng chờ ở khổ 375 vẽ ở **7px** | Sàn của `Math.max(7, cell * 0.6)` với `cell = 9` | Đây là chữ nhỏ nhất trong sản phẩm. Coi là **nhãn trên đối tượng đồ hoạ** thì hợp, coi là chữ thì không thoả `NFR-A11Y-01` | Có người chơi báo không đọc được → tăng `cell` của hàng chờ ở khổ nhỏ, **không** tăng cỡ chữ trong ô |
| `@types/node` thiếu trong `node_modules` dù có trong `devDependencies` | Đã cài bằng `npm install --no-save`, **không** sửa nguyên nhân | `tsc` không chạy được nếu thiếu nó, nên cả `npm run typecheck` lẫn `.githooks/pre-commit` đều vỡ. Đây là lỗi môi trường có trước pass này, không phải lỗi code | Lần `npm ci` sạch tiếp theo — nếu vẫn thiếu thì là lỗi lock file, phải điều tra |
| `.githooks/pre-commit` gọi `yarn typecheck` | Repo dùng **npm** (ADR-0001), và `yarn.lock` đã bị xoá ở `8dbd9b0` | Chạy được vì yarn 1.22.19 có sẵn global trên máy này. Trên máy chỉ có npm thì hook vỡ âm thầm | Đổi thành `npm run typecheck` — một chữ, nhưng thuộc pass về toolchain, không thuộc pass fix UX |
| `docs/02-requirements/nfr.md` — NFR-PERF-01, 04, 05 | Ba con số là **ngân sách tự chọn, chưa đo**: 8ms/frame, 200KB gzip, 2s trên 3G | Chưa có bản build nào để đo. Bỏ trống thì file bị bỏ qua âm thầm; viết số như đã đo thì là số bịa | Ngay sau bản build đầu tiên của `core-gameplay` |
| Pass nền móng làm trên branch tại chỗ, **không** dùng worktree | Lệch quy trình worktree của `.claude/CLAUDE.md` | Worktree không có `.claude/` (bị gitignore) nên sẽ mất cả skill lẫn 4 hook — mất nhiều hơn được cho một pass chỉ sửa tài liệu | Khi giải xong dòng đầu của §Việc tiếp theo, và bắt buộc trước khi có code |
| `docs/02-requirements/nfr.md` — NFR-PERF-01, 02, 03, 05 | Bốn ngưỡng vẫn là ngân sách **chưa đo**: frame budget, input latency, cấp phát hot path, thời gian tải | Cần Performance panel, heap snapshot và Lighthouse — mỗi thứ một phiên riêng, và cần một bàn chơi đã xếp cao mới đo có nghĩa | Trước khi tăng độ khó (thêm mode) hoặc khi có báo cáo rớt frame |
| `src/render/canvas.ts` — `draw()` | Vẽ 200 `fillRect` nền well mỗi frame trước khi blit ô | Đơn giản và đúng; chưa đo thấy vượt ngân sách | Ngay khi `NFR-PERF-01` được đo thật và thiếu ngân sách — cách thay là chỉ vẽ ô đã đổi |
| `docs/specs/core-gameplay/design.md` §1 vs `plan.md` | `design.md` nói scope là FR-01→FR-22 nhưng `plan.md` không có task cho FR-17 | Phát hiện lúc cập nhật `scope.md`, sau khi code đã xong | Đã trả một nửa: FR-17 chuyển sang feature 3. Bài học: đối chiếu danh sách FR của `design.md` với danh sách task của `plan.md` **trước** khi bắt đầu code |

### Không có test component nào

`package.json` không có `@testing-library/*`; 12 file test hiện chỉ phủ
`engine/` · `storage/` · `i18n/`. Hệ quả đo được ở feature `stats-highscores`: hai
review subagent tìm ra 15 lỗi — trong đó có một lỗi xếp điểm vào **bảng độ khó sai**,
một lỗi làm **trắng cả app** vì một dòng dữ liệu hỏng, một bẫy focus vỡ, và một dialog
tràn khỏi viewport không bấm được ở khổ điện thoại nằm ngang — mà **toàn bộ 218 test
vẫn xanh và typecheck vẫn sạch**.

Phần logic thuần đã được khoá lại bằng test (222 test). Phần UI thì hiện có **ba** lưới
an toàn: đọc review, mở app thật ra xem, và từ 2026-09-12 là skill `ux-persona-review`
(ADR-0016) — 10 Red Route chạy bởi 6 persona mô phỏng. **Không một cái nào chạy trong
CI**, và cái thứ ba là proto-persona nên nó bắt vấn đề giao diện chứ không chứng minh
được ai là người dùng thật.

**Vì sao vẫn hoãn:** thêm `@testing-library` là một quyết định về hạ tầng test, không
phải một phần của feature này; làm kèm sẽ trộn hai thứ trong một PR.
