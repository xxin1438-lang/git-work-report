# Contributing

感谢关注 git-work-report！

## 如何贡献

1. Fork 本仓库
2. 创建分支：`git checkout -b feat/your-feature`
3. 修改后提交：`git commit -m "feat: describe your change"`
4. Push 并发起 Pull Request

## 可贡献的方向

- 默认模板优化（daily / weekly / monthly）
- 新的报告周期或参数
- `setup.sh` 跨平台支持（Windows PowerShell）
- 文档与使用示例
- 英文 README 完善

## 开发约定

- Skill 主文件保持精简（`skill/SKILL.md` < 500 行）
- 模板放 `skill/templates/`，项目脚手架放 `scaffold/`
- 命令文件放 `commands/`，与 skill 解耦
- 安装逻辑统一在 `lib/install.js`，CLI 在 `bin/git-work-report.js`
- 修改后运行 `node bin/git-work-report.js install` 或 `npm link` 后 `git-work-report install` 验证

## 报告 Bug

请附上：

- Cursor 版本
- 操作系统
- 使用的命令（如 `/weekly-report last`）
- 预期行为 vs 实际行为

不要贴含敏感信息的 commit 内容或公司模板。
