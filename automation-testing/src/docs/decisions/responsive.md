# RESPONSIVE — Quyết định

Đi cặp với `docs/requirements/responsive.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/design-system/tetris/MASTER.md` §6 (bảng 375 / 768 / 1024 / 1440), §7 (hộp thoại bị chặn chiều cao: đo ở 1396×581 và 667×375), `docs/02-requirements/nfr.md` (NFR-A11Y-03).
- **Code:** `client/src/styles/tokens.css` (media query 768 / 1024), `client/src/hooks/useGameSession.ts` (`fitBoard`).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Chỉ kiểm các chiều rộng tài liệu cam kết (375 / 768 / 1024 / 1440). Ở 320px hàng Next tràn 8px gây cuộn ngang — 320 không có trong tài liệu nào nên không ghi bug; nếu sau này cam kết 320 thì thêm TC.
- **Q2** Vị trí nút trong hộp thoại đo bằng khung bố cục (`boundingBox`), không bằng `toBeInViewport()`: IntersectionObserver chờ khung hình mà đồng hồ giả đang dừng không phát.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Thẩm mỹ, khoảng cách theo lưới: review thiết kế, không phải hồi quy.

## Tech debt liên quan

_(không có)_
