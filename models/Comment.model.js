const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;