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

//root route for testing
app.get('/', (req, res) => {
    res.send('hello world')
})

//place routes 
const placeRoutes = require("./routes/place.routes");
app.use("/place", placeRoutes);

//comment routes
const commentRoutes = require("./routes/comment.routes");
app.use("/comment", authenticate, commentRoutes);

// user
const userRoutes = require("./routes/user.routes");
app.use("/user", authenticate, userRoutes);


app.listen(process.env.PORT);
