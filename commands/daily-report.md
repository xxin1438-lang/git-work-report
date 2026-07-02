---
name: /daily-report
id: daily-report
category: Workflow
description: "根据 git 提交记录生成程序员工作日报"
---

生成**日报**。必须遵循 `git-work-report` skill。

**固定参数**：`period = daily`

**时间窗口**：
- 无日期参数 → 今天 00:00 至当前时刻
- 有 `YYYY-MM-DD` → 该日 00:00 ~ 23:59

**模板**：优先 `.git-work-report/templates/daily.md`，否则 skill 内置 `templates/daily.md`。

**附加参数**（可选）：`ch`（默认）| `en` | `--template <name>`

用户追加文本视为「明日计划」补充或特殊说明。
