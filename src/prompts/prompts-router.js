const path = require('path');
const express = require('express');
const xss = require('xss');
const PromptsService = require('./prompts-service');

const promptsRouter = express.Router();
const jsonParser = express.json();

const serializePrompt = prompt => ({
    id: prompt.id,
    prompt_content: xss(prompt.prompt_content),
    category: xss(prompt.category),
    author: xss(prompt.author)
});

promptsRouter
    .route('/')

    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        PromptsService.getAllPrompts(knexInstance)
            .then(prompts => {
                res.json(prompts.map(serializePrompt));
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { prompt_content, category, author } = req.body;
        const newPrompt = { prompt_content, category, author };
        for (const [key, value] of Object.entries(newPrompt)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request` }
                });
            }
        }
        const knexInstance = req.app.get('db');
        PromptsService.insertPrompts(
            knexInstance,
            newPrompt
        )
            .then(prompt => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${prompt.id}`))
                    .json(serializePrompt(prompt))
            })
            .catch(next)
    })

promptsRouter
    .route('/:prompt_id')

    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const routeParameter = req.params.prompt_id;
        PromptsService.getById(knexInstance, routeParameter)
            .then(prompt => {
                if (!prompt) {
                    return res.status(404).json({
                        error: { message: 'Prompt does not exist' }
                    });
                }
                res.prompt = prompt;
                next()
            })
            .catch(next);
    })

    .get((req, res, next) => {
        res.json(serializePrompt(res.prompt));
    })

    .delete((req, res, next) => {
        PromptsService.deletePrompts(
            req.app.get('db'),
            req.params.prompt_id
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next)
    })

module.exports = promptsRouter;