const {Router}  = require("express");
const jwt = require("jsonwebtoken");
const { Post } = require("../models/PostModel");
require("dotenv").config();


const PostRoute  = Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;


    if (!token) return res.status(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403);
      req.user = user;
     
      next();
    });
  };


  PostRoute.get('/posts', async (req, res) => {
     
    try {
      const Posts = await Post.find();
      res.status(201).json({Posts});
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  // Create a Post
  PostRoute.post('/posts', authenticateToken, async (req, res) => {
    const { title, body, active, latitude, longitude } = req.body;

    const user_id = req.user.user._id;
     
    const post = new Post({
      title,
      body,
      created_by: user_id,
      active,
      geo_location: {
        latitude,
        longitude
      }
    });
  
    try {
      const savedPost = await post.save();
      res.status(201).json({ message: 'Post created successfully', post_id: savedPost._id });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Read a Post
  PostRoute.get('/posts/:post_id', authenticateToken, async (req, res) => {
    const user_id = req.user.user._id;
  console.log(user_id);
    try {
      const post = await Post.findOne({ _id: req.params.post_id, created_by: user_id });
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 
// Update a Post
  PostRoute.put('/posts/:post_id', authenticateToken, async (req, res) => {
    
  
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.post_id,
         req.body ,
            { new: true}
          );
  
        res.status(200).json({post, message: 'Post updated successfully' });
     
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  PostRoute.delete('/posts/:post_id', authenticateToken, async (req, res) => {
  

  try {
    const post = await Post.findByIdAndDelete(req.params.post_id);

        res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



PostRoute.get('/posts/location', async (req, res) => {

    
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
 
    try {
      const posts = await Post.find({
         
        'geo_location.latitude': latitude
       
      });
  
      res.status(200).json({ posts });
    } catch (error) {
 
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  
  PostRoute.get('/dashboard', async (req, res) => {
    
  
    try {
      const activeCount = await Post.countDocuments({ active: true });
      const inactiveCount = await Post.countDocuments({ active: false });
  
      res.status(200).json({ activeCount,inactiveCount });
    } catch (error) {
    
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = {PostRoute}