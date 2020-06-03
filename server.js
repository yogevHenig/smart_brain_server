const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors'); // control what domains can access the server.
const knex = require('knex');
const morgan = require('morgan');

// requireing server end points
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(morgan('combined')); //logging

// to be able to do body parsing
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// define app to use cors
app.use(cors()); // any domain

app.get('/', (req, res)=> { res.json('it is working') } );

app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) } );

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) } );

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) } );

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) } ); //put request-> update something

app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) } );

app.listen(process.env.PORT || 3000, ()=> {
	if (process.env.PORT === undefined){
		console.log('app is running on port 3000');
	} else {
		console.log(`app is running on port ${process.env.PORT}`);
	}
	
});

