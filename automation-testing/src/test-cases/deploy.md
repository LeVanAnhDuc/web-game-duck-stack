# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-DEPLOY-001 — bản build dưới /web-game-duck-stack/ tải đủ tài nguyên, tiêu đề là Duck Stack

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở trang, ghi mọi response
- **Mong đợi:** title "Duck Stack"; bàn chơi hiện; path `/web-game-duck-stack/`; không response ≥ 400
- **Automated:** `tests/e2e/deploy/static-build.e2e.ts`

### TC-DEPLOY-002 — chơi trọn một ván không gửi dữ liệu đi đâu: ngoài font Google không gọi host nào khác, không có request ghi

- **Requirement:** REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ghi mọi request → hết ván → High scores
- **Mong đợi:** không request nào ngoài origin trừ font Google; không request khác GET
- **Automated:** `tests/e2e/deploy/static-build.e2e.ts`

### TC-DEPLOY-003 — không có lỗi JavaScript hay lỗi console từ lúc mở trang tới hết ván

- **Requirement:** REQ-DEPLOY-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** mở trang → Cài đặt → hết ván → Play again
- **Mong đợi:** không `pageerror`, không console error
- **Automated:** `tests/e2e/deploy/static-build.e2e.ts`
