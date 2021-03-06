const knex = require('knex');
const app = require('../src/app');
const { makePromptsArray } = require('./prompts.fixtures');
const { makeCommentsArray } = require('./comments.fixtures');

describe.only('Prompts endpoints', () => {
    let db;

    before('make knexInstance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the tables', () => db.raw('TRUNCATE prompts, comments RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE prompts, comments RESTART IDENTITY CASCADE'));

    describe('GET /api/prompts', () => {
        context('Given no prompts', () => {
            it('responds w/ 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/prompts')
                    .expect(200, [])
            })
        });

        context('Given there are prompts in the database', () => {
            const testPrompts = makePromptsArray();
            const testComments = makeCommentsArray();

            beforeEach('insert prompts', () => {
                return db
                    .into('prompts')
                    .insert(testPrompts)
                    .then(() => {
                        return db
                            .into('comments')
                            .insert(testComments)
                    })
            })

            it('responds w/ 200 and all the prompts', () => {
                return supertest(app)
                    .get('/api/prompts')
                    .expect(200, testPrompts)
            });
        });
    });

    describe('GET /api/prompts/:prompt_id', () => {
        context('Given no prompts', () => {
            it('responds w/ 404', () => {
                const promptId = 12345;
                return supertest(app)
                    .get(`/api/prompts/${promptId}`)
                    .expect(404)
            })
        });

        context('Given there prompts in the database', () => {
            const testPrompts = makePromptsArray();
            const testComments = makeCommentsArray();

            beforeEach('insert prompts', () => {
                return db
                    .into('prompts')
                    .insert(testPrompts)
                    .then(() => {
                        return db
                            .into('comments')
                            .insert(testComments)
                    })
            });

            it('responds w/ 200 and the specified prompt', () => {
                const promptId = 2;
                const expectedPrompt = testPrompts[promptId - 1];
                return supertest(app)
                    .get(`/api/prompts/${promptId}`)
                    .expect(200, expectedPrompt)
            })
        })
    });

    describe('DELETE /api/prompts/:prompt_id', () => {

        context('Given no prompts', () => {
            it('responds w/ 404', () => {
                const promptId = 12345;
                return supertest(app)
                    .delete(`/api/prompts/${promptId}`)
                    .expect(404, {
                        error: { message: 'Prompt does not exist' }
                    })
            });
        });

        context('Given there are prompts in the db', () => {
            const testComments = makeCommentsArray();
            const testPrompts = makePromptsArray();

            before('insert prompts', () => {
                return db
                    .into('prompts')
                    .insert(testPrompts)
                    .then(() => {
                        return db
                            .into('comments')
                            .insert(testComments)
                    })
            });

            it('responds w/ 204(no content) and removes the prompt', () => {
                const idToRemove = 2;
                const expectedPrompts = testPrompts.filter(prompts => prompts.id !== idToRemove);
                return supertest(app)
                    .delete(`/api/prompts/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        request(app)
                            .get(`/api/prompts`)
                            .expect(expectedPrompts)
                    );
            });
        });
    });

    describe('POST /api/prompts', () => {
        it('creates a prompt, responding w/ 201 and the new prompt', () => {
            const newPrompt = {
                id: 40,
                prompt_content: 'Brand New Prompt',
                category: 'Animals',
                author: 'Eyes'
            };
            return supertest(app)
                .post('/api/prompts')
                .send(newPrompt)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.prompt_content).to.eql(newPrompt.prompt_content);
                    expect(res.body.category).to.eql(newPrompt.category);
                    expect(res.body.author).to.eql(newPrompt.author);
                    expect(res.headers.location).to.eql(`/api/prompts/${res.body.id}`);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/prompts/${res.body.id}`)
                        .expect(res.body)
                );
        });

        const requiredPromptFields = ['prompt_content', 'category', 'author'];
        requiredPromptFields.forEach(field => {
            const newPrompt = {
                prompt_content: 'Test new prompt',
                category: 'Comedy',
                author: 'Eyebrows'
            };

            it(`responds w/ 400 and an error when the ${field} is missing`, () => {
                delete newPrompt[field];

                return supertest(app)
                    .post('/api/prompts')
                    .send(newPrompt)
                    .expect(400, {
                        error: { message: `Missing ${field} in request` }
                    })
            });
        });
    });
})