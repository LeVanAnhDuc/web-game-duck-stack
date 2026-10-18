# SETTINGS — Quyết định

Đi cặp với `docs/requirements/settings.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-08, FR-23…FR-30, FR-42…FR-44), `docs/specs/settings/design.md`, `docs/decisions/0013-settings-schema-and-fall-speed.md`, `docs/01-product/journeys.md` (US-02), `README.md` §Features.
- **Code:** `client/src/views/Play/mains/SettingsScreen/index.tsx`, `client/src/settings/types.ts` (mặc định, miền giá trị), `client/src/settings/index.tsx`, `client/src/storage/local.ts`, `client/src/engine/timing.ts` (đường cong trọng lực, Hard ×1,8).

## Quyết định chốt (Chốt bởi agent (user uỷ quyền))

- **Q1** Thanh trượt được chỉnh bằng bàn phím (Home / End / →) như người dùng bàn phím, không ghi thẳng giá trị.
- **Q2** Tốc độ rơi được chứng minh không cần phím: khối chạm đáy tự chốt và hàng Next dịch lên. Level 1: Normal 1 hàng/giây (khối I mở ván cần ~20 giây), Hard 1,8 hàng/giây (~11 giây) → mốc 15 giây phân biệt hai mức; Custom 20 ô/giây chốt trong ~1,5 giây.
- **Q3** Sau khi đóng Cài đặt, focus về nút Settings; nếu Space đã bị bỏ gán thì Space sẽ bấm nút đó (mở lại Cài đặt) — hành vi của nút có focus. TC-SETTINGS-004 bỏ focus trước khi bấm phím chơi.
- **Q4** Dữ liệu seed luôn có `schemaVersion: 1`: thiếu nó thì app coi là dữ liệu cũ và hiện thông báo "đã khôi phục" (đúng, xem `storage.md`), làm nhiễu các test không nói về lưu trữ.

## Tài khoản test

Không có — game không có tài khoản riêng.

## Ngoài phạm vi

- Bật/tắt bóng đáp (FR-25), chuyển động ngang mượt (FR-44), âm lượng (FR-27): hiệu ứng nằm trên canvas / Web Audio; E2E chỉ kiểm trạng thái công tắc và lưu trữ. Âm thanh phủ bằng `client/src/audio/audio.test.ts`.

## Tech debt liên quan

_(không có)_
