const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const placeSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    dietaryType: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
        ref: "Comment",
      },
});

const Place = model('Place', placeSchema);

module.exports = Place;