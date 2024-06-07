const express = require("express");
const router = express.Router();
const comment_controller = require("../controllers/commentController");

router.get("/", comment_controller.comment_list);

router.post("/:id", comment_controller.comment_create);

router.delete("/:id", comment_controller.comment_delete);


module.exports = router;