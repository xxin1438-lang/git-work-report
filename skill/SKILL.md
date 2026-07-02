---
name: git-work-report
description: 根据 git 提交记录生成程序员日报、周报、月报。支持 daily/weekly/monthly 时间范围、外置模板、多仓库与中英文输出。在用户提到「日报」「周报」「月报」「工作总结」「git 汇报」或使用 /daily-report、/weekly-report、/monthly-report 时使用。
---

# Git 工作汇报生成

面向**使用 Git 的程序员**：从 commit 历史还原工作成果，按模板生成日报 / 周报 / 月报。

---

## 命令入口

| 命令 | period | 默认时间范围 |
|------|--------|-------------|
| `/daily-report` | daily | 当天 00:00 ~ 现在 |
| `/weekly-report` | weekly | **本周一 ~ 本周五**（工作周） |
| `/monthly-report` | monthly | 本月 1 日 00:00 ~ 现在 |

### 可选参数（命令后追加）

| 参数 | 说明 | 示例 |
|------|------|------|
| `YYYY-MM-DD` | 日报指定日期；周报指定该周周一 | `/daily-report 2026-07-01` |
| `YYYY-MM` | 月报指定月份 | `/monthly-report 2026-06` |
| `last` | 上一完整周期 | `/weekly-report last` → 上一 Mon~Fri |
| `ch`（默认） | 中文报告 | `/weekly-report ch` |
| `en` | 英文报告 | `/weekly-report en` |
| `--template <name>` | 使用指定模板（不含 .md） | `/weekly-report --template company` |

---

## 时间窗口规则

### 日报（daily）

- 默认：今天 00:00 ~ 现在
- 指定日期：该日 00:00 ~ 23:59

### 周报（weekly）— 周一至周五

1. 找到 anchorDate（默认今天）所在周的**周一** `weekMonday`
2. `weekFriday = weekMonday + 4 天`
3. **周六 / 周日执行**：仍指刚结束的**工作周**
4. git 采集：`--since weekMonday 00:00`，`--until min(weekFriday 23:59, now)`
5. `last`：上一完整工作周（Mon ~ Fri）

### 月报（monthly）

- 默认：本月 1 日 00:00 ~ 现在
- 指定 `YYYY-MM`：该月 1 日 ~ 月末 23:59
- `last`：上一个完整自然月

### config 覆盖

读取 `.git-work-report/config.yaml`（若存在）：

```yaml
week:
  start: monday
  end: friday
  weekendBehavior: current
author: "user@example.com"
repos: []
language: ch
exclude: ["wip:", "merge branch"]
openspecDir: openspec/changes
defaultTemplate:
  daily: daily
  weekly: weekly
  monthly: monthly
```

---

## 执行流程

### Step 1：解析参数

确定 `period`、`language`、`templateName`、日期、`last`，计算 `--since` / `--until`。

### Step 2：确定仓库列表

1. `config.yaml` 的 `repos`
2. 否则当前工作区 git 根目录
3. 多 repo 时逐个采集，报告按项目分节

### Step 3：采集 git 数据（先 cheap 后 expensive）

```bash
git -C <repo> log --since="<since>" --until="<until>" \
  --author="<author>" --no-merges \
  --pretty=format:"%h|%ad|%s" --date=short

git -C <repo> log --since="<since>" --until="<until>" \
  --author="<author>" --no-merges --numstat \
  --pretty=format:"COMMIT:%h|%s"
```

作者默认：`git config user.email`

**过滤**：跳过 `config.exclude` 匹配项；跳过 merge commit。

**模糊 commit**：执行 `git show --stat <hash>`；仍不清楚再抽样 diff。

**禁止**全量读每个 commit 的 diff。

### Step 4：语义聚合

按目录/模块、Conventional Commits 前缀、openspec change 名合并为汇报条目。

输出应回答：**做了什么、解决了什么、业务价值**。

### Step 5：加载模板

优先级：

1. `--template <name>` → `.git-work-report/templates/<name>.md`
2. `.git-work-report/templates/<period>.md`
3. `~/.cursor/skills/git-work-report/templates/<period>.md`

若存在 `.git-work-report/examples/`，读 1 份同 period 示例作风格参考。

### Step 6：填充并输出

- 保留模板原有结构
- 计划类区块无法推断时标「待补充」；可读 openspec `tasks.md` 中 `[ ]` 项作建议
- 周五前生成周报时注明统计截止日期
- 文末附提交次数、文件数、+/- 行数

---

## 输出要求

- 默认中文，面向上级/团队
- 不臆造 git log 中不存在的工作
- 多仓库时分 `## 项目：xxx` 小节
