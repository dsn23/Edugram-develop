const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const Tutor = require('../models/tutorModal')

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
    async (accessToken, refreshToken, profile, done) => {
      const newTutor = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails.at(0).value,
        role: "tutor",
        profile: {
          bio: "",
          image: profile.photos.at(0).value
        }
      }

      try {
        let tutor = await Tutor.findOne({googleId: profile.id})

        if(tutor) {
          done(null, tutor)
        } else {
          tutor = await Tutor.create(newTutor)
          done(null, tutor)
        }
      } catch (e) {
        console.error(e)
      }
    })
  )

  passport.serializeUser((tutor, done) => {
    done(null, tutor.id)
  })

  passport.deserializeUser((id, done) => {
    Tutor.findById(id, (err, user) => done(err, user))
  })
}
