import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

import app from "../src/app.js";

const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`Server is listening at http://localhost:${port}`)
})