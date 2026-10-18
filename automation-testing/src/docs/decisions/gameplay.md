# GAMEPLAY — Quyết định

Đi cặp với `docs/requirements/gameplay.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-01…FR-07, FR-09, FR-15), `docs/01-product/journeys.md` (US-01), `docs/specs/core-gameplay/design.md` (bảng phím, 7-bag, hold), `docs/decisions/0005-compute-das-arr-inside-engine.md`, `README.md` §Features + §Controls.
- **Code:** `client/src/views/Play/index.tsx` (HUD, Hold/Next, footer), `client/src/views/Play/components/PiecePreview/index.tsx`, `client/src/settings/types.ts` (`DEFAULT_BINDINGS`), `client/src/input/keyboard.ts`, `client/src/engine/game.ts`, `client/src/engine/timing.ts` (sàn soft drop 1/3 ô/tick).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Bàn chơi là `<canvas>`: test không đọc pixel. Vị trí khối được chứng minh gián tiếp qua kết quả có thể thấy trong DOM (Lines/Score tăng khi các khối đặt đúng chỗ hoàn thành một hàng), loại khối qua chữ cái ở Hold/Next khi bật chế độ không dựa vào màu.
- **Q2** Chuỗi khối cố định bằng đồng hồ giả: seed của ván là `Date.now()` lúc dựng phiên, `GamePage.goto()` cài `page.clock` ở mốc `START` và dừng ở `START + 1000`, nên ván luôn mở bằng I rồi O T S J Z (đọc từ app đang chạy, ghi ở `data/test-data.ts` `OPENING`).
- **Q3** Kế hoạch phím (`PLAN_LINES`, `PLAN_TETRIS`) được tính một lần ngoài suite bằng một bộ xếp khối tham lam trên cùng seed và ghi lại như dữ liệu; spec chỉ chứng minh kết quả trên màn hình. Chạy ở tốc độ Custom chậm nhất (0,25 ô/giây) để trọng lực không kéo khối trong lúc bấm phím.
- **Q4** Soft drop ở tốc độ chậm nhất chạy theo sàn 20 ô/giây (`timing.ts`), nên test giữ ↓ 1,2 giây — đủ cho khối I rơi hết 20 hàng mà chưa sang khối sau — rồi chờ lock delay.
- **Q5** Bấm Esc/P khi hộp Paused đang mở (focus ở Resume) không tiếp tục ván: bàn phím của game bỏ qua phím phát ra từ trong hộp thoại (`keyboard.ts` `isFormControl`), và Resume có focus nên Enter/Space tiếp tục ván. Đây là hành vi đã ship, không mâu thuẫn tài liệu (README chỉ ghi `Esc` = Pause) — không ghi bug; xem `pause.md`.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Wall kick SRS, lock delay với move reset tối đa 15 lần, T-spin: luật trong engine thuần, phủ bằng unit test `client/src/engine/*.test.ts` (đối chiếu bảng kick đã công bố). E2E không nhìn được canvas để kiểm từng kick.
- Hình bóng điểm đáp (ghost, FR-06), replay (FR-18): chỉ thấy trên canvas / không có UI.

## Tech debt liên quan

_(không có)_
