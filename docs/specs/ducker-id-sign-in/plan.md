# Kế hoạch thi hành · `ducker-id-sign-in`

**Liên quan:** [`design.md`](design.md) · FR-45 · US-04 · ADR-0018
Kế hoạch chung: `web-game/docs/superpowers/plans/2026-10-04-ducker-id-sign-in.md` (Task 0–6).

- [x] **0.** Worktree bằng `.claude/scripts/worktree-new.sh ducker-id-sign-in`; cài; nền: typecheck + 231 test xanh.
- [x] **1.** `VITE_BASE_PATH` qua `loadEnv`, `readDuckerConfig` + test, `.env.example`, `deploy.yml` (không truyền cờ), kiểu env. So khớp base path: build với `/web-game-duck-stack/` ra asset đúng tiền tố.
- [x] **2.** `src/auth/`: PKCE (có vector RFC 7636), bắt callback, request, store ngoài + test (jsdom theo docblock).
- [x] **3.** `useDuckerAuth`, `AccountButton`, `Avatar`, `AccountDialog`, chuỗi en + vi, biểu tượng `user`, CSS vô sắc; test component bằng `react-dom/client` + `act` (repo không có RTL, không thêm dependency). Xem 375 / 768 / 1440 ở cả hai locale.
- [ ] **4.** e2e — **bỏ**: repo không có Playwright và không phải việc của feature này. Thay bằng test đơn vị + chạy tay với Ducker ID giả qua `page.route`.
- [x] **5.** Docs: Non-Goal, ADR-0018, nfr Data & Privacy, architecture, FR-45, US-04, backlog, README.
- [ ] **6.** Gate đầy đủ, push, mở PR (không merge).
