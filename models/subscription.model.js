const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose")

mongoose.connect(process.env.mongooseUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },).then(() => console.log('Connected Successfully')).catch((err) => {console.error(err)});

// const schema = new mongoose.Schema({ 
//     email: 'string'
// });

// export const Subscription = mongoose.model('Subscription', schema);

// export { Subscription };
