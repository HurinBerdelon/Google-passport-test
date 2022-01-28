import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const userRepository = []

passport.use(new GoogleStrategy({
    clientID: '938379333755-r7qil1j50g4g5nlei3mnad5oif993p5a.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/oath2/redirect/accounts.google.com',
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async function (accessToken, refreshToken, profile, callback) {

        const user = userRepository.find(user => user.id === profile.id)

        if (!user) {
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            }
            userRepository.push(user)

            return callback(null, user)
        }

        return callback(null, user)
    }
))

interface IUser {
    id: string,
    name: string,
    email: string
}

passport.serializeUser(function (user: IUser, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, name: user.name });
    });
});

passport.deserializeUser(function (user: IUser, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const authRouter = Router()

authRouter.get('/login', function (request, response, next) {
    response.send('login page')
})

authRouter.get('/login/federated/accounts.google.com', passport.authenticate('google', {
    scope: ['profile',
        'email']
}))

authRouter.get('/oath2/redirect/accounts.google.com', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

authRouter.get('/logout', function (request, response, next) {
    request.logout()
    response.redirect('/login')
})

export { authRouter }