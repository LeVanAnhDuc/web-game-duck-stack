#!/usr/bin/env bash
# Xoá bản copy .claude/ rồi tháo worktree — chạy SAU KHI branch đã được merge.
#
#   .claude/scripts/worktree-done.sh <feature-slug> [--force]
#
# Trước khi xoá, script so bản copy với bản gốc. Lệch thì DỪNG và in ra diff:
# đó là dấu hiệu có thay đổi .claude/ được làm trong worktree và sẽ mất nếu xoá.
# Chuyển thay đổi đó về checkout gốc, rồi chạy lại. --force để xoá bất chấp.
set -euo pipefail

FEATURE="${1:-}"
FORCE="${2:-}"
if [ -z "$FEATURE" ]; then
  echo "dùng: $0 <feature-slug> [--force]" >&2
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

WT=".worktrees/$FEATURE"
[ -d "$WT" ] || { echo "LỖI: không thấy $WT" >&2; exit 1; }

if [ -d "$WT/.claude" ]; then
  if ! diff -r -q -x '.doc-state' .claude "$WT/.claude" >/dev/null 2>&1; then
    if [ "$FORCE" != "--force" ]; then
      echo "DỪNG: bản copy .claude/ trong worktree đã LỆCH so với bản gốc." >&2
      echo "Xoá bây giờ là mất thay đổi đó. Diff:" >&2
      diff -r -x '.doc-state' .claude "$WT/.claude" >&2 || true
      echo >&2
      echo "→ chuyển thay đổi về $ROOT/.claude rồi chạy lại, hoặc dùng --force." >&2
      exit 1
    fi
    echo "CẢNH BÁO: bản copy đã lệch, --force nên vẫn xoá."
  fi
  echo "→ xoá bản copy .claude/"
  rm -rf "$WT/.claude"
fi

echo "→ tháo worktree $WT"
git worktree remove "$WT"
echo "Xong. Branch vẫn còn — xoá riêng nếu đã merge: git branch -d <branch>"
