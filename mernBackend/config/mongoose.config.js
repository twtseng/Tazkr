const mongoose = require('mongoose');
const db = 'tazkr';

mongoose.connect(`mongodb://localhost/${db}`, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}, err => console.log(err?`Couldn't connect to database: ${err}`:`Successfully connected to the database: ${db}`));