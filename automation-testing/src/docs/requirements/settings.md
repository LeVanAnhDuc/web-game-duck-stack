# SETTINGS — Màn Cài đặt

Truy vết phía app: FR-08, FR-23…FR-30, FR-42…FR-44 · US-02 · ADR-0013.

- **REQ-SETTINGS-01** Mặc định: độ khó Normal, DAS 8 tick, ARR 2 tick, bóng đáp bật, chế độ chữ cái tắt, chuyển động ngang mượt bật, âm thanh bật, Volume dùng được.
- **REQ-SETTINGS-02** Bốn độ khó Easy / Normal / Hard / Custom, đúng một cái được chọn; Custom hiện thanh tốc độ rơi 0,25…20 ô/giây (bước 0,25) kèm gợi ý "n cells per second"; chọn lại độ khó có sẵn thì thanh đó ẩn.
- **REQ-SETTINGS-03** DAS chỉnh 0…20 tick, ARR 0…10 tick; gợi ý hiện cả tick lẫn mili-giây (làm tròn).
- **REQ-SETTINGS-04** Đổi phím cho từng hành động: nút hiện "Press a key…" khi chờ, rồi hiện phím mới; phím cũ thôi tác dụng, phím mới có tác dụng; thanh gợi ý ở đáy màn hiện phím mới.
- **REQ-SETTINGS-05** Gán phím đang thuộc hành động khác thì báo "That key is already <phím> → <hành động>" và không đổi gì; Esc khi đang chờ phím thì huỷ, hộp vẫn mở.
- **REQ-SETTINGS-06** Tắt Sound effects thì thanh Volume bị khoá.
- **REQ-SETTINGS-07** Mọi thiết lập được lưu (`tetris.settings.v1`, có `schemaVersion`) và còn nguyên sau khi tải lại.
- **REQ-SETTINGS-08** Reset to defaults trả mọi thiết lập về mặc định, kể cả phím, và lưu lại.
- **REQ-SETTINGS-09** Done, nút đóng và Esc đều đóng Cài đặt; Esc không lọt xuống game thành phím tạm dừng.
- **REQ-SETTINGS-10** Độ khó quyết định tốc độ rơi (Hard nhanh hơn Normal, Custom theo số ô/giây đã chọn); đổi giữa ván thì ván đang chơi giữ tốc độ cũ, áp dụng từ ván sau.
