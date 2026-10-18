# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-DUCKERID-001 — bản deploy tắt cờ: không có nút đăng nhập hay menu tài khoản, không gọi Ducker ID

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** bản deploy-like (`app`) → mở trang → 2 giây
- **Mong đợi:** không có "Sign in" hay "Ducker ID account"; không request nào tới host chứa "ducker"
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — bật cờ và chưa đăng nhập: thanh trên có nút Sign in bấm được

- **Requirement:** REQ-DUCKERID-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** bản bật cờ → mở trang
- **Mong đợi:** "Sign in" bấm được; chưa có avatar
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-003 — Sign in đi qua Ducker ID bằng PKCE S256 rồi quay về game đã đăng nhập, hiện tên, email và link hồ sơ

- **Requirement:** REQ-DUCKERID-03, REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Sign in → issuer giả trả code → mở menu tài khoản
- **Mong đợi:** tham số authorize đúng; token gọi với `grant_type`, `code`, `code_verifier`, không `client_secret`; URL sạch; menu có tên, email, link hồ sơ `http://ducker.test/profile` mở tab mới
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — Sign out đưa về trạng thái chưa đăng nhập mà không tải lại ván

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → menu → Sign out
- **Mong đợi:** menu đóng; "Sign in" bấm được và có focus
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — người dùng từ chối ở Ducker ID thì quay về game vẫn chưa đăng nhập, không gọi token

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** Sign in → issuer trả `error=access_denied`
- **Mong đợi:** URL sạch; vẫn "Sign in"; không gọi token
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — state trả về bị sửa thì không đổi code lấy token và vẫn chưa đăng nhập

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** Sign in → issuer trả `state` bị sửa
- **Mong đợi:** URL sạch; vẫn "Sign in"; không gọi token
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — menu tài khoản: focus vào nút đóng, Esc đóng menu, trả focus về avatar và không lọt thành phím tạm dừng

- **Requirement:** REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở menu → Esc
- **Mong đợi:** nút đóng có focus; Esc đóng menu, focus về avatar; không có hộp Paused
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
