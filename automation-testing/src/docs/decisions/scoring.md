# SCORING — Quyết định

Đi cặp với `docs/requirements/scoring.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-10, FR-11, FR-20, FR-21, FR-31, FR-41), `docs/specs/core-gameplay/design.md` (bảng điểm Guideline), `docs/01-product/glossary.md`, `README.md` §Features ("Guideline scoring including T-spin and T-spin mini, combo, back-to-back and perfect clear").
- **Code:** `client/src/engine/scoring.ts`, `client/src/views/Play/index.tsx` (rail trái: Time, PPS, Back-to-back, Combo), `client/src/views/Play/components/AnimatedNumber/index.tsx` (điểm đếm dần ~260ms).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Điểm mong đợi tính từ bảng Guideline trong REQ-SCORING-01 cộng điểm thả (2/ô, FR-07, số ô rơi của từng khối ghi trong `PLAN_*.cells`) — không lấy từ engine.
- **Q2** Combo: điểm của lần xoá thứ hai liên tiếp tính ở cấp **trước** khi lên cấp (hàng thứ 10 làm lên cấp 2, nhưng lần xoá đó vẫn nhân cấp 1). Khớp Guideline và code; ghi lại để không ai "sửa" kỳ vọng.
- **Q3** Trước khi đọc điểm luôn `settle()` (đẩy đồng hồ 600ms): HUD đăng lại ~10 lần/giây và số điểm đếm dần.
- **Q4** Thời gian giả chạy chậm hơn thời gian thật khi đẩy xa (mỗi khung hình vẫn được vẽ), nên TC-SCORING-006 chỉ đẩy ~30 giây.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- T-spin, T-spin mini, perfect clear (FR-19, FR-22): cần dựng thế cờ riêng; luật phủ bằng unit test `client/src/engine/game.test.ts`, `parts.test.ts`.
- Rung bàn khi tetris, nháy hàng, vệt thả (FR-37…FR-40): chỉ có trên canvas; phủ bằng `client/src/render/effects.test.ts`.

## Tech debt liên quan

_(không có)_
