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
    }
}

module.exports = CommentsService;