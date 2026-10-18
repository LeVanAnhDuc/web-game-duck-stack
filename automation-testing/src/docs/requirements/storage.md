# STORAGE — Lưu trữ hỏng hoặc bị chặn

Truy vết phía app: FR-30 · NFR-REL-02, NFR-REL-03, NFR-REL-05 · ADR-0004.

- **REQ-STORAGE-01** Thiết lập lưu bị hỏng (không parse được) thì game vẫn khởi động với mặc định, chơi được, và Cài đặt báo "Saved settings could not be read in full and were restored where possible."
- **REQ-STORAGE-02** `localStorage` bị chặn thì vẫn chơi trọn ván và đổi thiết lập trong phiên; Cài đặt và Điểm cao nói rõ không lưu được; không có lỗi JavaScript.
- **REQ-STORAGE-03** Bảng điểm lưu có dòng hỏng thì bỏ dòng hỏng, giữ dòng lành, và Điểm cao báo "Some saved data could not be read and was repaired…"
- **REQ-STORAGE-04** Giá trị thiết lập lưu ngoài miền hoặc sai kiểu thì về mặc định (kiểu sai) hoặc kẹp vào biên (số ngoài miền), không đổ cả bộ thiết lập.
