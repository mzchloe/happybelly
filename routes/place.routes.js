const express = require("express");
const router = express.Router();

//Require the Place model
const Place = require("../models/Place.model");

//Create a new place
router.post('/', async (req, res) => {
    const { name, adress, city, dietaryType, description, comments } = req.body;
    const place = await Place.create({ 
        name, 
        adress, 
        city, 
        dietaryType, 
        description, 
        comments, 
        author: req.jwtPayload.user._id
    })
    
})


module.exports = router;