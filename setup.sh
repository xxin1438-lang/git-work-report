#!/usr/bin/env bash
# 兼容入口：委托给 npm CLI（需 Node.js >= 18）
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI=(node "$SCRIPT_DIR/bin/git-work-report.js")

# 无参数 → install（兼容旧用法）
if [[ $# -eq 0 ]]; then
  exec "${CLI[@]}" install
fi

# 兼容旧 flag：--scaffold / --project
case "${1:-}" in
  --scaffold)
    if [[ "${2:-}" == "--project" && -n "${3:-}" ]]; then
      exec "${CLI[@]}" scaffold "$3"
    fi
    exec "${CLI[@]}" scaffold
    ;;
  install|scaffold|help|-h|--help)
    exec "${CLI[@]}" "$@"
    ;;
  *)
    echo "未知参数: $*" >&2
    exec "${CLI[@]}" help
    ;;
esac
