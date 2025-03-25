const simpleGit = require("simple-git");
const fs = require("fs");
const schedule = require("node-schedule");

// Git configuration
const REPO_PATH = "."; // Use current directory
const BRANCH_NAME = "improvements-md";
const git = simpleGit(REPO_PATH);

// Random commit messages
const commitMessages = [
  "Refactored some code",
  "Updated dependencies",
  "Fixed a minor issue",
  "Enhanced performance",
  "Code cleanup",
  "Updated documentation",
  "Optimized queries",
  "Improved stability",
  "Bug fixes and improvements",
];

// Function to make a commit
async function makeCommit() {
  try {
    // Random commit message
    const commitMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];

    // Modify a dummy file (avoid detection)
    const filePath = "notes.txt";
    const content = `Commit at ${new Date().toISOString()}\n`;
    fs.appendFileSync(filePath, content);

    // Git commands
    await git.checkout(BRANCH_NAME);
    await git.add(filePath);
    await git.commit(commitMessage);
    await git.push("origin", BRANCH_NAME);

    console.log(`✅ Committed: ${commitMessage}`);
  } catch (error) {
    console.error("❌ Error committing:", error);
  }
}

// Function to execute multiple commits (5 to 8 times)
async function makeMultipleCommits() {
  const commitCount = Math.floor(Math.random() * 4) + 5; // Random number between 5 and 8
  console.log(`🔄 Committing ${commitCount} times...`);

  for (let i = 0; i < commitCount; i++) {
    await makeCommit();
    const waitTime = Math.random() * 30 * 60 * 1000; // Random delay between commits (0-30 mins)
    console.log(`⏳ Waiting ${Math.round(waitTime / 60000)} mins before next commit...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  console.log("✅ All commits completed!");
}

// Function to randomly decide if Friday should have commits
function shouldCommitOnFriday() {
  return Math.random() < 0.5; // 50% chance to commit on Friday
}

// Scheduling commits
function scheduleCommits() {
  console.log("📅 Scheduling commits...");

  // Wednesday: 8 PM - 2 AM
  schedule.scheduleJob("0 20-23,0,1 * * 3", () => {
    setTimeout(makeMultipleCommits, Math.random() * 5 * 60 * 60 * 1000);
  });

  // Saturday & Sunday: 2 PM - 2 AM
  schedule.scheduleJob("0 14-23,0,1 * * 6,0", () => {
    setTimeout(makeMultipleCommits, Math.random() * 12 * 60 * 60 * 1000);
  });

  // Random chance to commit on Friday: 2 PM - 2 AM
  schedule.scheduleJob("0 14-23,0,1 * * 5", () => {
    if (shouldCommitOnFriday()) {
      console.log("🎲 Random chance: Committing on Friday!");
      setTimeout(makeMultipleCommits, Math.random() * 12 * 60 * 60 * 1000);
    } else {
      console.log("🚫 No commits on this Friday.");
    }
  });

  console.log("✅ Commit schedule is set.");
}

// Start scheduling
scheduleCommits();

// Make one commit immediately on startup
(async () => {
  console.log("🚀 Making an immediate commit on startup...");
  await makeCommit();
})();
