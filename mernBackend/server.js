const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

require('./config/mongoose.config');

app.use(cors(),express.urlencoded({extended:true}),express.json());

require('./routes/user.routes')(app);
require('./routes/board.routes')(app);
require('./routes/task.routes')(app);
require('./routes/column.routes')(app);

app.listen(port,() => console.log(`Listening on port ${port}`));