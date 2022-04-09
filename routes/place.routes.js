const express = require("express");
const router = express.Router();

//Require the Place model
const Place = require("../models/Place.model");

//Create a new place post
router.post('/', async (req, res) => {
    const { name, adress, city, dietaryType, description } = req.body;
    const place = await Place.create({ 
        name, 
        adress, 
        city, 
        dietaryType, 
        description, 
        author: req.jwtPayload.user._id
    })
    res.status(200).json(place);
});

//View all places 
router.get("/", async (req, res) => {
    const places = await Place.find().populate("author");
    res.status(200).json(places);
})

//View all places created by an author
router.get("/myplaces", async (req, res) => {
    //find the places associated with the author
    const places = await Place.find({
        author: req.jwtPayload.user._id,
    }).populate("author");
    res.status(200).json(places)
});



//View one place depending on ID

//Delete depending on ID

//Edit depending on ID 


module.exports = router;