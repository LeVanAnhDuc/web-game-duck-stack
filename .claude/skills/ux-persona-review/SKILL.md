---
name: ux-persona-review
description: Use when you want to know how a real stranger experiences Duck Stack — dispatches blind persona subagents that actually drive the running app in a browser, captures their first five seconds and their gut reaction, then returns UX/UI findings mapped to ISO 9241-11, LATCH, trigger words, interaction design, visual hierarchy, form design, visual craft and trust/desirability, every finding backed by a quote or a screenshot from a session log. Trigger on "chay persona", "test UX", "nguoi dung that thay sao", "UI co dep khong", "an tuong dau", "UX review", "red route", or before opening a PR that changes user-facing behaviour.
---

# Duck Stack — UX persona review

## Sản phẩm này

- Thư mục: `D:/Learn/web-app-ecosystem/web-game/web-game-tetris`
- Port: **5173** (Vite mặc định — `vite.config.ts` không khai `server.port`, nên nếu 5173 đã bị
  chiếm thì Vite tự nhảy sang 5174+ và in port thật ra terminal; lấy theo dòng đó, đừng đoán)
- Bật app: `npm run dev` (repo dùng **npm**, không phải Yarn — ADR-0001)
- Dấu hiệu nhận biết đúng app: `<title>` là **Duck Stack**, nền tối `#0E0F13`, và trên trang có
  một **bàn chơi 10×20 vẽ bằng `<canvas>`** kèm ô `Hold` / `Next`, thanh HUD `Score · Lines ·
  Level`. Không có form đăng nhập, không có ô email ở bất kỳ đâu. Thấy trang có nút đăng nhập
  hoặc danh sách link/CV là **sai app**.
- Email dùng-một-lần cho persona: **không áp dụng** — game không có đăng ký, không có email.
  Chỗ duy nhất nhận chữ người dùng nhập là ô `Display name` ở bảng điểm cao (FR-34), và nó
  **không phải tài khoản** (`scores.nicknameHint`).
- Tài khoản thử: **không áp dụng** — không có hệ thống tài khoản (overview §Non-Goals, ADR-0004).
  Không Red Route nào đi qua đăng nhập.

## Khác biệt của project này so với mặc định của máy phát

Ba chỗ lệch, đọc trước khi chạy:

1. **Token thiết kế không ở `.claude/uiux/`.** `lib/orchestration.md` bước 5 dặn tìm thư mục đó;
   ở đây nó không tồn tại. Đường dẫn phải truyền cho `ux-expert` qua `{{UIUX_TOKENS_PATH}}` là
   **`docs/design-system/tetris/MASTER.md`** — đó là output của skill `design-bootstrap`, và nó
   thắng cảm nhận thẩm mỹ chung đúng như luật của `lib/frameworks.md`.
2. **Thước "dám nhập email" trong bảng ấn tượng đầu không áp dụng.** Không có ô email nào để
   dám hay không dám. Ghi thẳng "không áp dụng" vào ô đó, **đừng** thay bằng một thước khác tự
   nghĩ ra. Hai thước còn lại (đoán đúng trang này là gì · ba từ trước → ba từ sau) vẫn tính
   trên toàn bộ persona. Riêng thước "đoán đúng" ở đây gắt hơn bình thường: trang mở ra là
   **vào ván luôn**, không có màn hình chờ nào để giải thích nó là gì.
3. **Lăng kính Form design gần như không có đất.** Toàn bộ "form" của app là màn `Settings` và ô
   `Display name`. Không tìm thấy gì thì ghi là không có, đừng bịa phát hiện cho đủ tám lăng kính.

## Chạy

Toàn bộ quy trình nằm ở `lib/orchestration.md`. Đọc nó trước, rồi làm theo.

Dữ liệu riêng của sản phẩm này:

| Cần gì | Ở đâu |
| --- | --- |
| Red Route đã chốt | `references/red-routes.md` |
| Dàn persona | `references/personas/` |
| Rule đã dùng để sinh persona | `references/persona-rules.md` |
| Khung đánh giá, luật xếp hạng | `lib/frameworks.md` |
| Thứ tự công cụ trình duyệt | `lib/browser-capability.md` |
| Token thiết kế (thay cho `.claude/uiux/`) | `docs/design-system/tetris/MASTER.md` |

## Báo cáo đi đâu ở project này

`lib/orchestration.md` nói: đang ở nhánh feature thì `docs/specs/<feature>/`, ngoài feature thì
`docs/ux-reviews/`. Cả hai đều đúng với layout tài liệu của project (`.claude/CLAUDE.md`
§Document layout) — `docs/ux-reviews/` là thư mục mới, không đụng tier 1 nào, cứ tạo khi cần.

Một phát hiện được xác nhận thì **không dừng ở báo cáo**: nó phải đi vào `docs/04-state/backlog.md`
§Việc tiếp theo, và nếu là chức năng chưa có ID thì cấp `FR` mới trong `docs/02-requirements/scope.md`.
Báo cáo là dẫn chứng, backlog là nơi việc thực sự tồn tại.

## Hai agent

`ux-persona` (Sonnet, chỉ có trình duyệt) đóng vai người dùng.
`ux-expert` (Opus, chỉ có Read) dịch log sang khung đánh giá.

Cả hai định nghĩa ở `D:/Learn/web-app-ecosystem/web-game/web-game-tetris/.claude/agents/`. Nếu
Claude Code báo không tìm thấy agent type, phiên hiện tại được mở trước khi hai file đó tồn tại —
khởi động lại phiên.

## Bảo trì

Nâng cấp phần logic: `bash D:/Learn/web-app-ecosystem/.claude/skills/ux-persona-lab/scripts/install.sh D:/Learn/web-app-ecosystem/web-game/web-game-tetris --update`
Lấy lại rule persona mới: cùng lệnh với `--refresh-rules`.
Cả hai đều **không** đụng tới `red-routes.md` và `personas/`.

`--update` **ghi đè** `lib/` và `.claude/agents/*.md`, nhưng **không** ghi đè file này — nên ba
chỗ lệch ở mục trên vẫn còn sau khi update. Đừng chuyển chúng vào `lib/`.
