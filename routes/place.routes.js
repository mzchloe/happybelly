const express = require("express");
const router = express.Router();

//Require the Place model
const Place = require("../models/Place.model");

//Create a new place post
router.post('/', async (req, res) => {
    const { name, address, city, dietaryType, description } = req.body;
    const place = await Place.create({ 
        name, 
        address, 
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
});

//View all places created by an author
router.get("/myplaces", async (req, res) => {
    //find the places associated with the author
    const places = await Place.find({
        author: req.jwtPayload.user._id,
    }).populate("author");
    res.status(200).json(places);
});


//View one place by the user id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.status(200).json(place);
});

//Delete depending on the user id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (place.user.toString() === req.jwtPayload.user._id){
        await Place.findByIdAndDelete(id);
        res.status(200).json(place);
    } else {
        res.status(400).json("Unauthorized");
    }
});

//Edit depending on ID 
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, address, city, dietaryType, description } = req.body;
    let place = await Place.findById(id);
    if (place.user.toString() === req.jwtPayload.user._id) {
        place.name = name;
        place.address = address;
        place.city = city;
        place.dietaryType = dietaryType;
        place.description = description;
        place = await place.save();
        res.status(200).json(tweet);
    } else {
        res.status(400).json("Unauthorized");
    }
});

module.exports = router;