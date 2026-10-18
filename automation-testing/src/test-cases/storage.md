# STORAGE — Test cases

Requirement: `docs/requirements/storage.md` · quyết định: `docs/decisions/storage.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-STORAGE-001 — thiết lập lưu bị hỏng: game vẫn chạy với mặc định và Cài đặt báo đã khôi phục

- **Requirement:** REQ-STORAGE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `tetris.settings.v1` = `{not json` → mở trang → Space → Cài đặt
- **Mong đợi:** Space cộng điểm; Cài đặt có thông báo khôi phục; Normal được chọn
- **Automated:** `tests/e2e/storage/storage.e2e.ts`

### TC-STORAGE-002 — trình duyệt chặn localStorage: vẫn chơi trọn ván, Cài đặt và Điểm cao nói rõ không lưu được

- **Requirement:** REQ-STORAGE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** storage bị chặn → Cài đặt → tắt bóng đáp → hết ván → High scores
- **Mong đợi:** thông báo "will not let the game save settings"; công tắc vẫn đổi; ván kết thúc bình thường; bảng báo "Scores cannot be saved" và vẫn hiện ván của phiên này; không lỗi JS
- **Automated:** `tests/e2e/storage/storage.e2e.ts`

### TC-STORAGE-003 — bảng điểm lưu có dòng hỏng: dòng hỏng bị bỏ, dòng lành vẫn hiện, Điểm cao báo đã sửa

- **Requirement:** REQ-STORAGE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** seed bảng Normal có 1 dòng lành + 1 dòng thiếu điểm
- **Mong đợi:** thông báo đã sửa; còn 1 dòng (800)
- **Automated:** `tests/e2e/storage/storage.e2e.ts`

### TC-STORAGE-004 — giá trị lưu ngoài miền được đưa về mặc định hoặc kẹp vào biên

- **Requirement:** REQ-STORAGE-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** seed `difficulty:"insane", volume:5, das:"abc", arr:-4, ghost:"yes"`
- **Mong đợi:** Normal; Volume `100%`; DAS 8; ARR 0; bóng đáp bật
- **Automated:** `tests/e2e/storage/storage.e2e.ts`
