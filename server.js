// const Subscription = require('./src/models/subscription.model');
const bodyParser = require('body-parser');
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require("path")
// Connect the database
const dotenv = require("dotenv");
dotenv.config();
require("./models/subscription.model");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

const __variableOfChoice = path.resolve();
app.use(express.static(__variableOfChoice + '/build'));


app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));


let jsonParser = bodyParser.json();

const validateEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const replaceHTML = function(html, obj) {
    return html.replace(/\{\{(.*?)\}\}/g, function(key) {
        const newData = obj[key.replace(/[{}]+/g, "")];
        return newData || "";
    });
}



const Scheme = mongoose.Schema;
const schema = new Scheme({ 
    email: 'string'
});

const Subscription = new mongoose.model('Subscription', schema);

// Routes
app.get('/*', function(req, res){
    res.sendFile(__variableOfChoice + './build/index.html');
});



// Subscribe
app.post('/api/subscribe/email', jsonParser, async function(req, res) {
    try {
        // Check if the email exists first of all
        let checkSubscription = await Subscription.find({ 'email' : req.body.email });
        // If it doesn't..
        if(checkSubscription.length === 0) {
            // Then validate the email
            if(validateEmail(req.body.email)) {
                // And add it to the database
                // const newSubscription = new Subscription({
                //     email: req.body.email,
                // });
                const newSubscription = new Subscription();
                newSubscription.email = req.body.email;
                newSubscription.save().then(function(err){
                    console.log(req.body.email);
                    res.status(200).send({ "message" : "User has Subscribed.", "code" : "03"  });
                }).catch(function(err){
                    res.status(400).send({ "message" : "Error saving your email.", "code" : "02" });
                })
                // newSubscription.save(function(err) {
                //     if(err) {
                //         res.status(400).send({ "message" : "Error saving your email.", "code" : "02" });
                //     } else {
                //         console.log(req.body.email);
                //         res.status(200).send({ "message" : "User has Subscribed.", "code" : "03"  });
                //     }
                // })
            } else {
                // Otherwise show errors
                res.status(400).send({ "message" : "Error saving your email.", "code" : "02" });
            }
        } 
        else {
            res.status(201).send({ "message" : "User Already Subscribed.", "code" : "02"  });
        }
    } catch(e) {
    }
});


app.get('/api/unsubscribe/:email', async (req, res) => {
    // Unsubscribe email
    if(typeof req.params.email !== "undefined") {
        // When we unsubscribe, check for an email
        let findEmail = await Subscription.find({ "email" : req.params.email });

        if(findEmail.length > 0) {
            // If it exists, remove it
            await Subscription.deleteOne({ "email" : req.params.email });
            res.send({ "message" : "Email deleted.", "code" : "00" });
        }
        else {
            // Otherwise the user wasn't even subscribed to begin with
            res.send({ "message" : "Email doesn't exist.", "code" : "01"})
        }
    }
});




const portfolioEmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    requireTLS: true,
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'raagbhutani@gmail.com',
        pass: 'ktlopncqumhwftct'
    },
});

portfolioEmail.verify((error) => {
    if(error)
        console.log(error);
    else
        console.log("Verified : Good to go !!");
})

app.post("/api/contact", (req,res) => {
    const Name = req.body.firstName + req.body.lastName;
    const Email = req.body.email;
    const Mobile = req.body.phone;
    const Message = req.body.message;
    const Mail = {
        from : 'PortFolio-ContactForm <Email>',
        // to : 'raagbhutani@gmail.com , raagbhutani2002@gmail.com',
        to : 'raagbhutani@gmail.com',
        subject : "Contact Form Submission: Portfolio",
        html : `<p>Name : ${Name}</p>
        <p>Email : ${Email}</p>
        <p>Mobile : ${Mobile}</p>
        <p>Message : ${Message}</p>`
    };
    portfolioEmail.sendMail(Mail, (error) => {
        if(error)
            res.json(error);
        else
            res.json({code: 200, status: "Message Send"});
    });
});






const folioEmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    requireTLS: true,
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'raagbhutani@gmail.com',
        pass: 'ktlopncqumhwftct'
    },
});

folioEmail.verify((error) => {
    if(error)
        console.log(error);
    else
        console.log("Verified : Good to go !!");
})

app.post("/api/revertsubscribe/email", (req,res) => {
        const Mail = {
            from : 'raagbhutani@gmail.com',
            // to : 'raagbhutani@gmail.com , raagbhutani2002@gmail.com',
            to : req.body.mail,
            subject : "Thank You For Subscribing",
            html : `<p> <b>Welcome to Raag's Tech NewsLetter 👋.</b>
            <br/> We'd love to keep you up to date on the latest events and technological advances news from around the world. </p>`
        };
        folioEmail.sendMail(Mail, (error) => {
            if(error)
                res.json(error);
            else
                res.json({code: 200, status: "Message Send"});
        });
})