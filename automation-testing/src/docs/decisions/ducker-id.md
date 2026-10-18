# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/decisions/0018-ducker-id-sign-in-sau-co-tinh-nang.md` (đăng nhập Ducker ID sau cờ, chỉ danh tính, public client), `docs/specs/ducker-id-sign-in/design.md`, `docs/02-requirements/scope.md` (FR-45), `client/.env.example`, `README.md` §Features.
- **Code:** `client/src/auth/` (`config.ts`, `flow.ts`, `requests.ts`, `session.ts`), `client/src/views/Play/components/AccountButton/index.tsx`, `client/src/views/Play/mains/AccountDialog/index.tsx`, `.github/workflows/deploy.yml` (không truyền cờ).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Bản bật cờ là build thứ hai (`client/scripts/build-e2e.mjs` → `client/.e2e/auth`, issuer giả `http://ducker.test`, client `e2e-client`), phục vụ ở `:4391` cho project `app-auth`. Issuer không bao giờ được phân giải: `fixtures/issuer.fixture.ts` trả lời mọi request tới nó.
- **Q2** Các test đăng nhập chạy thời gian thật (`time: null`): request dùng `AbortSignal.timeout`, thứ đồng hồ giả không điều khiển.
- **Q3** Avatar dùng chữ cái đầu khi không có ảnh; test không kiểm chữ cái (chi tiết trình bày, đã có unit test `initials.test.ts`).

## Tài khoản test

Không có tài khoản thật: người dùng giả `Lan Nguyen <lan@example.com>` do issuer giả trả về (`data/test-data.ts` `DUCKER`).

## Ngoài phạm vi

- Ducker ID thật, đăng ký redirect URI, CORS phía server: ngoài repo này.
- Hết hạn token, gia hạn phiên: game không giữ token (chỉ danh tính trong bộ nhớ).

## Tech debt liên quan

_(không có)_
