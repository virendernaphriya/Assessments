const multer = require("multer");
const { cloudinary } = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "backendBatch",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => {
      `${Date.now()}-${file.originalname}`;
      console.log(file);
    },
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
