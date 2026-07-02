import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function getCursorHome() {
  return process.env.CURSOR_HOME || join(homedir(), '.cursor');
}

function copyFile(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

/**
 * 安装 skill 与 commands 到 Cursor 用户目录
 */
export function installSkill() {
  const cursorHome = getCursorHome();
  const skillDest = join(cursorHome, 'skills', 'git-work-report');
  const commandsDest = join(cursorHome, 'commands');

  mkdirSync(join(skillDest, 'templates'), { recursive: true });
  mkdirSync(commandsDest, { recursive: true });

  copyFile(join(packageRoot, 'skill', 'SKILL.md'), join(skillDest, 'SKILL.md'));

  for (const name of ['daily.md', 'weekly.md', 'monthly.md']) {
    copyFile(
      join(packageRoot, 'skill', 'templates', name),
      join(skillDest, 'templates', name)
    );
  }

  for (const name of ['daily-report.md', 'weekly-report.md', 'monthly-report.md']) {
    copyFile(join(packageRoot, 'commands', name), join(commandsDest, name));
  }

  return { cursorHome, skillDest, commandsDest };
}

/**
 * 在项目目录创建 .git-work-report 脚手架
 */
export function scaffoldProject(projectDir = process.cwd()) {
  const scaffoldDest = join(projectDir, '.git-work-report');
  const scaffoldSrc = join(packageRoot, 'scaffold', '.git-work-report');

  mkdirSync(join(scaffoldDest, 'templates'), { recursive: true });
  mkdirSync(join(scaffoldDest, 'examples'), { recursive: true });

  const readmeDest = join(scaffoldDest, 'README.md');
  const configDest = join(scaffoldDest, 'config.yaml');

  if (!existsSync(readmeDest)) {
    copyFile(join(scaffoldSrc, 'README.md'), readmeDest);
  }

  let configCreated = false;
  if (!existsSync(configDest)) {
    copyFile(join(scaffoldSrc, 'config.example.yaml'), configDest);
    configCreated = true;
  }

  return { scaffoldDest, configCreated };
}
