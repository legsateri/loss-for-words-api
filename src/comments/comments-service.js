const CommentsService = {
    getAllComments(knex) {
        return knex.select('*').from('comments');
    },

    insertComments(knex, newComments) {
        return knex
            .insert(newComments)
            .into('comments')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },

    deleteComments(knex, id) {
        return knex('comments')
            .where({ id })
            .delete()
    },

    getById(knex, id) {
        return knex
            .from('comments')
            .select('*')
            .where('id', id)
            .first()
    }
}

module.exports = CommentsService;