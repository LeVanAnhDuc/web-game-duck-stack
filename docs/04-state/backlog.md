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

Phần logic thuần đã được khoá lại bằng test (222 test). Phần UI thì hiện chỉ có hai
lưới an toàn: đọc review, và mở app thật ra xem. Cả hai đều không chạy trong CI.

**Vì sao vẫn hoãn:** thêm `@testing-library` là một quyết định về hạ tầng test, không
phải một phần của feature này; làm kèm sẽ trộn hai thứ trong một PR.
