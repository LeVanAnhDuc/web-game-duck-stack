# SETTINGS — Test cases

Requirement: `docs/requirements/settings.md` · quyết định: `docs/decisions/settings.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-SETTINGS-001 — Cài đặt mở với giá trị mặc định: Normal, DAS 8, ARR 2, bóng đáp bật, chữ cái tắt, âm thanh bật

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở Cài đặt lần đầu
- **Mong đợi:** Normal `aria-pressed`, không có thanh Fall speed; gợi ý DAS `8 ticks … (133 ms)`, ARR `2 ticks … (33 ms)`; các công tắc đúng mặc định; Volume bật
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-002 — chọn Custom hiện thanh tốc độ rơi 0,25…20 ô/giây, gợi ý đổi theo giá trị

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** Custom → End → Home → → → chọn Hard
- **Mong đợi:** thanh min 0.25 max 20, gợi ý 1 → 20 → 0.25 → 0.5; chọn Hard thì thanh ẩn
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-003 — DAS 0…20 và ARR 0…10 tick, gợi ý đổi cả tick lẫn mili-giây

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** DAS Home/End, ARR Home/End
- **Mong đợi:** `0 ticks … (0 ms)`, `20 … (333 ms)`; ARR `0 … (0 ms)`, `10 … (167 ms)`
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-004 — đổi phím Hard drop sang F: nút hiện F, thanh gợi ý hiện F, Space thôi thả còn F thì thả

- **Requirement:** REQ-SETTINGS-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Rebind Hard drop → F → Done → Space → F
- **Mong đợi:** nút hiện "Press a key…" rồi `F`; gợi ý Hard drop `F`; Space không cộng điểm, F có
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-005 — gán một phím đang thuộc hành động khác thì báo trùng và giữ nguyên phím cũ

- **Requirement:** REQ-SETTINGS-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** Rebind Hard drop → Z → Esc
- **Mong đợi:** báo `That key is already Z → Rotate left`, Rotate left vẫn `Z`; Esc huỷ, Hard drop vẫn `Space`, hộp còn mở
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-006 — tắt Sound effects thì thanh Volume bị khoá; bật lại thì mở

- **Requirement:** REQ-SETTINGS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** tắt Sound effects → bật lại
- **Mong đợi:** Volume bị khoá rồi mở lại
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-007 — thiết lập còn nguyên sau khi tải lại trang

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Hard, tắt bóng đáp, bật chữ cái, ARR 0 → Done → tải lại
- **Mong đợi:** các giá trị còn nguyên; `tetris.settings.v1` có `schemaVersion: 1` và đúng các giá trị
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-008 — Reset to defaults trả mọi thứ về mặc định, kể cả phím đã đổi, và lưu lại

- **Requirement:** REQ-SETTINGS-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thiết lập đã đổi (Custom 5, DAS 3, bóng tắt, âm thanh tắt, Hard drop = F) → Reset
- **Mong đợi:** Normal, DAS 8, bóng bật, âm thanh bật, Hard drop `Space`; đã lưu
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-009 — Done, nút đóng và Esc đều đóng Cài đặt

- **Requirement:** REQ-SETTINGS-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** đóng bằng Done, nút ×, Esc
- **Mong đợi:** hộp đóng cả ba lần; sau Esc không có hộp Paused
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-010 — độ khó quyết định tốc độ rơi, và đổi giữa ván thì áp dụng từ ván sau

- **Requirement:** REQ-SETTINGS-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** Hard: 15 giây → đổi sang Normal giữa ván → Restart → 15 giây → Custom 20 → Restart → 2,5 giây
- **Mong đợi:** Hard: Next đã dịch; Normal: Next chưa dịch; Custom 20: Next đã dịch
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`
