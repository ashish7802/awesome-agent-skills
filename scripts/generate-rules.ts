import fs from 'fs';
import path from 'path';
import { REPO_SKILLS } from '../src/data/skillsData';

/**
 * Generates physical rule files on disk based on REPO_SKILLS in src/data/skillsData.ts.
 * Idempotent: Overwrites existing files with exact rawContent, creating directories as needed,
 * and prunes obsolete rule files.
 */
function generateRules() {
  const projectRoot = process.cwd();
  let createdCount = 0;

  console.log(`[generate-rules] Generating ${REPO_SKILLS.length} skill rule files from skillsData.ts...`);

  const validTargetPaths = new Set<string>();

  for (const skill of REPO_SKILLS) {
    if (!skill.targetPath || !skill.rawContent) {
      console.warn(`[generate-rules] Skipping skill ${skill.id}: missing targetPath or rawContent.`);
      continue;
    }

    const fullPath = path.resolve(projectRoot, skill.targetPath);
    validTargetPaths.add(fullPath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const normalizedContent = skill.rawContent.trim() + '\n';
    fs.writeFileSync(fullPath, normalizedContent, 'utf8');
    createdCount++;
    console.log(`  ✓ Generated: ${skill.targetPath}`);
  }

  // Prune any stale files in managed directories
  const managedDirs = [
    path.resolve(projectRoot, '.cursor/rules'),
    path.resolve(projectRoot, '.claude/skills'),
    path.resolve(projectRoot, '.github/copilot-instructions'),
  ];

  function pruneDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        pruneDir(full);
        if (fs.readdirSync(full).length === 0) {
          fs.rmdirSync(full);
        }
      } else if (entry.isFile()) {
        if (!validTargetPaths.has(full)) {
          console.log(`  ✗ Pruning stale file: ${path.relative(projectRoot, full)}`);
          fs.unlinkSync(full);
        }
      }
    }
  }

  for (const dir of managedDirs) {
    pruneDir(dir);
  }

  console.log(`[generate-rules] Completed successfully. ${createdCount} rule files synchronized.`);
}

generateRules();
