// CronJobs are processes which run at specific times and days. To set it up in Node.JS, we use node-scheduler, but the basic syntax of a CronJob remains the same in most scheduler systems.
const mail = require("nodemailer");
const fs = require('fs');
const cheerio = require('cheerio');
const mongoose = require("mongoose");
// require("./src/models/subscription.model");
require('../models/subscription.model')
const Scheme = mongoose.Schema;
const schema = new Scheme({ 
    email: 'string'
});
const Subscription = new mongoose.model('Subscription', schema);
const mailer = async function(title, obj) {	
    try {
        var txt;
        let email = await fs.readFile('./src/daemons/templates/mai.html', { encoding:'utf-8' }, function(err, result) {
            if(err) 
                console.log('error', err);
            else{
                var $ = cheerio.load(result);
                $('h1').text(obj.content);
                console.log($('h1').html());
                fs.writeFile('./src/daemons/templates/mai.html', $.html(), function(err, result) {
                    if(err) 
                        console.log('error', err);
                });
                txt = $.html();
            }
        });
        let emtxt = await fs.readFile('./src/daemons/templates/mai.html', { encoding:'utf-8' }, function(err, result) {
            if(err) 
                console.log('error', err);
            else{
                txt = result;
            }
        });
        // let text = email.replace(obj);
        console.log("Inside nodemailer");
        let transporter = mail.createTransport({
            host: process.env.contactHost,
            port: 587,
            maxMessages: Infinity,
            debug: true,
            secure: false,
            logger: true,
            secureConnection: false,
            auth:{
                user: process.env.contactEmail,
                pass: process.env.contactPassword
            },
            requireTLS: true,
        });
        console.log("Transpoter Created");
        // let findEmail = await Subscription.find({ "email" : "raagbhutani2002@gmail.com"});
        //     if(findEmail.length > 0) {
        //         console.log("sjjjjjjjjjvkdfvnkdnvkdvjdkjvn");
        //         transporter.sendMail({
        //             // from   : `${process.env.contactEmail} <${process.env.contactEmail}>`,
        //             from : 'Raag Bhutani <"raagbhutani@gmail.com">',
        //             to : "raagbhutani2002@gmail.com",
        //             subject: title,
        //             // replyTo: process.env.contactEmail,
        //             replyTo: 'raagbhutani@gmail.com',
        //             headers: { 'Mime-Version' : '1.0', 'X-Priority' : '3', 'Content-type' : 'text/html; charset=iso-8859-1' },
        //             // html   : text
        //             html : `<p>Name : HElloo</p>
        //                     <p>Email : wellcome</p>
        //                     <p>Mobile : sfsd</p>
        //                     <p>Message : sfdsdsf</p>`
        //         }, (err, info) => {
        //             if(err !== null) {
        //                 console.log(err);
        //             }
        //             else {
        //                 console.log(`Email sent to ${findEmail} at ${new Date().toISOString()}`);
        //             }
        //         });
        //     }else{
        //         console.log("MailDoesnotExist");
        //     }






        let allSubs = await Subscription.find();
        allSubs.forEach(function(item) {
            if(typeof item.email !== "undefined") {
                // console.log(item.email);
                transporter.sendMail({
                    from   : `${process.env.contactEmail} <${process.env.contactEmail}>`,
                    to : item.email,
                    subject: title,
                    replyTo: process.env.contactEmail,
                    headers: { 'Mime-Version' : '1.0', 'X-Priority' : '3', 'Content-type' : 'text/html; charset=iso-8859-1' },
                    html: txt
                }, (err, info) => {
                    if(err !== null) {
                        console.log(err);
                    }
                    else {
                        console.log(`Email sent to ${item.email} at ${new Date().toISOString()}`);
                    }
                });
            }
        });

    } catch(e) {
        console.log(e);
    }
}

// Run the CronJob
const cron = require('node-cron');
const shell = require('shelljs');
// schedule.scheduleJob('*/10 * * * * *', async function() {
// cron.schedule('*/10 * * * * *', async function(){
cron.schedule('45 23 * * 6', async function() {
    console.log("Scheduler Running");
    try {
        mailer(`Weekly NewsLetter`, {
            'content' : "Technical NewsLetter 👋"
        });
    } catch(e) {
        console.log(e);
    }
    // if(shell.exec('dir').code !==0)
    //     console.log("Something went Wrong");
});
