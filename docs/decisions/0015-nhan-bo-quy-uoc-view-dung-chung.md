# ADR-0015 · Nhận bộ quy ước view dùng chung của workspace `web-game`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** ADR-0001 · ADR-0002 · [`docs/code-conventions.md`](../code-conventions.md)

## 1. Bối cảnh

Bộ quy ước dùng chung rút từ `quapp-developer-frontend`, đã lọc qua bảy lần áp thật
trước khi tới đây. Đây là project **Vite** đầu tiên nhận nó — bảy repo trước đều là
Next, nên đến đây mới biết phần nào của bộ rule thật sự không phụ thuộc framework.

Repo này lệch ở ba chỗ:

- `src/ui/` là tên cũ của `src/views/`, và trong đó trộn: ba màn hình, hai component
  nhỏ, **một hook** (`useGameSession.ts`) và **một file CSS** (`tokens.css`).
- `AnimatedNumber.tsx` xuất cả một component **và** một hook (`useBumpKey`).
- Không có alias `@/`, nên mọi import xuyên tầng là `../../../i18n`.

## 2. Quyết định

Theo [`docs/code-conventions.md`](../code-conventions.md):

- `src/ui/` → `src/views/Play/`. `PlayScreen` → `views/Play/index.tsx` (hàm đổi tên
  thành `Play`); `HighScoresScreen` · `SettingsScreen` → `mains/`; `AnimatedNumber` ·
  `PiecePreview` · `Icon` → `components/`.
- `useGameSession` và `useBumpKey` → `src/hooks/`; `tokens.css` → `src/styles/`.
- Thêm alias `@/` (R-13), khai ở **cả hai** chỗ: `tsconfig.json` cho `tsc` và
  `vite.config.ts` cho Vite/Vitest. Thiếu một bên thì một trong hai im lặng không hiểu
  đường dẫn. `@types/node` thành devDependency vì `vite.config.ts` cần `node:url`.
- `main.tsx` chỉ mount và gọi view (R-02).

**Hoãn R-04 (`ghosts/`).** Tầng view của repo này **không có test hành vi nào** — 12
file test đều ở `engine/` `storage/` `audio/` `i18n/` `input/` `render/` `runtime/` —
và repo **không có E2E**. Tách ghost là đổi thứ tự chạy effect và mảng deps; `tsc`
không thấy loại lỗi đó. Đợt này chỉ làm những gì `tsc` gác được.

Ứng viên duy nhất ở đây là effect gửi điểm cuối ván — nó có khoá `savedRunRef` chống
gửi trùng, và đó cũng chính là loại lỗi tách sai sẽ mở lại: gửi một ván hai lần, bảng
điểm sai âm thầm. Đã ghi vào `04-state/backlog.md` kèm điều kiện mở lại.

**Hoãn R-12 và R-21 (luật ESLint).** Repo này **không có ESLint**: không config, không
devDependency, không script. Rule giả định linter đã có; dựng linter cho một repo
Vite + React + TS là một việc riêng, có hệ quả riêng (thêm deps, thêm thời gian CI,
và một đợt sửa cảnh báo đầu tiên chưa ai đo được bao lớn).

**R-22 áp có sửa.** `.githooks/pre-commit` chạy `yarn typecheck` thay vì `eslint`, vì
đó là thứ gác duy nhất có thật ở đây. Nó chạy ~1s nên không ai phải chờ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Tách ghost luôn, không cần test | Đây là thay đổi hành vi duy nhất trong cả bộ rule, và là thứ duy nhất không công cụ nào gác. Làm nó mù ở một repo không có E2E là đánh cược, không phải refactor |
| Dựng ESLint luôn trong commit này | Trộn "di chuyển file" với "thêm một cổng chất lượng mới" vào một commit thì review không đọc được, và đợt sửa cảnh báo đầu tiên sẽ lẫn vào đống rename |
| Giữ import tương đối, bỏ alias | `views/Play/mains/HighScoresScreen/` cách `i18n/` ba cấp. `../../../i18n` là đúng thứ R-13 tồn tại để tránh |
| Để `useBumpKey` ở lại `AnimatedNumber.tsx` | Một file xuất cả component lẫn hook thì không ai tìm ra hook đó. `hooks/` là chỗ người ta tìm |
| Bỏ `@types/node`, dùng chuỗi cho alias | Trên Windows `new URL(...).pathname` cho `/D:/...` và Vite giải sai. Một package chỉ có kiểu là giá rẻ hơn một lỗi đường dẫn chỉ xuất hiện trên một hệ điều hành |

## 4. Hệ quả

**Được:**
- Cây thư mục của repo Vite này giờ đọc giống bảy repo Next: mở `views/Play/` là thấy
  màn chơi.
- Import xuyên tầng là `@/i18n`, không còn đếm dấu `../`.

**Mất / phải chấp nhận:**
- Alias phải khai ở hai chỗ. Sửa một chỗ quên chỗ kia thì `tsc` xanh mà build đỏ, hoặc
  ngược lại.
- `views/Play/index.tsx` vẫn **453 dòng**. Trong đó có đúng **một** `useEffect`, và nó
  là ứng viên ghost điển hình: gửi kết quả ván lên bảng điểm, có khoá `savedRunRef`
  chống gửi trùng. Tách nó ra `ghosts/SubmitFinishedRun` là việc tiếp theo, và nó đợi
  đúng một thứ: một test hành vi cho tầng view. Ghi ở `04-state/backlog.md`.
