const express = require('express');

const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {
  testCreateImage,
  testSelectImage,
} = require('../controllers/testController.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.get('/testCreateImage', (req, res) => {
  res.render('pages/testCreateImage');
});
router.post('/testCreateImage', upload.single('image'), testCreateImage);

router.get('/testSelectImage', testSelectImage, (req, res) => {
  res.render('pages/testSelectImage');
});

module.exports = router;
