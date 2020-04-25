const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// requireing server end points
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, 
    ssl: true, 
  }
});

db.select('*').from('users').then(data => {

});

const app = express();

// to be able to do body parsing
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// define app to use cors
app.use(cors());

app.get('/', (req, res)=> { res.json('it is working') } );

app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) } );

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) } );

app.put('/image', (req, res) => { image.handleImage(req, res, db) } );

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) } );

app.listen(process.env.PORT || 3000, ()=> {
	console.log(`app is running on port ${process.env.PORT}`);
});

