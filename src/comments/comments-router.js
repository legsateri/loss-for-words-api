const path = require('path');
const express = require('express');
const xss = require('xss');
const CommentsService = require('./comments-service');

const commentsRouter = express.Router();
const jsonParser = express.json();

const serializeComment = comment => ({
    id: comment.id,
    prompt_response: xss(comment.prompt_response),
    author: xss(comment.author),
    prompt_id: comment.prompt_id
});

commentsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CommentsService.getAllComments(knexInstance)
            .then(comments => {
                res.json(comments.map(serializeComment));
            })
            .catch(next)
    })

module.exports = commentsRouter