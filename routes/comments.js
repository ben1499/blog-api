const express = require("express");
const router = express.Router();
const comment_controller = require("../controllers/commentController");

router.post("/", comment_controller.comment_create);

router.delete("/:id", comment_controller.comment_delete);

module.exports = router;