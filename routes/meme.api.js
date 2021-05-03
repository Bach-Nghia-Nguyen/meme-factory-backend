const express = require("express");
const memeController = require("../controllers/meme.controller");
const upload = require("../middlewares/upload.middleware");
const router = express.Router();

/**
 * @route GET api/memes
 * @description Get a list of memes
 * @access Public
 */
router.get("/", memeController.getMemes);

/**
 * @route POST api/memes
 * @description Create a new meme from an uploaded image
 * @access Public
 */
router.post("/", upload.single("image"), memeController.createMeme);

module.exports = router;
