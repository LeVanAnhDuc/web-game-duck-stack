# Red Routes — Duck Stack

Mỗi Red Route là một **hành trình**, không phải một trang. Chỉ dòng `status: live` được đưa
vào một lần chạy; `planned` ở lại đây để theo dõi và bị loại khỏi mọi lượt chạy
(`lib/orchestration.md` §Trước khi chạy, bước 1).

`entry` mặc định là `http://localhost:5173/` cho mọi route: app chỉ có **một** URL, không có
router, không có deep link. Trang mở ra là **vào ván luôn** — không có màn hình chờ, không có
nút "Bắt đầu".

## Về `min_steps` ở một cái game

`min_steps` là mẫu số của hiệu suất (`lib/frameworks.md` §Bảng điểm). Ở đây nó đếm **thao tác
giao diện** — click, chạm, bấm nút — và **không** đếm số lần di chuyển/xoay/thả khối. Hai lý do:

1. Thứ tự khối do 7-bag sinh theo seed (FR-03), nên số nước tối ưu để xoá một hàng đổi theo
   từng ván. Một mẫu số đổi theo ván thì không so được giữa các persona.
2. Cái cần đo ở route chơi game không phải "mất bao nhiêu nước" mà "có mò ra được cách chơi
   không". Cái đó nằm ở hiệu quả (`done_when`) và ở ấn tượng đầu.

Route nào `min_steps: 0` nghĩa là **không cần thao tác điều hướng nào** — persona chỉ việc chơi.
Với những route đó, bỏ trống ô hiệu suất trong báo cáo và ghi "không áp dụng", đừng chia cho 0.

---

## RR-01 · Mở trang lần đầu và xoá được hàng đầu tiên

- `id`: RR-01
- `name`: Mở trang lần đầu và xoá được hàng đầu tiên
- `actor`: người chưa từng chơi bản Tetris hiện đại nào, desktop, bàn phím
- `entry`: `http://localhost:5173/`
- `done_when`: ô **Lines** ở thanh trên chuyển từ `0` lên `>= 1`, và persona làm được việc đó
  **không** mở màn cài đặt, không đọc gì ngoài những chữ trang tự hiện
- `min_steps`: 0 thao tác điều hướng (ván tự chạy khi trang mở; thao tác chơi không đếm — xem
  mục trên)
- `why_red`: đây là toàn bộ sản phẩm. Không xoá được hàng nào thì mọi thứ còn lại vô nghĩa. Và
  vì không có onboarding, route này là chỗ duy nhất kiểm được rằng thanh gợi ý phím ở đáy trang
  đủ để tự học cách chơi
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:18` (US-01 bước 1→4) ·
  `docs/02-requirements/scope.md:23` (FR-01) · `docs/02-requirements/scope.md:32` (FR-10) ·
  `docs/02-requirements/scope.md:37` (FR-15) · `src/views/Play/index.tsx:412` (thanh `hints`)

## RR-02 · Chết, hiểu mình vừa được gì, rồi chơi lại

- `id`: RR-02
- `name`: Chết, hiểu mình vừa được gì, rồi chơi lại
- `actor`: người vừa chơi xong ván đầu, desktop
- `entry`: `http://localhost:5173/` — chơi tới khi khối chồng tới đỉnh
- `done_when`: hộp **Game over** hiện kèm điểm/hàng/cấp/thời gian/PPS của **ván vừa rồi**; sau
  khi bấm **Play again** thì bàn trống trở lại và **Score** về `0`
- `min_steps`: 1 (bấm `Play again`)
- `why_red`: đây là vòng lặp giữ người chơi. Ván kết thúc mà không nói được vừa xảy ra gì, hoặc
  chơi lại mất hơn một bước, thì người chơi đóng tab
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:18` (US-01 bước 8) ·
  `docs/01-product/journeys.md:89` (US-03 bước 1 và 3) · `docs/02-requirements/scope.md:34`
  (FR-12) · `docs/02-requirements/scope.md:53` (FR-31) · `src/views/Play/index.tsx:148`
  (`GameOverModal`)

## RR-03 · Tạm dừng giữa ván rồi chơi tiếp đúng chỗ

- `id`: RR-03
- `name`: Tạm dừng giữa ván rồi chơi tiếp đúng chỗ
- `actor`: người đang chơi bị gọi đi chỗ khác, desktop
- `entry`: `http://localhost:5173/` — đang trong ván, bàn đã có vài khối
- `done_when`: bàn **đứng hẳn** và hiện chữ **Paused**; sau khi tiếp tục, khối đang rơi tiếp tục
  từ đúng vị trí và **Score** không đổi trong lúc dừng
