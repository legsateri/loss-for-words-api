////////////////////////////////////////////////////////////////////////////////
const path = require('path');
const express = require('express');
////////////////////////////////////////////////////////////////////////////////
const CommentsService = require('./comments-service');
const { requireAuth } = require('../middleware/jwt-auth');
////////////////////////////////////////////////////////////////////////////////
const commentsRouter = express.Router();
const jsonParser = express.json();
////////////////////////////////////////////////////////////////////////////////

commentsRouter
    .route('/')

    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        CommentsService.getAllComments(knexInstance)
            .then(comments => {
                res.json(comments);
            })
            .catch(next)
    })

    .post(requireAuth, jsonParser, (req, res, next) => {
        const { prompt_response, prompt_id } = req.body;
        const newComment = { prompt_response, prompt_id };

        for (const [key, value] of Object.entries(newComment))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing ${key} in request` }
                })

        newComment.user_id = req.user_user_id

        CommentsService.insertComments(
            req.app.get('db'),
            newComment
        )
            .then(comment => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                    .json(CommentsService.serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter
    .route('/user')

    .all(requireAuth)

    .get((reg, res, next) => {
        const user_id = req.user.user_id

        CommentsService.getCommentsByUser(
            req.app.get('db'),
            user_id
        )
            .then(comments => {
                res.json(comments.map(CommentsService.serializeCommentWithUser))
            })
            .catch(next)
    })

commentsRouter
    .route('/:comment_id')

    .all(requireAuth)

    .all((req, res, next) => {
        CommentsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(comment => {
                if (!comment) {
                    return res.status(404).json({
                        error: { message: `Comment does not exist` }
                    })
                }
                res.comment = comment;
                next()
            })
            .catch(next)
    })

    .get((req, res, next) => {
        res.json(res.comment);
    })

    .delete((req, res, next) => {
        CommentsService.deleteComments(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next)
    })

    .patch(jsonParser, (req, res, next) => {
        const { comment } = req.body
        updatedComment = {comment}

        CommentsService.updateComment(
            req.app.get('db'),
            req.params.id,
            updatedComment
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

commentsRouter
    .route('/clubs/:club_id')

    .all(requireAuth)

    get((req, res, next) => {
        CommentsService.getCommentsByPrompt(
            req.app.get('db'),
            req.params.prompt_id,
            req.user.user_id
        )
            .then(comments => {
                if(!comments.length) {
                    return res.status(404).json({
                        error: {message: `No comments exist for this prompt.`}
                    })
                }
                res.json(comments.map(CommentsService.serializeCommentWithUser))
            })
            .catch(next)
    })

module.exports = commentsRouter;