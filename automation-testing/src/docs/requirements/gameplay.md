# GAMEPLAY — Vào ván, khối, hàng chờ, Hold, rơi và phím mặc định

Truy vết phía app: FR-01…FR-07, FR-09, FR-15 · US-01 · ADR-0002, ADR-0005.

- **REQ-GAMEPLAY-01** Mở trang là vào ván ngay: bàn 10×20 (canvas có nhãn), Score 0, Lines 0, Level 1, đồng hồ Time bắt đầu chạy.
- **REQ-GAMEPLAY-02** Hàng Next luôn hiện đúng 5 khối sắp tới; mỗi khối đã đặt làm hàng dịch lên một ô và thêm một khối ở cuối.
- **REQ-GAMEPLAY-03** Khối sinh theo 7-bag: mỗi nhóm 7 khối liên tiếp từ đầu ván chứa đủ 7 loại I, J, L, O, S, T, Z, mỗi loại một lần.
- **REQ-GAMEPLAY-04** Hold cất khối đang rơi vào ô Hold (lần đầu lấy khối kế tiếp từ hàng chờ, các lần sau đổi chỗ với khối đã cất, không đụng hàng chờ); chỉ được Hold một lần cho mỗi khối.
- **REQ-GAMEPLAY-05** Thả tức thì (hard drop) chốt khối ngay tại điểm đáp và cộng 2 điểm cho mỗi ô khối đã rơi.
- **REQ-GAMEPLAY-06** Thả chậm (soft drop) làm khối rơi nhanh hơn, cộng 1 điểm cho mỗi ô; khối đáp đáy thì chốt sau lock delay.
- **REQ-GAMEPLAY-07** Phím mặc định: ←/→ di chuyển, ↓ thả chậm, Space thả tức thì, Z xoay trái, X hoặc ↑ xoay phải, Shift hoặc C để Hold, Esc hoặc P để tạm dừng.
- **REQ-GAMEPLAY-08** Giữ phím di chuyển thì sau DAS khối tự lặp bước theo ARR cho tới khi chạm tường hoặc khối khác.