- `min_steps`: 2 (dừng → `Resume`)
- `why_red`: `NFR-REL-01` bắt game tự dừng khi tab mất focus, nên cơ chế dừng là thứ người chơi
  gặp cả khi không chủ động gọi nó. Dừng mà bàn vẫn chạy ngầm là mất ván — hỏng nặng nhất trong
  nhóm này
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:18` (US-01 bước 7) ·
  `docs/02-requirements/scope.md:35` (FR-13) · `docs/02-requirements/nfr.md:85` (NFR-REL-01) ·
  `src/views/Play/index.tsx:112` (`PausedModal`)

## RR-04 · Đổi phím về đúng thói quen của tay mình

- `id`: RR-04
- `name`: Đổi phím về đúng thói quen của tay mình
- `actor`: người chơi đã có phản xạ theo chuẩn hiện đại (nhóm chính), desktop
- `entry`: `http://localhost:5173/` — đang trong ván
- `done_when`: bấm **phím mới** thì khối thực hiện đúng hành động vừa gán, **và** thanh gợi ý ở
  đáy trang hiện phím mới thay cho phím cũ
- `min_steps`: 4 (mở cài đặt → bấm nút đổi phím của hành động đó → bấm phím muốn dùng → `Done`)
- `why_red`: `overview.md` §6.3 tự đặt ngưỡng "người mới đổi được keybind và DAS/ARR trong dưới
  60 giây mà không cần đọc hướng dẫn". Đây là một trong ba tiêu chí thành công của sản phẩm, và
  là tiêu chí duy nhất chỉ đo được bằng người thật
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:57` (US-02 bước 2) ·
  `docs/02-requirements/scope.md:45` (FR-23) · `docs/01-product/overview.md` §6.3 ·
  `src/views/Play/mains/SettingsScreen/index.tsx:92` (nút rebind)

## RR-05 · Chỉnh DAS và ARR cho khớp tay

- `id`: RR-05
- `name`: Chỉnh DAS và ARR cho khớp tay
- `actor`: người chơi đã có phản xạ theo chuẩn hiện đại (nhóm chính), desktop
- `entry`: `http://localhost:5173/` — đang trong ván
- `done_when`: dòng chữ dưới mỗi thanh trượt hiện **số tick mới**, và sau khi đóng cài đặt, giữ
  phím sang ngang cho cảm giác chạy ngang khác trước — persona nói ra được là nhanh hơn hay chậm
  hơn
- `min_steps`: 4 (mở cài đặt → kéo `DAS` → kéo `ARR` → `Done`)
- `why_red`: nhóm người dùng chính coi hai số này là **phần của điều khiển, không phải tuỳ chọn**
  (`README.md` §Controls). Cùng với RR-04, đây là nửa còn lại của ngưỡng 60 giây ở
  `overview.md` §6.3
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:57` (US-02 bước 3) ·
  `docs/02-requirements/scope.md:46` (FR-24) ·
  `src/views/Play/mains/SettingsScreen/index.tsx:248` (thanh trượt DAS/ARR)

## RR-06 · Đọc giao diện bằng tiếng của mình

- `id`: RR-06
- `name`: Đọc giao diện bằng tiếng của mình
- `actor`: người dùng tiếng Việt mở trang có trình duyệt đặt tiếng Anh (hoặc ngược lại)
- `entry`: `http://localhost:5173/`
- `done_when`: **mọi** chữ đang thấy trên trang đổi sang tiếng vừa chọn — kể cả chữ trong hộp
  Game over và trong bảng điểm cao — và số/ngày hiển thị theo đúng định dạng của tiếng đó
