# STORAGE — Quyết định

Đi cặp với `docs/requirements/storage.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-REL-02, NFR-REL-03, NFR-REL-05), `docs/decisions/0004-async-storage-identity-interfaces-defer-ducker-id.md`, `docs/specs/settings/design.md`.
- **Code:** `client/src/storage/local.ts` (`browserStorage` probe, trạng thái `ok/unavailable/recovered`), `client/src/settings/types.ts` (`migrateSettings`: clamp, mặc định), `client/src/scores/types.ts` (`migrateScores`), các `role="alert"` trong `SettingsScreen` và `HighScoresScreen`.

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Chặn storage giả lập bằng một init script làm `window.localStorage` ném `SecurityError` — giống chế độ riêng tư chặn hẳn site data.
- **Q2** ARR -4 kẹp về 0 (biên dưới); `das: "abc"` không phải số nên về mặc định 8 (code cố ý dùng mặc định chứ không dùng biên cho giá trị không phải số).

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Hết quota khi đang ghi: cùng nhánh `unavailable` với bị chặn, phủ bằng `client/src/storage/local.test.ts`.

## Tech debt liên quan

_(không có)_
