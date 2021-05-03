const memeController = {};

memeController.getMemes = (req, res, next) => {
  res.json({ data: "list of memes" });
};

memeController.createMeme = (req, res, next) => {
  console.log(req.file);
  res.json({ data: "Creating meme" });
};

module.exports = memeController;
