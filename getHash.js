const bcrypt = require("bcryptjs");
const password = process.argv[2] || "admin123";

if (!password) {
  console.log("Usage: node getHash.js <password>");
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log("\n=================================");
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("=================================\n");
  console.log("Use this hash in MongoDB Shell:");
  console.log(`db.users.insertOne({`);
  console.log(`  username: "admin",`);
  console.log(`  password: "${hash}",`);
  console.log(`  role: "SuperAdmin",`);
  console.log(`  subscription_status: "Active"`);
  console.log(`})`);
  console.log("\n");
}).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

