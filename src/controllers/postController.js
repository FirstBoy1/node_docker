const Post = require("../models/postModel");

async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
}

async function getOnePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
}

async function createPost(req, res, next) {
  try {
    const post = Post.create(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
}

async function deletePost(req, res, next) {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({});
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
}

module.exports = {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
};
