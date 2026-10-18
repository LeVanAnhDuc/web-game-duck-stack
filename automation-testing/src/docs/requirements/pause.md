# PAUSE — Tạm dừng, tự tạm dừng và hộp thoại giữa ván

Truy vết phía app: FR-13, FR-14 · US-01 · NFR-REL-01 · ADR-0017.

- **REQ-PAUSE-01** Nút Pause (và phím Esc/P) tạm dừng ván: hiện hộp Paused với Resume, Settings, High scores, Restart; focus vào Resume; đồng hồ đứng yên.
- **REQ-PAUSE-02** Resume (bấm, hoặc Enter khi focus ở Resume) tiếp tục ván và đồng hồ chạy lại.
- **REQ-PAUSE-03** Khi đang tạm dừng, phím chơi không có tác dụng.
- **REQ-PAUSE-04** Tab bị ẩn (chuyển tab, thu nhỏ) thì ván tự tạm dừng, trọng lực không chạy ngầm; quay lại tab ván vẫn dừng cho tới khi người chơi tiếp tục.
- **REQ-PAUSE-05** Mở Cài đặt / Điểm cao giữa ván thì ván tạm dừng (không hiện hộp Paused chồng lên); đóng lại thì ván tự chạy tiếp.
- **REQ-PAUSE-06** Mở một hộp thoại từ hộp Paused rồi đóng thì quay về hộp Paused, ván vẫn dừng.
- **REQ-PAUSE-07** Restart trong hộp Paused bỏ ván đang chơi và bắt đầu ván mới từ 0; ván bị bỏ không được ghi vào bảng điểm cao.
