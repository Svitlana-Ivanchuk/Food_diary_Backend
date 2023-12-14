const mongoose = require("mongoose");

const app = require("./app");

const DB_URI = process.env.DB_URI;

mongoose.set("strictQuery", true);

mongoose
 .connect(DB_URI)
 .then(() => console.info("Database connection successful"))
 .catch((error) => {
  console.error(error);
  process.exit(1);
 });

app.listen(3000, () => {
 console.log("Server running. Use our API on port: 3000");
});
