# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-ACCESSIBILITY-001 — hộp Cài đặt: focus vào nút đóng, Tab quay vòng trong hộp, Esc đóng và trả focus về nút Settings

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** focus nút Settings → Enter → Shift+Tab → Tab → Esc
- **Mong đợi:** focus ở nút đóng; Shift+Tab sang Reset (cuối); Tab về nút đóng; Esc đóng, focus về Settings
- **Automated:** `tests/e2e/accessibility/accessibility.e2e.ts`

### TC-ACCESSIBILITY-002 — khi hộp thoại đang mở, phím gõ vào ô tên không điều khiển game

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** High scores → gõ "Ann Le" vào ô tên, ← ← rồi "x" → đóng
- **Mong đợi:** ô tên `Ann xLe`; Score 0, Hold trống
- **Automated:** `tests/e2e/accessibility/accessibility.e2e.ts`

### TC-ACCESSIBILITY-003 — chế độ không dựa vào màu in chữ cái của khối ở Hold và Next; tắt thì không có chữ

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chữ cái tắt, Hold → bật chữ cái trong Cài đặt
- **Mong đợi:** trước: Next/Hold không có chữ, Hold có 4 ô màu; sau: Next toàn chữ I/J/L/O/S/T/Z, Hold `I`
- **Automated:** `tests/e2e/accessibility/accessibility.e2e.ts`

### TC-ACCESSIBILITY-004 — prefers-reduced-motion: điểm nhảy thẳng tới giá trị mới, không đếm dần

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** `reducedMotion: reduce` → Space → chờ 120ms
- **Mong đợi:** Score hiện ngay 40
- **Automated:** `tests/e2e/accessibility/accessibility.e2e.ts`

### TC-ACCESSIBILITY-005 — mọi nút ở thanh trên và bàn chơi đều có tên đọc được

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** đọc tên các điều khiển
- **Mong đợi:** bàn chơi, Pause / High scores / Settings / Language, 8 nút "Rebind …", DAS / ARR / Volume đều có tên
- **Automated:** `tests/e2e/accessibility/accessibility.e2e.ts`