- `min_steps`: 3 (bấm nút ngôn ngữ ở thanh trên → chọn tiếng trong cài đặt → `Done`)
- `why_red`: `NFR-I18N-01` cấm hardcode chuỗi, và US-02 nêu thẳng rủi ro "đổi ngôn ngữ nhưng vài
  chỗ vẫn còn tiếng cũ". Một persona đọc từng chữ là cách phát hiện chuỗi sót rẻ nhất. Chú ý:
  nút ngôn ngữ ở thanh trên **không** tự đổi tiếng, nó mở màn cài đặt — persona kỳ vọng gì khi
  bấm nó là một phần của route này
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:57` (US-02 bước 4) ·
  `docs/02-requirements/scope.md:50` (FR-28) · `docs/02-requirements/nfr.md:78` (NFR-I18N-03) ·
  `src/views/Play/index.tsx:339` (nút ngôn ngữ mở cài đặt)

## RR-07 · Chơi được khi không phân biệt được màu khối

- `id`: RR-07
- `name`: Chơi được khi không phân biệt được màu khối
- `actor`: người chơi mù màu đỏ-lục (nhóm a11y)
- `entry`: `http://localhost:5173/`
- `done_when`: persona **gọi tên/kể lại được** khối đang rơi và khối trong ô `Next` mà không dựa
  vào màu, sau khi bật chế độ phân biệt không dựa vào màu; và xoá được ít nhất một hàng
- `min_steps`: 3 (mở cài đặt → bật `Distinguish without colour` → `Done`)
- `why_red`: `NFR-A11Y-06` nói màu không được là kênh thông tin duy nhất, mà toàn bộ bảng màu của
  game **chỉ** dùng màu để phân loại 7 khối (ADR-0008: achromatic chrome, board-only colour). Đây
  là route duy nhất kiểm được ngưỡng đó bằng người, và là route dễ bị bỏ qua nhất vì người làm
  sản phẩm không mù màu
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:18` (US-01 §Điều gì có thể sai, dòng cuối) ·
  `docs/02-requirements/scope.md:48` (FR-26) · `docs/02-requirements/nfr.md:70` (NFR-A11Y-06) ·
  `docs/decisions/0008-achromatic-chrome-board-only-colour.md`

## RR-08 · Thấy tên mình trên bảng điểm cao đúng độ khó

- `id`: RR-08
- `name`: Thấy tên mình trên bảng điểm cao đúng độ khó
- `actor`: người chơi đã chơi vài ván và muốn biết mình tiến tới đâu
- `entry`: `http://localhost:5173/`
- `done_when`: trong bảng điểm cao, ở **đúng bảng của độ khó vừa chơi**, có một hàng là ván vừa
  xong, mang **tên persona tự nhập** (không phải chữ `Player` mặc định) và một thời điểm đọc được
- `min_steps`: 4 (mở bảng điểm cao → nhập tên → đóng → chơi một ván tới game over)
- `why_red`: tên được **chụp lại lúc ván được ghi**, nên thứ tự thao tác quyết định kết quả: nhập
  tên **sau** khi chết thì hàng vừa tạo vẫn mang tên mặc định. Người chơi không có cách nào biết
  trước quy tắc đó. Ngoài ra bảng tách theo độ khó và **không bao giờ được gộp** (ADR-0014 §2a),
  nên "điểm của tôi đâu rồi" là câu hỏi route này phải trả lời được
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:89` (US-03 bước 2) ·
  `docs/02-requirements/scope.md:54` (FR-32) · `docs/02-requirements/scope.md:56` (FR-34) ·
  `src/scores/index.tsx:168` (tên được chụp lúc `submit`) ·
  `docs/decisions/0014-per-difficulty-score-boards-and-local-nickname.md`

## RR-09 · Chơi bằng cảm ứng trên điện thoại, mạng chậm

- `id`: RR-09
- `name`: Chơi bằng cảm ứng trên điện thoại, mạng chậm
- `actor`: người tình cờ mở trang trên điện thoại (nhóm phụ), 3G mô phỏng, viewport 375×667
- `entry`: `http://localhost:5173/`
- `done_when`: ô **Lines** lên `>= 1` **chỉ bằng chạm**, và trong suốt ván đó không có nút điều
  khiển nào che mất phần bàn chơi mà persona đang cần nhìn
- `min_steps`: 0 thao tác điều hướng
- `why_red`: nhóm phụ được hứa "chơi được đầy đủ luật bằng cảm ứng" (`overview.md` §3), và US-01
  nêu thẳng hai rủi ro "nút bấm che mất phần bàn chơi" và "bấm nhầm vì vùng bấm quá nhỏ".
  `NFR-A11Y-03` đặt ngưỡng 44×44px nhưng cách kiểm hiện chỉ là "review mockup" — chưa ai chạm thật
