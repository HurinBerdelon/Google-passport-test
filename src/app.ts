import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { authRouter } from './auth'

const app = express()

app.use(express.json())

app.use(session({
    secret: 'some-secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.authenticate('session'))

app.use('/', authRouter, (request, response) => {
    const user = request.user
    delete request.user

    return response.json(user)
})

app.listen(7070, () => console.log(`server running on port: ${7070}`))