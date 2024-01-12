const express = require('express')
const passport = require('passport')
const {createToken} = require('../middleware/token');
const router = express.Router()

// Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['email','profile'] }))

// Google auth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie("access_token", createToken(req.user._id, req.user.firstName, req.email, req.user.lastName, req.user.role), {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
    res.redirect('http://localhost:3000/dashboard')
  }
  // passport.authenticate( 'google', {
  //   successRedirect: '/dashboard',
  //   failureRedirect: '/'
  // })
)

module.exports = router
