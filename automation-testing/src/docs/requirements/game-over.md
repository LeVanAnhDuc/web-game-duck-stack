# GAMEOVER — Hết ván, chỉ số cuối ván, chơi lại

Truy vết phía app: FR-12, FR-31, FR-32 · US-01, US-03.

- **REQ-GAMEOVER-01** Chồng khối chạm đỉnh (khối mới không còn chỗ sinh) thì hết ván: hộp Game over báo lý do ("The stack reached the top.").
- **REQ-GAMEOVER-02** Hộp Game over hiện Score, Lines, Level, Time, PPS của ván, khớp HUD; focus vào Play again.
- **REQ-GAMEOVER-03** Play again bắt đầu ván mới từ 0 và phím lại điều khiển được khối.
- **REQ-GAMEOVER-04** Ván vừa hết (có điểm hoặc có hàng) được lưu đúng một lần vào bảng điểm cao của độ khó lúc ván bắt đầu.
- **REQ-GAMEOVER-05** High scores mở từ hộp Game over đánh dấu dòng của ván vừa chơi và có nút Play again.
- **REQ-GAMEOVER-06** Sau khi hết ván, phím chơi không thay đổi điểm hay trạng thái.
