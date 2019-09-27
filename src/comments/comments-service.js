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

    deleteNotes(knex, id) {
        return knex('comments')
            .where({ id })
            .delete()
    },

    getByPromptId(knex, prompt_id) {
        return knex
            .from('comments')
            .select('*')
            .where('prompt_id', prompt_id)
            .first()
    }
}

module.exports = CommentsService;