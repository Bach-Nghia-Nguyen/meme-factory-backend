const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
