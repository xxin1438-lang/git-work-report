---
name: /monthly-report
id: monthly-report
category: Workflow
description: "根据 git 提交记录生成程序员工作月报"
---

生成**月报**。必须遵循 `git-work-report` skill。

**固定参数**：`period = monthly`

**时间窗口**：
- 默认：本月 1 日 00:00 至现在
- `YYYY-MM` → 指定月份
- `last` → 上一完整自然月

**模板**：优先 `.git-work-report/templates/monthly.md`，否则 skill 内置 `templates/monthly.md`。

**附加参数**（可选）：`ch`（默认）| `en` | `--template <name>`

用户追加文本视为「下月计划」补充或特殊说明。
