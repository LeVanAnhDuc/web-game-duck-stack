# RESPONSIVE — Test cases

Requirement: `docs/requirements/responsive.md` · quyết định: `docs/decisions/responsive.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-RESPONSIVE-001 — bố cục ở 375px: đúng các vùng, bàn chơi nằm gọn, không cuộn ngang

- **Requirement:** REQ-RESPONSIVE-01, REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** khung 375×667
- **Mong đợi:** dải Hold/Next hiện, hai cột ẩn, dải cảm ứng hiện, gợi ý ẩn; bàn chơi nằm gọn, cao hơn rộng; không cuộn ngang
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-002 — bố cục ở 768px: đúng các vùng, bàn chơi nằm gọn, không cuộn ngang

- **Requirement:** REQ-RESPONSIVE-02, REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** khung 768×1024
- **Mong đợi:** dải ẩn, hai cột hiện, dải cảm ứng hiện, gợi ý ẩn; bàn gọn; không cuộn ngang
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-003 — bố cục ở 1024px: đúng các vùng, bàn chơi nằm gọn, không cuộn ngang

- **Requirement:** REQ-RESPONSIVE-03, REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** khung 1024×768
- **Mong đợi:** hai cột, gợi ý hiện, dải cảm ứng ẩn; bàn gọn; không cuộn ngang
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-004 — bố cục ở 1440px: đúng các vùng, bàn chơi nằm gọn, không cuộn ngang

- **Requirement:** REQ-RESPONSIVE-03, REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** khung 1440×900
- **Mong đợi:** như 1024
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-005 — điện thoại xoay ngang 667×375: nút hành động của hộp Cài đặt và Điểm cao vẫn tới được và bấm được

- **Requirement:** REQ-RESPONSIVE-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** khung 667×375 → Cài đặt → cuộn tới Reset, Done → bấm Done → High scores → cuộn tới Close → bấm
- **Mong đợi:** mỗi nút nằm trọn trong màn sau khi cuộn và bấm được
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-006 — hộp Điểm cao ở màn thấp 1396×581 với 10 dòng: nút chọn bảng giữ đủ 44px, danh sách không bị ép, nút đóng cuộn tới được

- **Requirement:** REQ-RESPONSIVE-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** khung 1396×581, 10 dòng → High scores
- **Mong đợi:** nút chọn bảng cao ≥ 44px; danh sách cao ≥ 128px; nút Close cuộn tới được
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`
