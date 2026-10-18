# PAUSE — Quyết định

Đi cặp với `docs/requirements/pause.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-13, FR-14), `docs/02-requirements/nfr.md` (NFR-REL-01), `docs/decisions/0017-mot-nguon-su-that-cho-mat-o-va-cho-tam-dung-dialog.md`, `docs/03-design/invariants.md`.
- **Code:** `client/src/views/Play/index.tsx` (`PausedModal`, `openSettings`, `closeDialog`), `client/src/views/Play/dialogPause.ts`, `client/src/runtime/loop.ts` (`isHidden` → `onAutoPause`), `client/src/engine/game.ts` (lệnh `pause`).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Esc/P khi hộp Paused đang mở không tiếp tục ván (phím từ trong hộp thoại bị game bỏ qua, focus ở Resume) — cách tiếp tục bằng bàn phím là Enter trên Resume. Hành vi đã ship, không mâu thuẫn tài liệu → REQ-PAUSE-02 ghi Enter, không ghi bug.
- **Q2** Tab ẩn được giả lập bằng cách ghi đè `document.hidden` + bắn `visibilitychange` — đúng thứ `loop.ts` đọc mỗi khung hình.
- **Q3** Lệnh pause khi mở hộp thoại được áp ở khung hình kế tiếp. Với đồng hồ giả đang dừng, mở rồi đóng trong cùng một khung hình sẽ để lại ván ở trạng thái dừng; người thật không mở-đóng được trong 16ms nên đây không phải bug. Test luôn `settle()` sau khi mở.
- **Q4** "Ván dừng khi hộp thoại mở" được chứng minh bằng Time: 10 giây trôi qua dưới hộp thoại mà Time chỉ nhích ≤ 2 giây (phần chạy trước khi mở / sau khi đóng).

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Tạm dừng khi cửa sổ mất focus nhưng tab vẫn hiện (blur): code chỉ nghe `visibilitychange`, tài liệu không hứa blur.

## Tech debt liên quan

_(không có)_
