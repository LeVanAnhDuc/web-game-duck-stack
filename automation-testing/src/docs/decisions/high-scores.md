# HIGHSCORES — Quyết định

Đi cặp với `docs/requirements/high-scores.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-32…FR-34), `docs/specs/stats-highscores/design.md`, `docs/decisions/0014-per-difficulty-score-boards-and-local-nickname.md`, `docs/02-requirements/nfr.md` (NFR-SEC-03, NFR-I18N-02/03), `docs/01-product/overview.md` §Non-Goals (không bảng xếp hạng server).
- **Code:** `client/src/views/Play/mains/HighScoresScreen/index.tsx`, `client/src/scores/index.tsx`, `client/src/scores/types.ts` (`MAX_PER_BOARD` 10, `MAX_NICKNAME` 16, `migrateScores`), `client/src/storage/scores.ts`.

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Ngày giờ phụ thuộc múi giờ máy: spec đặt `timezoneId: "UTC"`. Chuỗi mong đợi là định dạng `Intl` ngắn của `en` (`7/9/26, 2:30 PM`) và `vi` (`14:30 9/7/26`).
- **Q2** Bảng có sẵn được seed thẳng vào `localStorage` trước khi app tải (`GamePage.goto({ scores })`) thay vì chơi đủ 12 ván.
- **Q3** Ô tên được ghi sau khi đứng yên ~400ms (debounce): test đẩy đồng hồ 1 giây trước khi đọc storage.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Đồng bộ điểm lên Ducker ID / server: Non-Goal (overview.md §4).

## Tech debt liên quan

_(không có)_
