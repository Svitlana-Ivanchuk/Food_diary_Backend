const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const { CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'avatars_helthyHub',
    allowed_formats: ['jpg', 'jpeg', 'png', 'WebP', 'GIF', 'TIFF', 'SVG'],
    public_id: req.user._id,
    transformation: [{ height: 500 }],
  }),
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
