const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose")

mongoose.connect(process.env.mongooseUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, err => {
        if (!err) {
            console.log("Connection Succeded")
        } else {
            console.log("Error in connection" + err)
        }
});

// const schema = new mongoose.Schema({ 
//     email: 'string'
// });

// export const Subscription = mongoose.model('Subscription', schema);

// export { Subscription };
