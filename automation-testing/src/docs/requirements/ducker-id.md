# DUCKERID — Đăng nhập Ducker ID tùy chọn

Truy vết phía app: FR-45 · US-04 · ADR-0018 · overview.md §4.

- **REQ-DUCKERID-01** Bản deploy tắt cờ: không có nút đăng nhập, không có menu tài khoản, không có request nào tới Ducker ID.
- **REQ-DUCKERID-02** Bật cờ và chưa đăng nhập: thanh trên có nút "Sign in" bấm được.
- **REQ-DUCKERID-03** Sign in chuyển sang `/oauth/authorize` của Ducker ID với `response_type=code`, đúng `client_id`, `redirect_uri` = gốc app, PKCE `S256` và `state`; quay về với `code` + `state` khớp thì đổi code lấy token bằng `code_verifier` (không `client_secret`), lấy userinfo, xoá tham số callback khỏi thanh địa chỉ và hiện nút avatar "Ducker ID account".
- **REQ-DUCKERID-04** Menu tài khoản hiện tên, email và link "Open Ducker ID profile" tới trang hồ sơ trên Ducker ID (tab mới); focus vào nút đóng; Esc đóng và trả focus về avatar, không lọt thành phím tạm dừng.
- **REQ-DUCKERID-05** Sign out quên hồ sơ trong bộ nhớ, đưa về nút "Sign in" (có focus) mà không tải lại trang.
- **REQ-DUCKERID-06** Ducker ID trả lỗi (người dùng từ chối) hoặc `state` không khớp thì không gọi token và vẫn chưa đăng nhập.
