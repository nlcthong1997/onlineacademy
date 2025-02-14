const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('express-async-errors');
require('dotenv').config();

const app = express();
const PORT = process.env.APP_PORT;
const auth = require('./middlewares/auth.mdw');
const authorization = require('./middlewares/authorization.mdw');
let types = require('./types/user_role');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// APIs
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/categories', require('./routes/category.route'));
app.use('/api/courses', require('./routes/courses.route'));
app.use('/api/videos', require('./routes/video.route'));
app.use('/api/slides', require('./routes/slide.route'));
app.use('/api/love-list', auth, require('./routes/love_list.route'));
app.use('/api/feedbacks', auth, require('./routes/feedback.route'));

app.use('/api/admin', authorization([types.ADMIN]), require('./routes/admin.route'));

// all url above if not match then into default url under 
app.use((req, res, next) => {
    res.status(404).send({
        error: true,
        message: 'Endpoint not found!'
    })
});

// handling errors when use throw
app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(500).send({
        error: true,
        message: 'Error! ' + err,
    })
});

app.listen(PORT, () => {
    console.log(`App is running http://localhost:${PORT}`);
})