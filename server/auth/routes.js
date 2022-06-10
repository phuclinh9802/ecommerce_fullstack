var express = require('express')
var passport = require('passport')
var request = require('request')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const LocalStrategy = require('passport-local').Strategy


module.exports = (app) => {
    app = express()
    const pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
        ssl: true

    })

    app.get('/', (req, res, next) => {
        console.log(req.user)
    })

    app.get('/register', (req, res, next) => {
        console.log(req.user)
    })

    app.post('/register', async (req, res) => {
        try {
            const client = await pool.connect() // connect to postgres
            await client.query('BEGIN')
            var pwd = await bcrypt.hash(req.body.password, 5)
            await JSON.stringify(client.query('SELECT "id" FROM "users" WHERE "email"=$1', [req.body.username], (err, result) => {
                if (result.rows[0]) {
                    console.err("This email address is already registered!")
                    res.redirect('/register')
                }
                else {
                    client.query('INSERT INTO users ("id", "firstName", "lastName", "email", "password") VALUES ($1, $2, $3, $4, $5)', [uuidv4(), req.body.firstName, req.body.lastName, req.body.username, pwd],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                client.query('COMMIT')
                                console.log(result)
                                console.log("User has been created")
                                req.flash('success', 'User has been created!')
                                res.redirect('/login')
                                return
                            }
                        })
                }
            }))
            client.release()
        }
        catch (e) {
            throw (e)
        }
    })

    app.get('/dashboard', (req, res, next) => {
        if (req.isAuthenticated()) {
            console.log('user is logged in')
        }
        else {
            console.err('failed to log in, redirecting...')
            res.redirect('/login')
        }
    })

    app.get('/login', (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/account')
        }
        else {
            console.log('redirecting to login')
        }
    })

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        if (req.body.remember) {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000 // 1 day expiration of cookie
        }
        else {
            req.session.cookie.expires = false; // set cookie expired
        }
        res.redirect('/')
    }
    )

    app.get('/logout', (req, res) => {
        console.log(req.isAuthenticated())
        req.logout()
        console.log(req.isAuthenticated())
        req.flash('success', "Logged out")
        res.redirect('/');
    })


    passport.use('local', new LocalStrategy({
        passReqToCallback: true

    }, (req, username, password, done) => { // passport takes username/password
        loginAttempt();
        async function loginAttempt() {
            const client = await pool.connect() //init db connection
            try {
                await client.query('BEGIN')
                var currentAccountsData = await JSON.stringify(client.query('SELECT id, "firstName", "email", "password" FROM "users" WHERE "email"=$1', [username], (err, result) => {
                    if (err) {
                        return done(err)
                    }
                    // if no rows for above query -> user does not exist
                    if (result.rows[0] == null) {
                        req.flash('danger', "Incorrect login details");
                        return done(null, false)
                    }
                    else {
                        // compare password, if err -> password error. if check -> success -> return user info
                        bcrypt.compare(password, result.rows[0].password), (err, check) => {
                            if (err) {
                                console.log('Error with password')
                                return done()
                            }
                            else if (check) {
                                return done(null, [{ email: result.rows[0].email, firstName: result.rows[0].firstName }]);
                            }
                            else {
                                req.flash('danger', 'Incorrect Login details');
                                return done(null, false)
                            }
                        }
                    }
                }))
            }
            catch (e) {
                throw e;
            }
        }
    })
    )

    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}
