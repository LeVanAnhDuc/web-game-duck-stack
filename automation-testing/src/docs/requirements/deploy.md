# DEPLOY — Bản build tĩnh trên GitHub Pages

Truy vết phía app: ADR-0011, ADR-0018 · overview.md §4 (không backend) · NFR-REL-05.

- **REQ-DEPLOY-01** Bản build chạy dưới base path `/web-game-duck-stack/` (như GitHub Pages): mọi tài nguyên tải được (không 4xx/5xx), tiêu đề trang "Duck Stack".
- **REQ-DEPLOY-02** Chơi trọn một ván không gửi dữ liệu đi đâu: ngoài font Google (stylesheet + file font) không có request tới host khác, và không có request ghi (chỉ GET).
- **REQ-DEPLOY-03** Từ lúc mở trang, qua Cài đặt, tới hết ván và chơi lại không có lỗi JavaScript hay lỗi console.
