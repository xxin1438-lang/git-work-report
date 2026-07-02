# .git-work-report — 项目级汇报配置

本目录用于覆盖全局 `git-work-report` skill 的模板与配置。

面向使用 Git 的程序员：Agent 会从本仓库的 commit 历史生成日报 / 周报 / 月报。

## 使用

```text
/daily-report
/weekly-report         # 默认 Mon~Fri 工作周
/monthly-report
/weekly-report --template company
```

## 目录

```text
.git-work-report/
├── README.md
├── config.yaml
├── templates/
└── examples/
```

## 上传模板

将公司格式放入 `templates/`。  
`daily.md` / `weekly.md` / `monthly.md` 会被对应命令使用。

自定义名称模板：`/weekly-report --template company` → `templates/weekly-company.md`

## 配置

见 `config.yaml`，完整说明见 [git-work-report README](https://github.com/xxin1438-lang/git-work-report)。
