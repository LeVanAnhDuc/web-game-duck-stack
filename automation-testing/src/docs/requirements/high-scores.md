# HIGHSCORES — Bảng điểm cao cục bộ

Truy vết phía app: FR-32, FR-33, FR-34 · US-03 · ADR-0014 · NFR-SEC-03, NFR-I18N-03.

- **REQ-HIGHSCORES-01** Bảng trống báo "No rounds saved at this difficulty yet."; dialog luôn nói rõ điểm chỉ lưu trên thiết bị/trình duyệt này; nút Clear bị khoá khi bảng trống.
- **REQ-HIGHSCORES-02** Mỗi độ khó một bảng riêng, không trộn; dialog mở ở bảng của độ khó đang chọn và chuyển được giữa bốn bảng.
- **REQ-HIGHSCORES-03** Dòng xếp theo điểm giảm dần, mỗi bảng giữ tối đa 10 dòng; hạng được đọc thành "Rank n".
- **REQ-HIGHSCORES-04** Tên hiển thị (tối đa 16 ký tự) được lưu (`tetris.identity.v1`), còn sau khi tải lại, và gắn vào các ván kết thúc sau đó; không đặt tên thì dòng hiện "Player".
- **REQ-HIGHSCORES-05** Bảng Custom ghi chú các ván không so được với nhau và hiện tốc độ của từng dòng ("n cells/s"); bảng thường không có hai thứ đó.
- **REQ-HIGHSCORES-06** Xoá bảng cần hai bước (cảnh báo không hoàn tác được rồi xác nhận) và chỉ xoá bảng đang xem.
- **REQ-HIGHSCORES-07** Đổi độ khó giữa ván thì ván đó vẫn vào bảng của độ khó lúc bắt đầu; ván sau mới vào bảng mới.
- **REQ-HIGHSCORES-08** Thời điểm đạt điểm lưu dạng epoch, hiển thị theo ngôn ngữ đang chọn (ngày/giờ ngắn), đổi ngôn ngữ thì đổi theo.
- **REQ-HIGHSCORES-09** Tên hiển thị chứa thẻ HTML được hiện nguyên chữ, không bao giờ thành phần tử.
