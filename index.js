const simpleGit = require("simple-git");
const fs = require("fs");
const schedule = require("node-schedule");
require("dotenv").config();

// Git configuration
const REPO_PATH = "."; // Use current directory
const BRANCH_NAME = process.env.BRANCH_NAME;
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
      // Ensure Git identity is set (Only required once)
      await git.raw(["config", "--global", "user.name", process.env.GITHUB_USER_NAME]);
      await git.raw(["config", "--global", "user.email", process.env.GITHUB_EMAIL]);
  
      // Check if this is a Git repo
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        console.log("⚠️ Not a Git repository. Initializing...");
        await git.init();
        await git.addRemote("origin", process.env.GIT_REMOTE_URL);
        await git.fetch();
      }
  
      // Ensure remote exists
      const remotes = await git.getRemotes();
      const hasOrigin = remotes.some(remote => remote.name === "origin");
      if (!hasOrigin) {
        console.log("⚠️ No remote 'origin' found. Adding remote...");
        await git.addRemote("origin", process.env.GIT_REMOTE_URL);
        await git.fetch();
      }
  
      // Ensure branch exists and checkout
      try {
        await git.checkout(BRANCH_NAME);
      } catch (error) {
        console.log(`⚠️ Branch ${BRANCH_NAME} not found. Creating it...`);
        await git.checkoutLocalBranch(BRANCH_NAME);
      }
  
      // Pull latest changes to avoid conflicts
      console.log("🔄 Pulling latest changes...");
      await git.pull("origin", BRANCH_NAME);
  
      // Modify a dummy file
      const filePath = "notes.txt";
      const content = `Commit at ${new Date().toISOString()}\n`;
      fs.appendFileSync(filePath, content);
  
      // Git commands
      await git.add(filePath);
      await git.commit(commitMessages[Math.floor(Math.random() * commitMessages.length)]);
      await git.push("origin", BRANCH_NAME);
  
      console.log("✅ Successfully committed and pushed!");
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
