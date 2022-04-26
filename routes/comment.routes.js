const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/jwt.middleware");

//Require the Comment model
const Comment = require("../models/Comment.model");
const Place = require("../models/Place.model");

//Create a new comment
router.post('/:id', async (req, res) => {
    const { id } = req.params;
    
    const comment = await Comment.create({ 
        createdAt: Date.now(),
        author: req.jwtPayload.user._id,
        comment: req.body.comment 
    })
    let place = await Place.findById(id);
    //push comment made to the place with the same id it found
    place.comments.push(comment._id);
    place.save()
    res.status(200).json(comment);
});

//Delete comment by id 
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    //console.log(id)
    let comment = await Comment.findById(id);
    if (comment.author.toString() === req.jwtPayload.user._id) {
        await Comment.findByIdAndDelete(id);
        res.status(200).json(comment);
      } else {
        res.status(400).json("You are not the author of this comment");
      }
});

module.exports = router;