#!/usr/bin/env bash
# Tạo worktree cho một feature, kèm BẢN COPY của .claude/
#
#   .claude/scripts/worktree-new.sh <feature-slug> [branch-prefix] [base-ref]
#
# base-ref mặc định là origin/main, đúng như CLAUDE.md yêu cầu. Chỉ truyền khác khi
# công việc phải xếp lên một branch chưa merge (stacked) — và nói rõ lý do khi làm.
#
# Vì sao phải copy: .claude/ nằm trong .gitignore của repo này, nên `git worktree`
# không checkout nó. Không có nó thì worktree mất CLAUDE.md, mất skill feature-flow
# và design-bootstrap, và mất cả 4 hook — tức là build feature trong một môi trường
# không còn luật của chính dự án.
#
# BẢN COPY LÀ CHỈ ĐỌC. Mọi thay đổi .claude/ phải làm ở checkout gốc, không làm
# trong worktree — worktree-done.sh sẽ CHẶN việc xoá nếu phát hiện bản copy đã lệch,
# để một thay đổi vô tình không bị mất im lặng.
set -euo pipefail

FEATURE="${1:-}"
PREFIX="${2:-feat}"
BASE="${3:-origin/main}"
if [ -z "$FEATURE" ]; then
  echo "dùng: $0 <feature-slug> [branch-prefix] [base-ref]" >&2
  echo "      mặc định: prefix=feat, base-ref=origin/main" >&2
  exit 1
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

# Trong linked worktree, --git-dir khác --git-common-dir. Cả hai đi qua cd+pwd -P
# để cùng một dạng đường dẫn — trên Windows hai lệnh git trả hai kiểu khác nhau.
_gd="$(cd "$(git rev-parse --git-dir)" && pwd -P)"
_gc="$(cd "$(git rev-parse --git-common-dir)" && pwd -P)"
if [ "$_gd" != "$_gc" ]; then
  echo "LỖI: đang ở trong một worktree. Chạy script này ở checkout gốc." >&2
  exit 1
fi
[ -d .claude ] || { echo "LỖI: không thấy .claude/ tại $ROOT" >&2; exit 1; }

BRANCH="$PREFIX/$FEATURE"
WT=".worktrees/$FEATURE"
[ -e "$WT" ] && { echo "LỖI: $WT đã tồn tại." >&2; exit 1; }

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "LỖI: chưa có remote 'origin'. CLAUDE.md yêu cầu branch từ origin/main mới nhất." >&2
  exit 1
fi

echo "→ fetch origin"
git fetch origin --quiet
git rev-parse --verify --quiet "$BASE" >/dev/null || { echo "LỖI: không có ref '$BASE'" >&2; exit 1; }
if [ "$BASE" != "origin/main" ]; then
  echo "LƯU Ý: base là '$BASE', không phải origin/main — đây là branch xếp lớp (stacked)."
fi
echo "→ tạo worktree $WT trên branch $BRANCH, từ $BASE"
git worktree add -b "$BRANCH" "$WT" "$BASE"

echo "→ copy .claude/ vào worktree (bản copy, chỉ đọc)"
cp -r .claude "$WT/.claude"
rm -rf "$WT/.claude/.doc-state"

cat <<EOF

Xong.

  worktree : $ROOT/$WT
  branch   : $BRANCH  (từ $BASE $(git rev-parse --short "$BASE"))
  .claude  : đã copy — CHỈ ĐỌC. Sửa .claude/ thì sửa ở $ROOT

Khi merge xong:  .claude/scripts/worktree-done.sh $FEATURE
EOF
