# Nguồn requirement của Duck Stack

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ docs: tài liệu nào trả lời câu hỏi gì, đang ở trạng thái nào
- `../docs/01-product/overview.md` — định vị, Non-Goals (không bảng xếp hạng server, không tài khoản riêng của game)
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-04
- `../docs/01-product/glossary.md` — thuật ngữ ↔ tên trong code ↔ tên trên UI
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-45 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng phi chức năng (hiệu năng, a11y, i18n, độ bền lưu trữ, bảo mật)
- `../docs/03-design/invariants.md` — những gì hỏng im lặng (tất định, vòng lặp, tạm dừng)
- `../docs/03-design/architecture.md` — ranh giới module, luồng dữ liệu, chỗ lưu trữ
- `../docs/decisions/` — ADR-0001…ADR-0018 (vì sao từng hành vi như vậy, vd ADR-0017 tạm dừng khi mở hộp thoại, ADR-0018 đăng nhập Ducker ID)
- `../docs/specs/<feature>/design.md` — thiết kế từng feature đã ship (core-gameplay, settings, stats-highscores, animation)
- `../README.md` — mục Features và Controls (lời hứa với người chơi)

## Code

- `../client/src/views/Play/` — màn chơi, HUD, các hộp thoại (tạm dừng, kết thúc, cài đặt, điểm cao, tài khoản)
- `../client/src/i18n/en.json`, `../client/src/i18n/vi.json` — text UI nguyên văn
- `../client/src/settings/`, `../client/src/storage/`, `../client/src/scores/` — thiết lập, lưu `localStorage`, bảng điểm
- `../client/src/engine/` — luật chơi (tính điểm, cấp độ, hold, kết thúc lượt)
- `../client/src/input/`, `../client/src/runtime/`, `../client/src/hooks/` — bàn phím, cảm ứng, vòng lặp, tự tạm dừng
- `../client/src/auth/` — đăng nhập Ducker ID tùy chọn (sau cờ)
- `../client/vite.config.ts`, `../.github/workflows/deploy.yml` — base path và bản deploy

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — kế hoạch thi công, không phải hành vi
- `../docs/ux-reviews/` — nhật ký review persona đã xử lý (lịch sử)
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã hứa
- unit test `../client/src/**/*.test.ts(x)` — gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