- `status`: live
- `derived_from`: `docs/01-product/journeys.md:18` (US-01 §Điều gì có thể sai) ·
  `docs/02-requirements/scope.md:38` (FR-16) · `docs/02-requirements/nfr.md:67` (NFR-A11Y-03) ·
  `src/views/Play/index.tsx:396` (`touchband`)

## RR-10 · Xoá sạch một bảng điểm cao

- `id`: RR-10
- `name`: Xoá sạch một bảng điểm cao
- `actor`: người muốn dọn điểm cũ — và persona negative, người bấm mọi nút để xem có gì vỡ
- `entry`: `http://localhost:5173/` — bảng điểm cao đã có ít nhất một hàng
- `done_when`: bảng **đang chọn** trở về trạng thái trống và nói rõ là chưa có ván nào; các bảng
  độ khó **khác** vẫn còn nguyên hàng của chúng
- `min_steps`: 3 (mở bảng điểm cao → `Clear this board` → bấm lần hai để xác nhận)
- `why_red`: đây là hành động **không hoàn lại được** duy nhất trong toàn app. Nó đứng sau một
  xác nhận hai bước, nên câu hỏi là persona có hiểu mình vừa xoá cái gì — một bảng, hay tất cả
- `status`: live
- `derived_from`: `docs/02-requirements/scope.md:54` (FR-32) ·
  `src/views/Play/mains/HighScoresScreen/index.tsx:250` (`scores.clear` → `scores.clearConfirm`)

---

## Chưa tồn tại — loại khỏi mọi lượt chạy

Ba route dưới đây **không** có giao diện. Chúng ở lại file này để lần chạy sau không phải suy ra
lại, và để không ai viết một báo cáo "không dùng được" về thứ chưa được làm.

## RR-11 · Đua một ván Sprint 40 hàng / Ultra 2 phút

- `id`: RR-11
- `name`: Đua một ván Sprint 40 hàng / Ultra 2 phút
- `actor`: người chơi nhóm chính muốn đo tốc độ của mình
- `entry`: chưa có
- `done_when`: chưa có — sẽ là: ván tự kết thúc ở hàng thứ 40 (hoặc ở phút thứ 2) và hiện thời
  gian/điểm của chính ván đó
- `min_steps`: —
- `why_red`: sẽ là route chính của nhóm người dùng chính khi có. **Không** phải Non-Goal
- `status`: planned
- `derived_from`: `docs/04-state/backlog.md:54` (chưa được cấp FR)

## RR-12 · Xem lại một ván đã chơi

- `id`: RR-12
- `name`: Xem lại một ván đã chơi
- `actor`: người chơi muốn biết mình đã xếp sai ở đâu
- `entry`: chưa có
- `done_when`: chưa có
- `min_steps`: —
- `why_red`: dữ liệu replay **đã được ghi từ bản đầu** (FR-18, ADR-0002) — chỉ thiếu giao diện,
  nên route này gần hiện thực hơn hai route còn lại ở mục này
- `status`: planned
- `derived_from`: `docs/04-state/backlog.md:55` · `docs/02-requirements/scope.md:40` (FR-18)

## RR-13 · So điểm với người khác

- `id`: RR-13
- `name`: So điểm với người khác
- `actor`: người chơi kỳ vọng có bảng xếp hạng
- `entry`: chưa có
- `done_when`: chưa có
- `min_steps`: —
- `why_red`: US-03 nói thẳng "người chơi kỳ vọng so điểm với người khác — hiện chưa có, và
  **không nên gợi ý là có**". Vậy route này có một mặt **đang** kiểm được ngay bây giờ, và nó
  thuộc RR-08: bảng điểm cao có vô tình hứa hẹn một bảng xếp hạng online không. Phần còn lại bị
  chặn từ bên ngoài — Ducker ID chưa có `/oauth/authorize`, `/oauth/token`, JWKS
- `status`: planned
- `derived_from`: `docs/01-product/journeys.md:89` (US-03 §Điều gì có thể sai) ·
  `docs/04-state/backlog.md:56` ·
  `docs/decisions/0004-async-storage-identity-interfaces-defer-ducker-id.md`
