if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');


const router = express.Router();
const passport = require('passport');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const users = [];

// Connect to db

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
});

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Connected to db'))

// Passport
initializePassport(
    passport, 
    email => users.find(user=> user.email === email),
    id => users.find(user=> user.id === id)
);

// App set's

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

// App use's

app.use(expressLayouts);
app.use(express.static('public'))
// app.use(express.urlencoded({extended: true}))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())

// Routes - Get

app.use('/', indexRouter);





app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${port}!`))















// app.get('/', checkAuthenticated, (req, res) => {
//     res.render('index.ejs', { name: req.user.name});
// })  

// //
//     app.get('/login',checkNotAuthenticated ,(req, res) => {
        
//         res.render('login.ejs');

//     })
    
//     app.post('/login',checkNotAuthenticated , passport.authenticate('local', {
//         successRedirect:'/',
//         failureRedirect: '/login',
//         failureFlash:true
//     }));

// //

//     app.get('/register', checkNotAuthenticated, (req, res) => {
        
//         res.render('register.ejs');

//     })  

//     app.post('/register', checkNotAuthenticated, async (req, res) => {
//         try {
//             const hashedPassword = await bcrypt.hash(req.body.password,10)
//             users.push({
//                 id: Date.now().toString(),
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPassword,
//             })

//             res.redirect('/login')
//         }
//         catch{
//             res.redirect('/register')
//         }

//         console.log(users)
//     })

// //

// app.delete('/logout', (req,res)=>{
//     req.logOut();
//     res.redirect('/login');
// })

// function checkAuthenticated(req,res,next) {
//     if (req.isAuthenticated()){
//         return next()
//     }

//     res.redirect('/login')
// }
// function checkNotAuthenticated(req,res,next) {
    
//     if (req.isAuthenticated()){
//         return res.redirect('/')
//     }

//     next()
// }

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


