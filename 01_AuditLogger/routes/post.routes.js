const auditLogger = require("../middleware/auditLogs.middleware");
const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const {
  createPost,
  getPostsByUser,
  getAllPosts,
  deleteOwnPost,
  updateOwnPost,
} = require("../controllers/post.controller");

router.get("/", getAllPosts);
router.post("/", auditLogger("Post", Post), createPost);
router.get("/user", getPostsByUser);
router.delete("/:id", auditLogger("Post", Post), deleteOwnPost);
router.put("/:id", auditLogger("Post", Post), updateOwnPost);
module.exports = router;
