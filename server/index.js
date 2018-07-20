const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const massive = require('massive');
const session = require('express-session');
const axios = require('axios');
const app = express();
const c = require('./controller');

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));


massive(process.env.CONNECTION_STRING).then(database => {
    app.set('db', database)
}).catch(err => {console.log('error connection to massive', err)});

// app.get('/api/words', c.readWords);
// app.post('/api/words', c.createWord);
app.get('/api/profile', c.readUser);


app.get('/auth/callback', (req, res) => {
    
    //     // STEP 1.
    //     // Make an object called payload with the code recieved from the clientside, client_id, client_secret, grant_type, redirect_uri 
    //     //'code' is recieved from client side as a query
    
    const payload = {
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: `http://${req.headers.host}/auth/callback`
    };
    
    //     // STEP 2.
    //     // Write a function that returns an axios POST with the payload as the body.
    function tradeCodeForAccessToken() {
        return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
    }
    
    //     // STEP 3.
    //     // Write a function that accepts the access token as a parameter and returns an axios GET to Auth0 that passes the access token as a query.
    function tradeAccessTokenForUserInfo(response) {
        const accessToken = response.data.access_token
        return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${accessToken}`)
    }
    
    //     // STEP 4.
    //     // Write a function that accepts the userInfo as a parameter and returns a block of code.
    //     // Your code should set session, check your database to see if user exists and return their info or if they don't exist, insert them into the database.
    function storeUserInfoInDataBase(response) {
        console.log(response.data)
        const auth0Id = response.data.sub;
        const db = req.app.get('db');
        
        return db.read_user(auth0Id).then(users => {
            if (users.length){
                const user = users[0];
                req.session.user = user;
                res.redirect('/profile');
            } else {
                let createUserData = [
                    auth0Id,
                    response.data.email,
                    response.data.name, 
                    response.data.picture]
                return db.create_user(createUserData).then(newUsers => {
                    const user = newUsers[0];
                    req.session.user = user;
                    res.redirect('/profile');
                })
            }
        })
    }
    
    //   //STEP 5.  
    tradeCodeForAccessToken()
    .then(tradeAccessTokenForUserInfo)
    .then(storeUserInfoInDataBase)
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Server error'})
    })
})  

const port = 4000;
app.listen(port, () => console.log(`server is listening on port ${port}`))