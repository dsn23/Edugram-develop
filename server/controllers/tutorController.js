const mongoose = require('mongoose'),
  Tutor = mongoose.model('Tutor');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({storage});

// const profile = req.body.user

// tutorController.js
const uploadProfileImage = async (req, res) => {

  // console.log(req.file);
  try {
    const {file} = req
    if (!file) {
      throw new Error('Please provide an image')
    }
    const tutor = await Tutor.findById(req.id)
    if (!tutor) {
      throw new Error('Tutor not found')
    }

    // tutor.profile.image =  obj.img
    tutor.profile.image.data = req.file.buffer;
    tutor.profile.image.contentType = req.file.mimetype
    await tutor.save();

    res.status(201).json({message: 'Image uploaded successfully'})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}


const getProfileImage = async (req, res) => {
  // console.log("Log", req.id)
  try {
    const tutor = await Tutor.findById(req.id)
    if (!tutor || !tutor.profile.image) {
      throw new Error('Image not found')
    }

    // console.log("GET: ",tutor.profile)
    // res.contentType(tutor.profile.image.contentType);
    res.send(tutor.profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


module.exports = {
  uploadProfileImage,
  getProfileImage
}
