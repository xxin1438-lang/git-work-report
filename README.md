# git-work-report

> **Cursor Skill for developers who use Git** — turn `git log` into daily / weekly / monthly work reports.

面向**使用 Git 的程序员**的 Cursor 工具：读取 commit 历史，自动聚合生成日报、周报、月报。  
不用再对着 `git log` 一条条拼凑，也不用担心 commit 写得太简略——Agent 会帮你还原「这周做了什么」。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/git-work-report.svg)](https://www.npmjs.com/package/git-work-report)

---

## 这是什么？

`git-work-report` 是一个 **Cursor Agent Skill**，专为日常用 Git 写代码的程序员设计：

| Git commit | 工作汇报 |
|-----------|---------|
| 给未来的自己 / reviewer 看 | 给上级 / 团队 / HR 看 |
| 经常是 `fix`、`update` | 需要可读、有成果感 |
| 一次改动一条 | 按业务价值聚合 |

**Skill 做的事**：按时间窗口读你的 `git log` → 模糊 commit 补充 diff 语义 → 按模块聚合 → 填入模板输出报告。

**Skill 不做的事**：不修改仓库、不代替 Git、不臆造没有 commit 支撑的工作内容。

---

## 安装

### 方式一：npm 一键安装（推荐）

```bash
npx git-work-report install
```

或全局安装：

```bash
npm install -g git-work-report
git-work-report install
```

> 注意：`npm install` 只是把包下载到 `node_modules`；**必须再执行 `install` 子命令**，才会把 Skill 注册到 `~/.cursor/`。

发布到 npm 后若使用国内镜像，安装不受影响；发布包到 npm 官方需加 `--registry=https://registry.npmjs.org`。

### 方式二：从 GitHub 源码安装

```bash
git clone https://github.com/xxin1438-lang/git-work-report.git
cd git-work-report
npm link
git-work-report install
```

### 方式三：项目脚手架（可选）

在公司项目里初始化自定义模板目录：

```bash
npx git-work-report scaffold
# 或指定路径
npx git-work-report scaffold ./your-project
```

会在项目根创建 `.git-work-report/`（config、templates、examples）。

### 安装结果

```text
~/.cursor/skills/git-work-report/     # Skill 逻辑 + 默认模板
~/.cursor/commands/
  ├── daily-report.md
  ├── weekly-report.md
  └── monthly-report.md
```

### 环境要求

- [Cursor](https://cursor.com/) IDE
- Git（本地有 commit 历史）
- Node.js >= 18

---

## 使用命令

在 Cursor 中打开任意 **Git 项目**，在聊天框输入：

### 基础命令

```text
/daily-report              # 今日日报
/weekly-report             # 本周周报（周一 ~ 周五）
/monthly-report            # 本月月报
```

### 带参数

```text
/weekly-report last                    # 上一完整工作周（Mon~Fri）
/daily-report 2026-07-01               # 指定某一天
/monthly-report 2026-06                # 指定月份
/monthly-report last                   # 上一个完整自然月
/weekly-report en                      # 英文输出
/weekly-report --template company      # 使用公司自定义模板
```

### 自然语言触发

也可以直接说：

```text
帮我生成本周周报
根据 git 记录写今天的日报
```

Agent 会自动加载 `git-work-report` skill。

---

## 使用技巧

### 1. 周五写周报用 `last`

周五下午或周末补周报时，统计**刚结束的工作周**：

```text
/weekly-report last
```

### 2. 上传公司模板

在项目根放 `.git-work-report/templates/weekly-company.md`，然后：

```text
/weekly-report --template company
```

把历史优秀周报放到 `examples/`，Agent 会模仿你的措辞风格（不会照抄内容）。

### 3. 多仓库一起统计

`.git-work-report/config.yaml`：

```yaml
repos:
  - /path/to/frontend
  - /path/to/backend
```

### 4. 过滤噪音 commit

```yaml
exclude:
  - "wip:"
  - "merge branch"
```

### 5. 计划区块怎么填

Git 只有历史，没有未来。模板里的「明日计划 / 下周计划」默认标「待补充」；你可以：

- 命令后追加说明：`/weekly-report 下周继续做退款联调`
- 或在项目里配 `openspecDir`，从 `tasks.md` 未完成任务生成建议

### 6. 让报告更准确

commit message 越清晰，报告越好。日常建议：

- 用 Conventional Commits：`feat(payment): 支持退款 API`
- 避免 `fix`、`update` 等无信息提交
- 提交前可用其他 commit message 工具辅助

### 7. 模糊 commit 会自动深挖

subject 太简略时，Skill 会读 `git show --stat`，必要时抽样 diff，而不是瞎编。

---

## 周报时间规则

默认统计 **周一至周五** 工作周（周末 commit 不计入）：

| 场景 | 统计范围 |
|------|---------|
| 周四执行 | 本周一 ~ 周四 |
| 周五执行 | 本周一 ~ 周五 |
| 周六 / 周日执行 | 刚结束的工作周 |
| `last` 参数 | 上一完整 Mon~Fri |

---

## 自定义模板

```text
.git-work-report/
├── config.yaml
├── templates/
│   ├── daily.md
│   ├── weekly.md
│   └── weekly-company.md
└── examples/
    └── 周报样例.md
```

配置示例：[scaffold/.git-work-report/config.example.yaml](scaffold/.git-work-report/config.example.yaml)

---

## 工作原理

```text
/daily-report  /weekly-report  /monthly-report
                    │
                    ▼
            git-work-report skill
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    git log      语义聚合      填充模板
   (按作者/时间)  (按模块)    (项目级优先)
```

模板加载优先级：

1. `--template <name>` 指定模板
2. 项目 `.git-work-report/templates/`
3. 全局 `~/.cursor/skills/git-work-report/templates/`

---

## 仓库结构

```text
git-work-report/
├── package.json
├── bin/git-work-report.js
├── lib/install.js
├── skill/SKILL.md
├── commands/
├── scaffold/
└── setup.sh
```

---

## 常见问题

**Q：没有 commit 怎么办？**  
A：报告会说明本周期无提交，计划区块保留待补充。

**Q：commit message 很烂能写好吗？**  
A：会读 `--stat` 推断语义，但建议日常写好 message。

**Q：`npm login` 跳到了 npmmirror？**  
A：国内默认镜像所致。发布到 npm 官方用：`npm publish --registry=https://registry.npmjs.org`

---

## 贡献

欢迎 PR 和 Issue，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

[MIT](LICENSE)
