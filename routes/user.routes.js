const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/jwt.middleware");

const User = require("../models/User.model");

//create a get route for favorites
router.get("/", async (req, res) => {
  const user = await User.findById(req.jwtPayload.user._id)
    .populate("favorite")
    .populate({
      path: "favorite",
      populate: ["author", "comments"],
    })
    .populate({
      path: "favorite",
      populate: {
      path: "comments",
      populate: "author",
      }
    });
  // console.log(user)
  res.status(200).json(user);
});

//create a put route to add the saved favorites
router.put("/favorites", async (req, res) => {
  //   console.log(req.body)
  const user = await User.findById(req.body.userId);
  !user.favorite.includes(req.body.placeId) &&
    user.favorite.push(req.body.placeId);
  user.save();
  res.status(200).json(user);
});

//create a unsave from favorites
/* router.put("/favorites/:id", async (req, res) => {
    const { id } = req.body.placeId;
    console.log(id)
    let removeFavorite = await User.findById(id)
    if () {
        
    } else {

    }
}) */

/* const { id } = req.params;
//console.log(id)
let comment = await Comment.findById(id);
if (comment.author.toString() === req.jwtPayload.user._id) {
    await Comment.findByIdAndDelete(id);
    res.status(200).json(comment);
  } else {
    res.status(400).json("You are not the author of this comment");
  } */

module.exports = router;
