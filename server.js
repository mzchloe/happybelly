const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

//middleware to check for valid identity
const {authenticate} = require("./middlewares/jwt.middleware");

mongoose.connect(process.env.MONGO_DB_URL);

const app = express();

app.use(cors());

app.use(express.json());

//ROUTES
//authentication routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

//place routes 
const placeRoutes = require("./routes/place.routes");
app.use("/place", placeRoutes);

//comment routes
const commentRoutes = require("./routes/comment.routes");
app.use("/comment", authenticate, commentRoutes);


app.listen(process.env.PORT);
