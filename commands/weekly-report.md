---
name: /weekly-report
id: weekly-report
category: Workflow
description: "根据 git 提交记录生成程序员工作周报（默认周一至周五）"
---

生成**周报**。必须遵循 `git-work-report` skill。

**固定参数**：`period = weekly`

**时间窗口**：
- 默认：本周**周一 ~ 周五**工作周；周六 / 周日执行时指刚结束的工作周
- `last` → 上一完整工作周（Mon ~ Fri）
- `YYYY-MM-DD` → 以该日为周一的那一周

**模板**：优先 `.git-work-report/templates/weekly.md`，否则 skill 内置 `templates/weekly.md`。

**附加参数**（可选）：`ch`（默认）| `en` | `--template <name>`

用户追加文本视为「下周计划」补充或特殊说明。
