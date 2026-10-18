# GAMEOVER — Quyết định

Đi cặp với `docs/requirements/game-over.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-12, FR-31, FR-32), `docs/01-product/journeys.md` (US-03), `docs/specs/stats-highscores/design.md`, `docs/decisions/0014-per-difficulty-score-boards-and-local-nickname.md`.
- **Code:** `client/src/views/Play/index.tsx` (`GameOverModal`, effect ghi điểm theo `runId`), `client/src/scores/index.tsx` (`submit`, `isWorthSaving`), `client/src/engine/game.ts` (block out / lock out).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Cách hết ván: thả tức thì liên tục cho tới khi hộp Game over hiện (`GamePage.topOut()`); luôn là block out. Lock out (khối chốt hẳn trên vùng nhìn thấy) cần thế cờ riêng → chỉ unit test.
- **Q2** Sau khi hết ván focus ở Play again, nên Space của người chơi sẽ bấm nút đó (chơi lại) — hành vi của nút có focus, không phải bug. TC-GAMEOVER-006 bỏ focus trước khi bấm phím để kiểm chính game.
- **Q3** "Lưu đúng một lần" kiểm bằng `tetris.scores.v1` sau 3 giây thời gian giả (HUD đăng lại nhiều lần trong khoảng đó).

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Lý do lock out ("A piece came to rest above the field."): unit test `client/src/engine/game.test.ts`.

## Tech debt liên quan

_(không có)_
