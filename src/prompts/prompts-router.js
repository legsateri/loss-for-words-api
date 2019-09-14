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

module.exports = promptsRouter;