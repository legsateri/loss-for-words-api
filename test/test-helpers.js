const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            full_name: 'Test user 1',
            nickname: 'TU1',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            user_name: 'test-user-2',
            full_name: 'Test user 2',
            nickname: 'TU2',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            user_name: 'test-user-3',
            full_name: 'Test user 3',
            nickname: 'TU3',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            user_name: 'test-user-4',
            full_name: 'Test user 4',
            nickname: 'TU4',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ]
}

function makePromptsFixtures() {
    const testUsers = makeUsersArray()
    return { testUsers }
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
      prompts,
      comments,
      lossforwords_users
      RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('thingful_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('thingful_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

module.exports = {
    makeUsersArray,
    makePromptsFixtures,
    seedUsers,
    cleanTables
}