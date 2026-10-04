# ADR-0018 · Đăng nhập Ducker ID tùy chọn, ship tối sau cờ tính năng

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-45 · US-04 · NFR-REL-03 · supersedes một câu của ADR-0004 (không thay phần còn lại) · ADR-0001 · ADR-0011

## 1. Bối cảnh

ADR-0004 (2026-09-03) cấm ba thứ cho tới khi Ducker ID có endpoint OAuth thật:
`DuckerIdIdentity` rỗng, biến môi trường OAuth và nút "Đăng nhập" chưa hoạt động. Lý do
lúc đó đúng — không có gì để gọi. Nay Ducker ID đã có `/oauth/authorize`, `/oauth/token`,
`/oauth/userinfo` (OIDC Authorization Code + PKCE, client công khai), và chủ dự án yêu cầu
(2026-10-04) đưa đăng nhập tùy chọn vào cả họ game, giống `web-app-calculate-badminton`,
**chỉ phần danh tính** — không đồng bộ điểm, không đổi lưu trữ.

## 2. Quyết định

Thêm nút đăng nhập Ducker ID **hoạt động thật**, và chỉ câu *"Không viết `DuckerIdIdentity`
rỗng, không thêm biến môi trường OAuth, không thêm nút 'Đăng nhập' chưa hoạt động"* của
ADR-0004 bị thay thế: nút nay chạy được, biến môi trường nay có, và `DuckerIdIdentity` vẫn
**không** được viết. Mọi phần khác của ADR-0004 còn nguyên — `IdentityRepository` ở
`src/storage/scores.ts` **không đổi**, vì danh tính Ducker ID chỉ sống trong bộ nhớ và không
chạm vào điểm hay thiết lập.

- Mã ở `src/auth/` (config · PKCE · bắt callback · request · store ngoài), UI là `AccountButton`
  (`.icon-btn` trước nút ngôn ngữ ở thanh trên) + `AccountDialog` (modal như `SettingsScreen`).
- **Ship tối:** chỉ bật khi `VITE_FEATURE_DUCKER_SIGN_IN` đúng bằng `"true"` **và** đủ bốn giá
  trị `VITE_DUCKER_*`. Không giá trị nào có mặc định trong code. `deploy.yml` không truyền cờ
  lẫn `VITE_DUCKER_*`, nên GitHub Pages không bao giờ hiện nút.
- `VITE_BASE_PATH` thay `base: './'` của ADR-0001 (`/` ở local, `/<repo>/` ở deploy), vì
  `redirect_uri` cần một gốc app tuyệt đối.
- Không thêm dependency.

**Ngoại lệ có giới hạn cho "không dữ liệu rời máy" (nfr.md §Data & Privacy):** chỉ
`sessionStorage` khoá `ducker.pkce`, xoá khi quay về; mạng chỉ tới issuer đã cấu hình, chỉ sau
khi người chơi bấm đăng nhập; cờ tắt thì không đọc `location.search`, không chạm storage, không
gửi request nào. Hồ sơ (`sub`, tên, email, ảnh) chỉ nằm trong bộ nhớ — tải lại là đăng xuất.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Hiện nút ở bản deploy ngay | Chưa đăng ký client, chưa thêm `CORS_ORIGINS`; nút sẽ gãy. Ship tối cho phép merge mà không lộ |
| Giá trị mặc định cho issuer / scope trong code | Một mặc định sai trỏ người chơi tới một IdP không phải của mình; thiếu cấu hình phải là tắt, không phải đoán |
| Lưu token/hồ sơ vào `localStorage` | Mở rộng bề mặt dữ liệu rời máy và đưa một bí mật vào storage lâu dài; đổi lại chỉ để khỏi bấm đăng nhập lại (SSO đã làm việc đó) |
| Viết `DuckerIdIdentity` nối vào `IdentityRepository` | Ngoài phạm vi (danh tính, không đồng bộ). Sẽ kéo theo quyết định về nickname so với tên Ducker ID |

## 4. Hệ quả

**Được:** đăng nhập thử được ở local với tài khoản thật mà bản deploy không đổi một byte hành
vi; ADR-0004 vẫn là nơi giải thích vì sao có ba interface async.

**Mất / phải chấp nhận:**
- Cờ tắt thì code vẫn nằm trong bundle (không tree-shake được vì cờ đọc lúc build theo từng
  môi trường) — vài KB, chấp nhận.
- **Nợ `[skip release]`:** các commit của feature này mang `[skip release]`. `release.yml` quét
  cả khoảng kể từ tag gần nhất, nên mọi push sau đó vào `main` cũng bị bỏ qua cho tới khi có
  tag mới. Bản phát hành kế tiếp phải cắt tay một lần:
  `pnpm release:next` → `git tag vX.Y.Z && git push origin vX.Y.Z` →
  `gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`; sau đó khoảng sạch và tự động
  hoá chạy lại.
- Khi lên production phải đăng ký client ở admin Ducker ID (redirect URI
  `https://levananhduc.github.io/web-game-duck-stack/`), thêm origin vào `CORS_ORIGINS`, đặt cờ
  và bốn giá trị làm repository variables rồi truyền chúng trong `deploy.yml`.
- Sau khi đăng xuất, nút avatar biến mất và nút đăng nhập thay vào đúng chỗ đó; cùng một
  `ref` trỏ vào cả hai nên tiêu điểm rơi vào nút đăng nhập (qua `onFocusFallback`), không về
  `<body>`. Có test khẳng định `document.activeElement`.
- Timeout 15 giây cho cả hai request; lỗi hay treo đều về chưa đăng nhập. `returnTo` được giữ
  cả khi Ducker ID trả `error` (không giữ khi `state_mismatch`) và chỉ nhận đường dẫn cùng origin.
