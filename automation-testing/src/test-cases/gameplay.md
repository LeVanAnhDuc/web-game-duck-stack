# GAMEPLAY — Test cases

Requirement: `docs/requirements/gameplay.md` · quyết định: `docs/decisions/gameplay.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-GAMEPLAY-001 — mở trang là vào ván ngay: bàn 10×20, HUD về 0 và đồng hồ chạy

- **Requirement:** REQ-GAMEPLAY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở trang → đọc HUD → chờ 3 giây
- **Mong đợi:** bàn có nhãn hiện; Score 0, Lines 0, Level 1; không có hộp Paused; Time `00:03`
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-002 — hàng Next hiện đúng 5 khối và dịch lên một ô sau mỗi khối đã đặt

- **Requirement:** REQ-GAMEPLAY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván seed START → đọc Next → Space → đọc Next
- **Mong đợi:** ban đầu `O T S J Z`; sau một khối 5 khối, 4 khối đầu là `T S J Z`
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-003 — bảy khối đầu tiên là đủ bảy loại, mỗi loại một lần (7-bag)

- **Requirement:** REQ-GAMEPLAY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** Shift (Hold lộ khối đang rơi) → đọc Hold + Next
- **Mong đợi:** khối Hold + khối kéo lên + 5 khối Next = đủ 7 loại, mỗi loại một lần
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-004 — Hold giữ khối đang rơi, chỉ một lần cho mỗi khối, và đổi lại được ở khối sau

- **Requirement:** REQ-GAMEPLAY-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** Shift → Shift lần nữa → Space → Shift
- **Mong đợi:** Hold = I; lần hai không đổi gì; sau khi đặt khối, Hold đổi thành khối đang rơi, hàng Next không đổi
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-005 — thả tức thì chốt khối ngay và cộng 2 điểm mỗi ô đã rơi

- **Requirement:** REQ-GAMEPLAY-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Space trên khối mở ván
- **Mong đợi:** Score = 2 × 20 = 40; hàng Next dịch lên
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-006 — thả chậm cộng 1 điểm mỗi ô và khối vẫn đáp xuống đáy

- **Requirement:** REQ-GAMEPLAY-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** giữ ↓ 1,2 giây → nhả → chờ lock delay
- **Mong đợi:** Score = 20 (1 điểm × 20 ô); Next dịch lên đúng một khối
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-007 — ↑ xoay phải giống X, C giữ khối giống Shift, P tạm dừng giống Esc

- **Requirement:** REQ-GAMEPLAY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** 8 khối đầu của `PLAN_LINES` với ↑ thay X → C → P
- **Mong đợi:** Lines 2 như kế hoạch; ô Hold có khối; hộp Paused hiện
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`

### TC-GAMEPLAY-008 — giữ ← thì khối tự lặp sang tận tường (DAS/ARR)

- **Requirement:** REQ-GAMEPLAY-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** hai khối đầu: giữ ← 600ms rồi Space (thay vì bấm 3–4 lần) → khối 2…4 theo kế hoạch
- **Mong đợi:** hàng đáy vẫn đầy: Lines 1
- **Automated:** `tests/e2e/gameplay/round.e2e.ts`
