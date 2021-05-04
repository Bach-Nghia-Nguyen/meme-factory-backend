const express = require("express");
const memeController = require("../controllers/meme.controller");
const router = express.Router();

const photoMiddleware = require("../middlewares/photo.middleware");
const upload = require("../middlewares/upload.middleware");

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
router.post(
  "/",
  upload.single("image"),
  photoMiddleware.resize,
  memeController.createMeme
);

/**
 * @route PUT api/memes/:id
 * @description Update the texts on a meme
 * @access Public
 */
router.put("/:id", memeController.updateMeme);

/**
 * @route DELETE api/memes/:id
 * @description Delete the meme (image and texts)
 * @access Public
 */
router.delete("/:id", memeController.deleteMeme);

module.exports = router;
