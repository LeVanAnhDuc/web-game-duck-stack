# Thiết kế · `ducker-id-sign-in` (phần riêng của Duck Stack)

**Liên quan:** FR-45 · US-04 · ADR-0018 · ADR-0004 · ADR-0008 · NFR-A11Y-02
**Spec dùng chung (hành vi, cấu hình, kiểm thử):** `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`
— file này chỉ ghi phần riêng của repo, không chép lại.

## 1. Phạm vi

Đăng nhập Ducker ID tùy chọn, **chỉ danh tính**: nút, avatar, hộp thoại tài khoản. Không
đổi lưu trữ, điểm, thiết lập; `IdentityRepository` (`src/storage/scores.ts`) **không đổi**.
Ship tối: chỉ bật khi `VITE_FEATURE_DUCKER_SIGN_IN === "true"` và đủ bốn giá trị
`VITE_DUCKER_*`; `deploy.yml` không truyền chúng.

## 2. Vị trí và giao diện (MASTER.md `tetris`)

- **Chỗ gắn:** `<header className="topbar">` trong `src/views/Play/index.tsx`, một
  `.icon-btn` chỉ có biểu tượng + `aria-label`, đứng **trước** nút ngôn ngữ.
- **Màu:** chỉ chrome vô sắc (ADR-0008). Avatar là đĩa trung tính: nền
  `--color-surface-raised`, chữ `--color-text`, viền `--color-border-hover`. Ảnh Ducker ID nếu có,
  nếu không là chữ cái đầu của tên/email.
- **Hộp thoại tài khoản** (`mains/AccountDialog`): `.overlay` + `.modal` như `SettingsScreen` —
  tên, email, "Mở hồ sơ Ducker ID" (`target=_blank rel="noopener noreferrer"`), "Đăng xuất".
  Đóng bằng Esc (pha capture, không lọt xuống phím Esc = pause của game), bấm nền, nút đóng,
  hoặc chọn một mục; tiêu điểm trả về nút avatar; Tab quay vòng trong hộp.
  Nút avatar mang `aria-haspopup="dialog"` (không phải `menu`: đây là dialog, không phải popover).
- **Tạm dừng:** mở hộp thoại giữa ván tự tạm dừng và đóng thì chạy tiếp, cùng quy tắc
  `shouldAutoPause` như Cài đặt / Bảng điểm (ADR-0017), vì `anyDialogOpen` tắt phím của game.
- **375px:** mục thứ bảy của thanh trên không vừa với khoảng cách 16px, nên chỉ khi có nút này
  (`:has(.icon-btn--account)`, dưới 768px) khoảng cách là 4px, và `.topbar > .icon-btn` không còn co
  dưới 44px. Cờ tắt thì thanh trên giữ nguyên.
- **Biểu tượng:** thêm `user` vào `views/Play/components/Icon`.

## 3. Chuỗi (en + vi, cùng tập khoá — NFR-I18N-04)

| Khoá | en | vi |
| --- | --- | --- |
| `account.signIn` | Sign in | Đăng nhập |
| `account.signingIn` | Signing in… | Đang đăng nhập… |
| `account.menu` | Ducker ID account | Tài khoản Ducker ID |
| `account.openProfile` | Open Ducker ID profile | Mở hồ sơ Ducker ID |
| `account.signOut` | Sign out | Đăng xuất |

## 4. Tệp

- `src/auth/` — `config.ts` (`readDuckerConfig`, `DUCKER_CONFIG`), `pkce.ts`, `flow.ts`
  (`startLogin`, `consumeCallback`, `captureCallback`), `requests.ts`, `session.ts`,
  `initials.ts`, `types.ts`. Nằm trong `auth/` thay vì `types/` + `libs/` + `requests/` của kế
  hoạch chung, vì R-14 của repo này bác `src/types/` và R-01 mô tả thư mục theo vai trò.
- `src/hooks/useDuckerAuth.ts`; `src/views/Play/components/{AccountButton,Avatar}`,
  `src/views/Play/mains/AccountDialog`; `src/main.tsx` nhập `@/auth/session` đầu tiên.
- Cấu hình: `vite.config.ts` (`loadEnv` → `base`), `src/vite-env.d.ts`, `.env.example`,
  `.github/workflows/deploy.yml`.

## 5. Ngoại lệ NFR / ADR

ADR-0004 bị thay **một câu** (nút nay chạy được, biến môi trường nay có); `DuckerIdIdentity`
vẫn không được viết. nfr.md §Data & Privacy có ngoại lệ có giới hạn: `sessionStorage` khoá
`ducker.pkce` xoá khi quay về; mạng chỉ tới issuer đã cấu hình và chỉ sau khi bấm đăng nhập; cờ
tắt thì không đọc URL, không chạm storage, không request. Repo này không có test lưới
"không request ngoài" hay grep `fetch` nên không cần allowlist.

## 6. Không làm

e2e (repo không có Playwright; thêm là một quyết định hạ tầng riêng) · đồng bộ
điểm · lưu token/hồ sơ · bật ở bản deploy.
