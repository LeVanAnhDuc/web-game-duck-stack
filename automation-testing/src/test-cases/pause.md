# PAUSE — Test cases

Requirement: `docs/requirements/pause.md` · quyết định: `docs/decisions/pause.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-PAUSE-001 — nút Pause mở hộp Paused với Resume/Settings/High scores/Restart và đồng hồ đứng yên

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chờ 2 giây → bấm Pause → chờ 5 giây
- **Mong đợi:** hộp Paused có đủ 4 nút, Resume có focus; Time không đổi
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-002 — Esc tạm dừng, Resume (hoặc Enter trên Resume) chơi tiếp và đồng hồ chạy lại

- **Requirement:** REQ-PAUSE-01, REQ-PAUSE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** Esc → Enter → chờ 3 giây → Pause → Resume
- **Mong đợi:** Esc mở hộp Paused; Enter đóng nó, Time `00:05`; Resume đóng hộp
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-003 — phím chơi không có tác dụng khi đang tạm dừng

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** Pause → bỏ focus khỏi Resume → Space, Shift, ←
- **Mong đợi:** Score 0, Hold trống, Next không đổi
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-004 — tab bị ẩn thì ván tự tạm dừng và vẫn dừng khi quay lại cho tới khi bấm Resume

- **Requirement:** REQ-PAUSE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** chờ 2 giây → ẩn tab 3 giây → hiện lại → chờ 3 giây → Resume
- **Mong đợi:** hộp Paused hiện, Time đứng `00:02`; sau Resume Time chạy
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-005 — mở Cài đặt hay Điểm cao giữa ván thì ván dừng; đóng lại thì ván chạy tiếp, không hiện hộp Paused

- **Requirement:** REQ-PAUSE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** Settings giữa ván → 10 giây → Done → 3 giây; High scores → 10 giây → đóng → 3 giây
- **Mong đợi:** không hiện hộp Paused; Time nhích ≤ 2 giây qua mỗi hộp thoại, rồi chạy ≥ 2 giây
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-006 — mở Cài đặt từ hộp Paused rồi đóng thì quay về hộp Paused, ván vẫn dừng

- **Requirement:** REQ-PAUSE-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** Pause → Settings trong hộp Paused → đóng → chờ 3 giây
- **Mong đợi:** hộp Paused quay lại; Time vẫn `00:02`
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-007 — Restart trong hộp Paused bỏ ván đang chơi, bắt đầu ván mới và không lưu ván cũ vào điểm cao

- **Requirement:** REQ-PAUSE-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** Space (có điểm) → Pause → Restart
- **Mong đợi:** Score 0, Time `00:00`, không hộp thoại; `tetris.scores.v1` không có
- **Automated:** `tests/e2e/pause/pause.e2e.ts`
