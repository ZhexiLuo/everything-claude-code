#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Claude session starts. Checks for recent session
 * files and notifies Claude of available context to load.
 */

const path = require('path');
const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  log,
  runCommand,
  isGitRepo
} = require('../lib/utils');
const { getPackageManager, getSelectionPrompt } = require('../lib/package-manager');

/**
 * Auto-pull latest changes from remote repository
 * @returns {object} { status: 'updated'|'conflict'|'up-to-date'|'error'|'not-git', message: string }
 */
function autoPullUpdates() {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT;
  if (!pluginRoot) {
    return { status: 'error', message: 'CLAUDE_PLUGIN_ROOT not set' };
  }

  // Check if plugin root is a git repo
  const gitCheck = runCommand('git rev-parse --git-dir', { cwd: pluginRoot });
  if (!gitCheck.success) {
    return { status: 'not-git', message: 'Plugin directory is not a git repository' };
  }

  // Fetch latest changes
  const fetchResult = runCommand('git fetch origin', { cwd: pluginRoot });
  if (!fetchResult.success) {
    return { status: 'error', message: `Fetch failed: ${fetchResult.output}` };
  }

  // Check if there are updates
  const statusResult = runCommand('git status -uno', { cwd: pluginRoot });
  if (!statusResult.success) {
    return { status: 'error', message: `Status check failed: ${statusResult.output}` };
  }

  // Check if already up to date
  if (statusResult.output.includes('Your branch is up to date')) {
    return { status: 'up-to-date', message: '✅ Already up to date' };
  }

  // Check if there are local changes that might conflict
  const diffResult = runCommand('git diff --stat', { cwd: pluginRoot });
  const hasLocalChanges = diffResult.success && diffResult.output.trim().length > 0;

  // Try to pull with rebase
  const pullResult = runCommand('git pull --rebase origin main', { cwd: pluginRoot });

  if (pullResult.success) {
    return { status: 'updated', message: '🚀 Config updated successfully!' };
  }

  // Check if there's a conflict
  if (pullResult.output.includes('CONFLICT') || pullResult.output.includes('conflict')) {
    // Abort the rebase to restore state
    runCommand('git rebase --abort', { cwd: pluginRoot });
    return {
      status: 'conflict',
      message: `⚠️ Conflict detected! Please resolve manually:\n   cd ${pluginRoot}\n   git pull --rebase origin main`
    };
  }

  return { status: 'error', message: `Pull failed: ${pullResult.output}` };
}

async function main() {
  // Auto-pull latest config updates
  const updateResult = autoPullUpdates();
  if (updateResult.status !== 'not-git' && updateResult.status !== 'error') {
    log(`[SessionStart] ${updateResult.message}`);
  }

  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // Detect and report package manager
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // If package manager was detected via fallback, show selection prompt
  if (pm.source === 'fallback' || pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});
