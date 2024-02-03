const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_by: String,
    active: Boolean,
    geo_location: {
      latitude: Number,
      longitude: Number
    }
  });
  
  
  const Post = mongoose.model('post', postSchema);

  module.exports = {Post}