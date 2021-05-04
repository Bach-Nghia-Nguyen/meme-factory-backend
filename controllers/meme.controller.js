const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const photoMiddleware = require("../middlewares/photo.middleware");
const utilsHelper = require("../helpers/utils.helper");

const memeController = {};

memeController.getMemes = (req, res, next) => {
  try {
    let rawData = fs.readFileSync("memes.json", "utf-8");
    let memes = JSON.parse(rawData).memes;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalNumOfMemes = memes.length;
    const totalPages = Math.ceil(totalNumOfMemes / limit);
    const offset = limit * (page - 1);
    memes = memes.slice(offset, offset + limit);

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { memes, totalPages },
      null,
      "Get memes successfully"
    );
  } catch (error) {
    next(error);
  }
};

memeController.createMeme = async (req, res, next) => {
  try {
    let rawData = fs.readFileSync("memes.json", "utf-8");
    let memes = JSON.parse(rawData).memes;
    let meme = {};

    const texts = req.body.texts || [];
    const textArray = [].concat(texts);
    meme.texts = textArray.map((text) => JSON.parse(text));

    meme.id = uuidv4();
    meme.originalImagePath = req.file.path;
    meme.outputMemePath =
      `public/images/MEME_${meme.id}.` +
      req.file.filename.split(".").slice(-1)[0];
    meme.imageUrl = meme.outputMemePath.split("public/")[1];

    await photoMiddleware.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );
    meme.createdAt = Date.now();
    meme.updatedAt = Date.now();

    memes.unshift(meme);
    fs.writeFileSync("memes.json", JSON.stringify({ memes }));

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      meme,
      null,
      "The new meme has been created"
    );
  } catch (error) {
    next(error);
  }
};

memeController.updateMeme = async (req, res, next) => {
  try {
    const memeId = req.params.id;
    let rawData = fs.readFileSync("memes.json", "utf-8");
    let memes = JSON.parse(rawData).memes;
    const index = memes.findIndex((meme) => meme.id === memeId);
    if (index === -1) {
      return next(new Error("Meme not found"));
    }
    let meme = memes[index];
    const texts = req.body.texts || [];
    meme.texts = [].concat(texts);

    await photoMiddleware.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );
    meme.updatedAt = Date.now();

    fs.writeFileSync("memes.json", JSON.stringify({ memes }));
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      meme,
      null,
      "The meme has been updated"
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

memeController.deleteMeme = async (req, res, next) => {
  try {
    res.json({ message: "delete this" });
  } catch (error) {
    next(error);
  }
};

module.exports = memeController;
