import dotenv from "dotenv"
import {app} from "./app.js";

dotenv.config({
    path:"./.env"
})

const PORT = 7000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});