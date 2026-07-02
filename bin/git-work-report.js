#!/usr/bin/env node

import { installSkill, scaffoldProject } from '../lib/install.js';

function printHelp() {
  console.log(`
git-work-report — 安装 Cursor skill，从 git commit 生成日报/周报/月报

用法:
  git-work-report install              安装到 ~/.cursor/skills 与 ~/.cursor/commands
  git-work-report scaffold [path]      在项目中创建 .git-work-report/ 脚手架
  git-work-report help                 显示帮助

示例:
  npx git-work-report install
  npx git-work-report scaffold
  npx git-work-report scaffold ./my-project

环境变量:
  CURSOR_HOME   Cursor 配置目录（默认 ~/.cursor）
`);
}

function runInstall() {
  const { skillDest, commandsDest } = installSkill();
  console.log('==> 安装 git-work-report 到 Cursor');
  console.log(`    Skill    -> ${skillDest}`);
  console.log(`    Commands -> ${commandsDest}`);
  console.log('==> 安装完成');
  console.log('');
  console.log('下一步：在 Cursor 中打开 Git 项目，输入 /daily-report 或 /weekly-report');
}

function runScaffold(projectPath) {
  const target = projectPath || process.cwd();
  const { scaffoldDest, configCreated } = scaffoldProject(target);
  console.log(`==> 创建项目脚手架: ${scaffoldDest}`);
  if (configCreated) {
    console.log('    已创建 config.yaml');
  }
  console.log('==> 脚手架创建完成');
}

const [,, command, ...args] = process.argv;

switch (command) {
  case 'install':
    runInstall();
    break;
  case 'scaffold':
    runScaffold(args[0]);
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp();
    break;
  default:
    console.error(`未知命令: ${command}`);
    printHelp();
    process.exit(1);
}
