const Jimp = require("jimp");
const photoMiddleware = {};

photoMiddleware.resize = async (req, res, next) => {
  if (req.file) {
    console.log(req.file);
    const image = await Jimp.read(req.file.path);
    await image.scaleToFit(400, 400).write(req.file.path);
    next();
  } else {
    next(new Error("Image required"));
  }
};

/**
 * texts = [
 *  {
 *    size: 32,
 *    color: BLACK,
 *    alignmentX: "HORIZONTAL_ALIGN_LEFT",
 *    alignmentY: "VERTICAL_ALIGN_BOTTOM",
 *    content: "Awesome"
 *  }
 * ]
 */
photoMiddleware.putTextOnImage = async (
  originalImagePath,
  outputMemePath,
  texts
) => {
  try {
    const image = await Jimp.read(originalImagePath);
    const promises = texts.map(async (text) => {
      const font = await Jimp.loadFont(
        Jimp[`FONT_SANS_${text.size}_${text.color}`]
      );
      image.print(
        font,
        0,
        0,
        {
          text: text.content,
          alignmentX: Jimp[text.alignmentX],
          alignmentY: Jimp[text.alignmentY],
        },
        image.bitmap.width,
        image.bitmap.height
      );
    });
    await Promise.all(promises);
    await image.write(outputMemePath);
  } catch (error) {
    throw error;
  }
};

module.exports = photoMiddleware;
