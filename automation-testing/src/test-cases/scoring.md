# SCORING — Test cases

Requirement: `docs/requirements/scoring.md` · quyết định: `docs/decisions/scoring.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-SCORING-001 — xoá 1 hàng ở cấp 1 được 100 điểm và bộ đếm Lines tăng 1

- **Requirement:** REQ-SCORING-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** 4 khối đầu của `PLAN_LINES` → khối thứ 5
- **Mong đợi:** trước: Lines 0, Score = điểm thả; sau: Lines 1, Score = điểm thả + 100
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`

### TC-SCORING-002 — xoá 2 và 3 hàng cùng lúc được 300 và 500 điểm

- **Requirement:** REQ-SCORING-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** khối 0…10 (2 lần 1 hàng + 1 lần 2 hàng) → khối 11…27 (2 lần 1 hàng + 1 lần 3 hàng)
- **Mong đợi:** Lines 4 rồi 9; Score = điểm thả + 100·n + 300 + 500
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`

### TC-SCORING-003 — đủ 10 hàng thì lên cấp 2, và điểm xoá hàng nhân theo cấp

- **Requirement:** REQ-SCORING-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** khối 0…27 (9 hàng) → khối 28 (hàng thứ 10)
- **Mong đợi:** Level 1 rồi Level 2
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`

### TC-SCORING-004 — xoá hàng liên tiếp hiện Combo ×1 và cộng 50 × combo × cấp; khối không xoá thì combo tắt

- **Requirement:** REQ-SCORING-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** khối 27 và 28 cùng xoá hàng → khối 29 không xoá
- **Mong đợi:** Combo `×1` hiện, điểm cộng 100 + 50; sau khối 29 dòng Combo biến mất
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`

### TC-SCORING-005 — tetris được 800 điểm và bật Back-to-back; tetris kế tiếp được nhân 1,5

- **Requirement:** REQ-SCORING-04, REQ-SCORING-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** `PLAN_TETRIS` khối 0…13 → khối 14…27
- **Mong đợi:** tetris đầu +800 và dòng Back-to-back hiện; tetris thứ hai +1200
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`

### TC-SCORING-006 — Time đếm thời gian chơi và PPS là số khối mỗi giây, hai chữ số thập phân

- **Requirement:** REQ-SCORING-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** chờ 9,8 giây → Space → chờ 20 giây
- **Mong đợi:** PPS `0.00` trước khối đầu; sau đó Time `00:10`, PPS `0.09`/`0.10`; Time `00:30`
- **Automated:** `tests/e2e/scoring/line-clears.e2e.ts`
