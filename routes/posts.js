const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

router.get("/", post_controller.post_list);

router.get("/:id", post_controller.post_detail);

router.get("/:id/comments", comment_controller.post_comment_list);

router.post("/", post_controller.post_create);

router.put("/:id", post_controller.post_update);

router.delete("/:id", post_controller.post_delete);

module.exports = router;