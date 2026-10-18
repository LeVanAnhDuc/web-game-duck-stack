# HIGHSCORES — Test cases

Requirement: `docs/requirements/high-scores.md` · quyết định: `docs/decisions/high-scores.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-HIGHSCORES-001 — bảng trống báo chưa có ván nào, nói rõ điểm chỉ lưu trên máy này, nút Clear bị khoá

- **Requirement:** REQ-HIGHSCORES-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở High scores khi chưa có ván nào
- **Mong đợi:** có câu "Kept on this device only…"; Normal được chọn; "No rounds saved…"; Clear bị khoá
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-002 — mở ra ở bảng của độ khó đang chọn, và mỗi độ khó một bảng riêng

- **Requirement:** REQ-HIGHSCORES-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** độ khó Hard, seed Easy 500 + Hard 900 → mở → Easy → Normal
- **Mong đợi:** mở ở Hard (`High scores, Hard`) chỉ có 900; Easy chỉ có 500; Normal trống
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-003 — xếp hạng theo điểm giảm dần và chỉ giữ 10 dòng

- **Requirement:** REQ-HIGHSCORES-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** seed 12 dòng Normal lộn xộn
- **Mong đợi:** đúng 10 dòng; dòng đầu `Rank 1` 1,200; dòng 10 là 300; 100 và 200 không còn
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-004 — tên hiển thị được lưu, còn sau khi tải lại, và gắn vào ván kết thúc sau đó; để trống thì hiện Player

- **Requirement:** REQ-HIGHSCORES-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** gõ tên "Lan" → tải lại → hết một ván → High scores
- **Mong đợi:** dòng chưa đặt tên hiện "Player"; maxlength 16; storage "Lan"; ô còn "Lan" sau tải lại; dòng mới (aria-current) có "Lan"
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-005 — bảng Custom ghi chú không so được với nhau và hiện tốc độ từng dòng; bảng thường thì không

- **Requirement:** REQ-HIGHSCORES-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** độ khó Custom 2.5, seed Custom + Normal → mở → Normal
- **Mong đợi:** Custom: có ghi chú và `2.5 cells/s`; Normal: không ghi chú, không tốc độ
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-006 — xoá bảng cần bấm hai lần, chỉ xoá bảng đang xem

- **Requirement:** REQ-HIGHSCORES-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** seed Normal + Easy → Clear → xác nhận → Easy
- **Mong đợi:** cảnh báo hiện, dòng còn; sau xác nhận Normal trống; Easy còn 1 dòng; storage khớp
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-007 — đổi độ khó giữa ván thì ván đó vẫn vào bảng của độ khó lúc bắt đầu; ván sau mới theo độ khó mới

- **Requirement:** REQ-HIGHSCORES-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván ở Normal → đổi Hard giữa ván → hết ván → Play again → hết ván
- **Mong đợi:** ván đầu vào `normal`, `hard` trống; ván sau vào `hard`
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-008 — thời điểm đạt điểm hiện theo ngôn ngữ đang chọn

- **Requirement:** REQ-HIGHSCORES-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** seed dòng 2026-07-09 14:30 UTC → đọc → chuyển VI → đọc lại
- **Mong đợi:** EN `7/9/26, 2:30 PM`, `datetime` ISO; VI `14:30 9/7/26`
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`

### TC-HIGHSCORES-009 — tên hiển thị chứa thẻ HTML được hiện nguyên chữ, không thành phần tử

- **Requirement:** REQ-HIGHSCORES-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** seed tên `<img src=x onerr` → mở bảng
- **Mong đợi:** chữ hiện nguyên văn; không có phần tử `img` trong dòng; không có script nào chạy
- **Automated:** `tests/e2e/high-scores/high-scores.e2e.ts`
