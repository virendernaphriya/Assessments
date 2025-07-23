const express = require('express');
const router = express.Router();
const {handleUserRegistration, handleUserLogin, handleUserLogout} = require('../controllers/auth.controllers');
const upload = require('../config/multer');


router.post('/register', upload.single('profilePicture'), handleUserRegistration);
router.post('/login', handleUserLogin);
router.post('/logout', handleUserLogout);
module.exports = router;