const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("../src/config/connectDB");
const initWebRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

initWebRoutes(app);
connectDB();


let port = process.env.PORT || 8000;
// port === undefined => port = 8000;

app.listen(port, () => {
    // callback
    console.log("backend nodejs is runing on the port : " + port)
})