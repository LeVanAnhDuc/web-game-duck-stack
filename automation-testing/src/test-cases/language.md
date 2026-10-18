# LANGUAGE — Test cases

Requirement: `docs/requirements/language.md` · quyết định: `docs/decisions/language.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-LANGUAGE-001 — trình duyệt tiếng Việt thì giao diện mở bằng tiếng Việt

- **Requirement:** REQ-LANGUAGE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** trình duyệt `vi-VN`, chưa lưu gì → mở trang
- **Mong đợi:** thanh trên "Điểm", nút "Tạm dừng", nút ngôn ngữ `VI`, `lang="vi"`
- **Automated:** `tests/e2e/language/language.e2e.ts`

### TC-LANGUAGE-002 — ngôn ngữ trình duyệt không hỗ trợ thì dùng tiếng Anh

- **Requirement:** REQ-LANGUAGE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** trình duyệt `fr-FR` → mở trang
- **Mong đợi:** "Score", `EN`, `lang="en"`
- **Automated:** `tests/e2e/language/language.e2e.ts`

### TC-LANGUAGE-003 — nút ngôn ngữ mở Cài đặt; chọn VI đổi giao diện ngay và còn nguyên sau khi tải lại

- **Requirement:** REQ-LANGUAGE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** trình duyệt `en-US` → nút ngôn ngữ → VI → Esc → tải lại
- **Mong đợi:** Cài đặt mở; tiêu đề thành "Cài đặt", VI được chọn; thanh trên tiếng Việt, `lang="vi"`; sau tải lại vẫn tiếng Việt, lưu `locale: "vi"`
- **Automated:** `tests/e2e/language/language.e2e.ts`

### TC-LANGUAGE-004 — ngôn ngữ đã lưu thắng ngôn ngữ của trình duyệt

- **Requirement:** REQ-LANGUAGE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** trình duyệt `vi-VN`, đã lưu `locale: "en"` → mở trang
- **Mong đợi:** giao diện tiếng Anh, `EN`, `lang="en"`
- **Automated:** `tests/e2e/language/language.e2e.ts`

### TC-LANGUAGE-005 — số được định dạng theo ngôn ngữ đang chọn, không theo máy

- **Requirement:** REQ-LANGUAGE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** đã lưu VI, seed dòng 12345 / 1.25 pps → High scores → đổi EN → High scores
- **Mong đợi:** VI: `12.345`, `1,25`; EN: `12,345`, `1.25`
- **Automated:** `tests/e2e/language/language.e2e.ts`
