import fs from 'fs';
import path from 'path';
import { REPO_SKILLS } from '../src/data/skillsData';

/**
 * Generates physical rule files on disk based on REPO_SKILLS in src/data/skillsData.ts.
 * Idempotent: Overwrites existing files with exact rawContent, creating directories as needed.
 */
function generateRules() {
  const projectRoot = process.cwd();
  let createdCount = 0;

  console.log(`[generate-rules] Generating ${REPO_SKILLS.length} skill rule files from skillsData.ts...`);

  for (const skill of REPO_SKILLS) {
    if (!skill.targetPath || !skill.rawContent) {
      console.warn(`[generate-rules] Skipping skill ${skill.id}: missing targetPath or rawContent.`);
      continue;
    }

    const fullPath = path.resolve(projectRoot, skill.targetPath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const normalizedContent = skill.rawContent.trim() + '\n';
    fs.writeFileSync(fullPath, normalizedContent, 'utf8');
    createdCount++;
    console.log(`  ✓ Generated: ${skill.targetPath}`);
  }

  console.log(`[generate-rules] Completed successfully. ${createdCount} rule files synchronized.`);
}

generateRules();
