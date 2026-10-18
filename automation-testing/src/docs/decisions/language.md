# LANGUAGE — Quyết định

Đi cặp với `docs/requirements/language.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-28), `docs/decisions/0006-hand-rolled-i18n-layer.md`, `docs/02-requirements/nfr.md` (NFR-I18N-01…04), `README.md` §Features ("Bilingual interface…").
- **Code:** `client/src/i18n/index.tsx` (`detectLocale`), `client/src/i18n/en.json`, `client/src/i18n/vi.json`, `client/src/main.tsx` (`document.documentElement.lang`), `client/src/settings/index.tsx`.

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Ngôn ngữ trình duyệt đặt bằng `test.use({ locale })` của Playwright (`navigator.languages`).
- **Q2** Hai file locale cùng tập key (NFR-I18N-04) đã có unit test `client/src/i18n/i18n.test.ts`; E2E chỉ kiểm vài chuỗi đại diện ở thanh trên.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Soát từng chuỗi dịch: thuộc review nội dung, không phải hồi quy.

## Tech debt liên quan

_(không có)_
