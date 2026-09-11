# ADR-0016 · Review UX bằng dàn persona mô phỏng, cài từ máy phát ở workspace

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-01 → NFR-A11Y-06 · NFR-I18N-03 · ADR-0007 · ADR-0008 · ADR-0014

## 1. Bối cảnh

Tầng UI của repo này **không có lưới an toàn tự động nào**. 222 test phủ `engine/`
`storage/` `audio/` `i18n/` `input/` `render/` `runtime/`; không có `@testing-library`,
không có E2E (`04-state/backlog.md` §Không có test component nào). Hệ quả đã đo được ở
feature `stats-highscores`: hai review subagent tìm ra 15 lỗi — trong đó một lỗi xếp
điểm vào **bảng độ khó sai**, một lỗi **trắng cả app** vì một dòng dữ liệu hỏng, một
bẫy focus vỡ, và một dialog tràn khỏi viewport ở khổ điện thoại nằm ngang — mà toàn bộ
test vẫn xanh và `tsc` vẫn sạch.

Thêm vào đó, ba ngưỡng a11y quan trọng nhất ở `nfr.md` có cách kiểm là **"thử tay"**
hoặc **"review mockup"**: `NFR-A11Y-03` (vùng bấm ≥ 44×44px), `NFR-A11Y-06` (7 khối
phân biệt được khi không dùng màu — căng nhất, vì ADR-0008 làm màu thành kênh **duy
nhất** phân loại khối), và tiêu chí thành công §6.3 của `overview.md` (đổi được keybind
+ DAS/ARR trong dưới 60 giây mà không đọc hướng dẫn). Cả ba **chỉ đo được bằng người**.

Workspace có một máy phát skill dùng chung: `.claude/skills/ux-persona-lab` ở
`D:/Learn/web-app-ecosystem`.

## 2. Quyết định

Cài `ux-persona-review` vào repo này bằng `ux-persona-lab/scripts/install.sh`, gồm:
`.claude/skills/ux-persona-review/` (SKILL.md đã điền + `lib/` cơ học + `references/`
riêng của project) và **hai agent** `.claude/agents/ux-persona.md` · `ux-expert.md`.

Ba thứ thuộc project này, không thuộc máy phát, và là thứ quyết định chất lượng mọi lần
chạy:

- **`references/red-routes.md`** — 10 route `live` + 3 route `planned`. `planned` bị
  loại khỏi mọi lượt chạy: RR-11 Sprint/Ultra và RR-13 so điểm với người khác chưa có
  giao diện, nên chạy chúng chỉ sinh ra báo cáo toàn "không dùng được".
- **`references/personas/`** — 6 người, **cố định giữa các lần chạy**. Hai persona tiếp
  cận (mù màu; viêm khớp dạng thấp), đúng một negative, một người dùng điện thoại 3G.
- **`references/persona-rules.md`** — rule đã fetch 2026-09-12, kèm bảng ghi rõ nguồn
  nào trả 403 và nguồn nào chỉ lấy được gián tiếp.

**`min_steps` ở đây đếm thao tác giao diện, không đếm nước đi khối.** Thứ tự khối do
7-bag sinh theo seed (FR-03) nên số nước tối ưu đổi theo từng ván; một mẫu số đổi theo
ván thì không so được giữa các persona.

**Token thiết kế truyền cho `ux-expert` là `docs/design-system/tetris/MASTER.md`**, không
phải `.claude/uiux/` như mặc định của máy phát — thư mục đó không tồn tại ở đây.

**`.gitignore` mở ignore cho `.claude/agents/`**, cùng nhóm với `skills/` và `scripts/`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Dựng `@testing-library` + E2E thay vì việc này | Cần, và vẫn nợ — nhưng nó gác **hồi quy trên đường đi đã biết**. Nó không trả lời được "người lạ có tự mò ra chế độ không dùng màu không", vốn là câu `NFR-A11Y-06` và §6.3 đang hỏi. Hai thứ khác việc nhau, không thay nhau |
| Tự viết skill review UX riêng cho repo này | Máy phát đã có `lib/` qua 117 test và LIB_VERSION 3, kèm đường nâng cấp `--update`. Viết lại là nhận nợ bảo trì để đổi lấy đúng ba chỗ lệch đã ghi trong `SKILL.md` |
| Giữ `.claude/agents/` local như trước | Skill được commit mà agent thì không = skill chạy không được trên clone mới hoặc trong worktree. Claude Code chỉ báo "không tìm thấy agent type", và **không có cách nào sinh lại từ trong repo này** — `install.sh` nằm ở workspace, ngoài repo |
| Chạy cả 13 Red Route, kể cả `planned` | Ba route đó không có UI. Báo cáo sẽ toàn phát hiện "không làm được", trộn lẫn với phát hiện thật |
| Persona sinh mới mỗi lần chạy cho "đa dạng" | Mất khả năng so sánh trước/sau khi sửa — thứ đắt nhất mà skill này tạo ra |
| Đưa profile Ashleigh (screen reader) vào dàn a11y | Bàn chơi là một `<canvas>` có `aria-label` tĩnh. Không ai chơi Tetris bằng screen reader; phiên đó chỉ sinh ra một phát hiện đã biết trước và chiếm chỗ của phiên mù màu |

## 4. Hệ quả

**Được:**

- Ba ngưỡng chỉ đo được bằng người (`NFR-A11Y-03`, `NFR-A11Y-06`, §6.3) có một cách
  kiểm lặp lại được, thay vì "thử tay" một lần rồi quên.
- `NFR-I18N-01`/`03` được một persona đọc từng chữ trên màn hình nhỏ — cách bắt chuỗi
  hardcode sót rẻ nhất, vì test key chỉ so hai file locale với nhau chứ không thấy chuỗi
  viết thẳng trong JSX.
- Dàn cố định 6 người cho phép **so sánh trước/sau** một lần sửa UI.

**Mất / phải chấp nhận:**

- Dàn này là **proto-persona** theo phân loại của NN/g: dựng từ giả định, không từ
  phỏng vấn. Nó bắt được vấn đề giao diện; nó **không** chứng minh được ai là người
  dùng thật. Báo cáo nào kết luận "người chơi của chúng ta muốn X" là đọc sai công cụ.
- Mô phỏng khuyết tật **không** thay thế người dùng thật. GOV.UK nói thẳng: *"A
  simulation is never a true representation of an impairment."*
- Mỗi lần chạy tốn 12 phiên trình duyệt (10 route `live` + 2 phiên mù), tối đa 4 phiên
  song song. Đây không phải thứ chạy trong CI và cũng không nên là.
- `red-routes.md` giờ là **tài liệu thứ tư** phải cập nhật khi thêm chức năng, sau
  `scope.md`, `nfr.md` và `overview.md` §Non-Goals. Route mới mà không cấp `RR-xx` thì
  chức năng đó không bao giờ được persona nào chạm tới.

**Điều kiện xem lại quyết định này:** khi repo có E2E thật (lúc đó cân lại route nào nên
để cho máy chạy và route nào vẫn cần người), hoặc khi `lib/` của máy phát lên phiên bản
làm ba chỗ lệch ở `SKILL.md` thành không cần thiết.
