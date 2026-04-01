import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import app from "../src/app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Server start failed due to bad connection: ", err.message);
  });
