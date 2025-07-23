const Post = require("../models/post.model");
const User = require("../models/user.model");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user._id; // Get the authenticated user's ID

    const newPost = new Post({ title, content, author });
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Post creation failed", error: error.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId });
    res.status(200).json({ message: "Posts retrieved successfully", posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve posts", error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res
      .status(200)
      .json({ message: "All posts retrieved successfully", posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve posts", error: error.message });
  }
};

const deleteOwnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const post = await Post.findOneAndDelete({ _id: postId, author: userId });
    if (!post) {
      return res
        .status(404)
        .json({
          message: "Post not found or you do not have permission to delete it",
        });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
};

const updateOwnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { title, content } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { title, content },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({
          message: "Post not found or you do not have permission to update it",
        });
    }

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update post", error: error.message });
  }
};

module.exports = {
  createPost,
  getPostsByUser,
  getAllPosts,
  deleteOwnPost,
  updateOwnPost,
};
