const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/jwt.middleware");

const User = require("../models/User.model");
const Place = require("../models/Place.model");

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
      },
    });
  // console.log(user)
  res.status(200).json(user);
});

//create a put route to add the saved favorites
router.put("/favorites", async (req, res) => {
  //   console.log(req.body)
  //get the user where we wnt to make changes
  const user = await User.findById(req.body.userId)
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
      },
    });
  //check if there is a place that is already been added to favorite
  const isAlreadyFavorited = user.favorite.some((aPlace) => {
    return aPlace._id === req.body.placeId;
  });
  //if the place is not already in the favorite, we find the id and push it to the favorite list
  if (!isAlreadyFavorited) {
    const place = await Place.findById(req.body.placeId).populate(
      "author",
      "-password"
    );

    console.log({ place, user });
    user.favorite.push(place);
    user.save();
  }
  res.status(200).json(user);
});

//delete the whole list
router.delete("/favorites", authenticate, async (req, res) => {
  console.log(req.jwtPayload.user._id)
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
      },
    });
  user.favorite = [];
  user.save();
  // console.log(user)
  res.status(200).json(user);
});

module.exports = router;
