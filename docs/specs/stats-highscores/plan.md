# Kế hoạch thi hành · `stats-highscores`

**Liên quan:** [`design.md`](design.md) · FR-32 · FR-33 · FR-34 · ADR-0014

- [x] **1.** `src/scores/types.ts` — `ScoreEntry`, `ScoreBoard`, `bucketOf`,
      `insertScore` (thuần, xếp giảm dần, cắt 10), `migrateScores` (bỏ dòng hỏng,
      không ném). Test trước.
- [x] **2.** `src/storage/local.ts` — export `browserStorage`, thêm `removeItem` vào
      `StorageLike` để test được nhánh xoá.
- [x] **3.** `src/storage/scores.ts` — `ScoreRepository` + `IdentityRepository`, async
      theo ADR-0004. Test: rỗng · rác · bị chặn · hết quota · một dòng hỏng.
- [x] **4.** `src/scores/index.tsx` — provider: `board`, `nickname`, `submit`,
      `setNickname`, `clear(bucket)`, `status`. Ghi ngoài state updater (bài học từ
      feature `settings`).
- [x] **5.** `useGameSession` — `runId` tăng theo mỗi lượt, publish trong HUD.
- [x] **6.** `src/ui/HighScoresScreen.tsx` — dialog, Escape + bẫy focus + trả focus,
      segmented chọn bảng, hàng hai dòng, dòng vừa xong được đánh dấu, ô nickname,
      xoá bảng.
- [x] **7.** `PlayScreen` — nút cúp ở topbar, bật lại nút "Điểm cao" ở modal kết thúc
      lượt, lưu đúng một lần theo `runId`, nhả bàn phím khi dialog mở.
- [x] **8.** Icon `trophy`, CSS trong `tokens.css`, i18n hai locale cùng tập key.
- [x] **9.** Test xanh · typecheck · build dưới ngưỡng NFR-PERF-04.
- [x] **10.** Xem app thật ở 375 / 768 / 1024 / 1440, thử bàn phím và Escape.
- [x] **11.** ADR-0014 · `scope.md` FR-32→34 · `README.md` §Features · `backlog.md`.
- [ ] **12.** Code review bằng subagent, sửa hết, rồi commit · PR · merge · dọn
      worktree.
