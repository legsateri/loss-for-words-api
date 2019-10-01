require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const promptsRouter = require('./prompts/prompts-router');
const commentsRouter = require('./comments/comments-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}));
app.use(helmet());
app.use(cors());

app.use('/api/prompts', promptsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname+'/loss-for-words-app/public/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
})

module.exports = app;