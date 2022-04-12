const express = require("express");
const router = express.Router();

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

module.exports = router;