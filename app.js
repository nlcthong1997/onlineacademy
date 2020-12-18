const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('express-async-errors');
require('dotenv').config();

const app = express();
const PORT = process.env.APP_PORT;
const auth = require('./middlewares/auth.mdw');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// APIs
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));
app.get('/', auth, (req, res) => {
    return res.json('Hello word');
});

// all url above if not match then into default url under 
app.use((req, res, next) => {
    res.status(404).send({
        error_message: 'Endpoint not found!'
    })
});

// handling errors when use throw
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({
        message: 'Error!',
        errors: err
    })
});

app.listen(PORT, () => {
    console.log(`App is running http://localhost:${PORT}`);
})