require('dotenv').config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

console.log("MONGO_URI =", process.env.MONGO_URI);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
