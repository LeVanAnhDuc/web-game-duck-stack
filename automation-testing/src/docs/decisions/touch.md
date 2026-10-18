# TOUCH — Quyết định

Đi cặp với `docs/requirements/touch.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-16), `docs/02-requirements/nfr.md` (NFR-A11Y-03 "11/11 ở màn chơi và 24/24 trong màn Cài đặt"), `docs/design-system/tetris/MASTER.md` §6.
- **Code:** `client/src/views/Play/index.tsx` (`PadButton`, `.touchband`), `client/src/input/touch.ts` (pointerdown = press, pointerup = release).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Project `app-touch` dùng thiết bị Pixel 5 (touch thật, 393px). Chạm bằng `locator.tap()`.
- **Q2** TC-TOUCH-003 chơi lại 5 khối đầu của `PLAN_LINES` bằng nút cảm ứng: hoàn thành cùng một hàng như bàn phím là bằng chứng di chuyển và xoay đúng.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Giữ nút cảm ứng để tự lặp (DAS trên cảm ứng): cùng cơ chế press/release với bàn phím, phủ bằng TC-GAMEPLAY-008 và unit test.

## Tech debt liên quan

_(không có)_
