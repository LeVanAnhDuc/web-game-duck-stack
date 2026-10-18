# SCORING — Điểm xoá hàng, cấp độ, combo, back-to-back, Time và PPS

Truy vết phía app: FR-10, FR-11, FR-20, FR-21, FR-31, FR-41 · US-01 · NFR-I18N-03.

- **REQ-SCORING-01** Xoá hàng cộng điểm theo bảng Guideline nhân với cấp lúc xoá: 1 hàng 100, 2 hàng 300, 3 hàng 500, 4 hàng (tetris) 800; Lines tăng đúng số hàng.
- **REQ-SCORING-02** Cứ đủ 10 hàng thì lên một cấp (cấp 1 → 2 ở hàng thứ 10).
- **REQ-SCORING-03** Xoá hàng ở các khối liên tiếp là combo: HUD hiện `Combo ×n` và cộng thêm 50 × n × cấp; một khối không xoá hàng thì combo tắt và dòng Combo biến mất.
- **REQ-SCORING-04** Tetris (hoặc T-spin) bật back-to-back: HUD hiện dòng Back-to-back; lần xoá đủ điều kiện kế tiếp được nhân 1,5.
- **REQ-SCORING-05** Time đếm thời gian chơi dạng `mm:ss`; PPS là số khối đã đặt chia số giây chơi, hai chữ số thập phân.
