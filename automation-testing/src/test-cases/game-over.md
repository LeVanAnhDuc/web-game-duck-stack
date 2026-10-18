# GAMEOVER — Test cases

Requirement: `docs/requirements/game-over.md` · quyết định: `docs/decisions/game-over.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-GAMEOVER-001 — chồng khối chạm đỉnh thì hết ván: hộp Game over báo lý do và chỉ số cuối ván khớp HUD

- **Requirement:** REQ-GAMEOVER-01, REQ-GAMEOVER-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** thả tức thì liên tục tới hết ván
- **Mong đợi:** hộp Game over có lý do block out; Score khớp HUD, Lines 0, Level 1, Time `mm:ss`, PPS 2 số lẻ; Play again có focus
- **Automated:** `tests/e2e/game-over/game-over.e2e.ts`

### TC-GAMEOVER-002 — Play again bắt đầu ván mới từ 0 và phím lại điều khiển được khối

- **Requirement:** REQ-GAMEOVER-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** hết ván → Play again → Space
- **Mong đợi:** hộp đóng; Score 0, Lines 0, Time `00:00`; Space cộng điểm
- **Automated:** `tests/e2e/game-over/game-over.e2e.ts`

### TC-GAMEOVER-003 — ván vừa hết được lưu đúng một lần vào bảng của độ khó đang chơi

- **Requirement:** REQ-GAMEOVER-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** hết ván ở Normal → chờ 3 giây → đọc `tetris.scores.v1`
- **Mong đợi:** đúng 1 dòng ở `normal` với đúng điểm; 3 bảng còn lại trống
- **Automated:** `tests/e2e/game-over/game-over.e2e.ts`

### TC-GAMEOVER-004 — High scores từ hộp Game over đánh dấu ván vừa chơi và có Play again

- **Requirement:** REQ-GAMEOVER-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** hết ván → High scores → Play again
- **Mong đợi:** một dòng `aria-current=true` chứa điểm vừa đạt; Play again đóng bảng và mở ván mới
- **Automated:** `tests/e2e/game-over/game-over.e2e.ts`

### TC-GAMEOVER-005 — sau khi hết ván, phím chơi không đổi điểm hay khối

- **Requirement:** REQ-GAMEOVER-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** hết ván → bỏ focus → Space, ↓, Shift
- **Mong đợi:** Score không đổi, hộp Game over vẫn hiện
- **Automated:** `tests/e2e/game-over/game-over.e2e.ts`
