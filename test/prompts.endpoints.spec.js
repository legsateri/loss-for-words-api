const knex = require('knex');
const app = require('../src/app');
const { makePromptsArray } = require('./prompts.fixtures');

describe.only('Prompts endpoints', () => {
    let db;
    before('make knexInstance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db);
    })
})