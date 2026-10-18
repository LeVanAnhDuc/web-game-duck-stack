# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/decisions/0011-ci-release-and-pages.md`, `docs/01-product/overview.md` §4 (không backend, không bảng xếp hạng server), `docs/design-system/tetris/MASTER.md` (font Space Grotesk + IBM Plex Mono từ Google Fonts), `README.md` §Releases.
- **Code:** `.github/workflows/deploy.yml` (`VITE_BASE_PATH=/<repo>/`), `client/vite.config.ts`, `client/index.html` (link Google Fonts).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Font từ `fonts.googleapis.com` / `fonts.gstatic.com` là chủ ý thiết kế (MASTER.md) và không mang dữ liệu người chơi → được loại trừ; mọi host khác là lỗi.
- **Q2** Môi trường dev phục vụ bản production build ở `http://127.0.0.1:4173/web-game-duck-stack/` để base path giống hệt Pages.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Hoạt động offline sau lần tải đầu (overview.md §1): không có service worker; không cam kết thành FR.

## Tech debt liên quan

_(không có)_
