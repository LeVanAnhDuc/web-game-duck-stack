# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-A11Y-02…06), `docs/02-requirements/scope.md` (FR-26), `docs/decisions/0017-mot-nguon-su-that-cho-mat-o-va-cho-tam-dung-dialog.md`, `docs/design-system/tetris/MASTER.md`.
- **Code:** `client/src/views/Play/mains/SettingsScreen/index.tsx` + `HighScoresScreen/index.tsx` (bẫy focus, Esc, trả focus), `client/src/input/keyboard.ts` (`enabled()`, bỏ qua phím từ hộp thoại), `client/src/views/Play/components/PiecePreview/index.tsx` (`cellFace`), `AnimatedNumber`.

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Tương phản màu (NFR-A11Y-01) không đo ở E2E: cần công cụ đo màu; ghi ngoài phạm vi.
- **Q2** Reduced motion kiểm ở điểm số (DOM). Hiệu ứng trên canvas thu về trạng thái tức thì là việc của renderer (`client/src/render/effects.test.ts`).

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Tương phản chữ ≥ 4.5:1 (NFR-A11Y-01): đo tay bằng devtools theo nfr.md.

## Tech debt liên quan

_(không có)_
