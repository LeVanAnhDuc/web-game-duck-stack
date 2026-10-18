# TOUCH — Test cases

Requirement: `docs/requirements/touch.md` · quyết định: `docs/decisions/touch.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-TOUCH-001 — trên điện thoại có dải nút cảm ứng đủ 7 hành động, không có thanh gợi ý phím

- **Requirement:** REQ-TOUCH-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Pixel 5 → mở trang
- **Mong đợi:** 7 nút có tên hành động hiện; thanh gợi ý ẩn
- **Automated:** `tests/e2e/touch/touch-band.e2e.ts`

### TC-TOUCH-002 — chạm Hard drop thả khối và cộng điểm; chạm Hold đưa khối vào ô Hold

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chạm Hold → chạm Hard drop
- **Mong đợi:** Hold có khối I; Score > 0
- **Automated:** `tests/e2e/touch/touch-band.e2e.ts`

### TC-TOUCH-003 — các nút di chuyển và xoay cảm ứng đặt khối giống hệt bàn phím

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** 5 khối đầu của `PLAN_LINES` bằng nút cảm ứng
- **Mong đợi:** Lines 1
- **Automated:** `tests/e2e/touch/touch-band.e2e.ts`

### TC-TOUCH-004 — mỗi nút cảm ứng và nút ở thanh trên rộng và cao ít nhất 44px

- **Requirement:** REQ-TOUCH-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** đo khung các nút cảm ứng và nút thanh trên
- **Mong đợi:** mỗi nút ≥ 44×44
- **Automated:** `tests/e2e/touch/touch-band.e2e.ts`

### TC-TOUCH-005 — trên điện thoại, mọi nút và công tắc trong Cài đặt rộng và cao ít nhất 44px

- **Requirement:** REQ-TOUCH-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mở Cài đặt trên điện thoại, đo mọi nút và công tắc
- **Mong đợi:** > 20 điều khiển, mỗi cái ≥ 44×44
- **Automated:** `tests/e2e/touch/touch-band.e2e.ts`
