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

    .post(jsonParser, (req, res, next) => {
        const { prompt_response, author, prompt_id } = req.body;
        const newComment = { prompt_response, author, prompt_id };

        for (const [key, value] of Object.entries(newComment)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request` }
                });
            }
        }
        const knexInstance = req.app.get('db');
        CommentsService.insertComments(
            knexInstance,
            newComment
        )
            .then(comment => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${comment.id}`))
                    .json(serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter
    .route('/:comment_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const routeParameter = req.params.comment_id;
        CommentsService.getById(knexInstance, routeParameter)
            .then(comment => {
                if (!comment) {
                    return res.status(404).json({
                        error: { message: 'Comment does not exist' }
                    });
                }

                res.comment = comment;
                next()
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeComment(res.comment));
    })
    .delete((req, res, next) => {
        CommentsService.deleteComments(
            req.app.get('db'),
            req.params.comment_id
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next)
    })

module.exports = commentsRouter;