////////////////////////////////////////////////////////////////////////////////
const xss = require('xss')
////////////////////////////////////////////////////////////////////////////////

const CommentsService = {
    insertComments(knex, newComment) {
        return knex
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(([comment]) => comment)
    },

    serializeComment(comment) {
        return {
            id: comment.id,
            prompt_response: xss(comment.prompt_response),
            prompt_id: comment.prompt_id,
            user_id: comment.user_id
        }
    },

    serializeCommentWithPromptInfo(comment) {
        const { prompt } = comment
        return {
            id: comment.id,
            prompt_response: comment.prompt_response,
            prompt_id: comment.prompt_id,
            user_id: comment.user_id,
            prompt: {
                id: prompt.id,
                prompt_content: prompt.prompt_content,
                category: prompt.category,
                author: prompt.author
            }
        }
    },

    getCommentsByUser(db, user_id) {
        return db
            .from('comments AS comment')
            .select(
                'comment.id',
                'comment.prompt_id',
                'comment.prompt_response',
                'comment.user_id',
                db.raw(
                    `row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    user.user_id,
                                    user.full_name,
                                    user.email,
                                    user.date_modified
                            ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .leftJoin(
                'users AS user',
                'comment.user_id',
                'user.user_id',
                'user.full_name'
            )
            .where('comment.id', id)
            .first()
    },

    getAllComments(knex) {
        return knex
            .select('*')
            .from('comments')
    },

    getById(knex, id) {
        return knex('comments')
            .where('id', id)
            .first()
    },

    deleteComment(knex, id) {
        return knex('comments')
            .where({ id })
            .delete()
    },

    updateComment(knex, id, updatedComment) {
        return knex('comments')
            .where({id})
            .update(updatedComment)
    },

    getCommentsByPrompt(db, club_id, user_id) {
        return db
            .from('comments AS comment')
            .select(
                'comment.prompt_response',
                'comment.prompt_id',
                'comment.user_id',
                'user.full_name'
            )
            .where('comment.prompt_id', prompt_id)
            .leftJoin(
                'users AS user',
                'comment.user_id',
                'user.user_id'
            )
    },

    serializeCommentWithUser(comment) {
        return {
            id: comment.id,
            prompt_response: xss(comment.prompt_response),
            prompt_id: comment.prompt_id,
            user_id: comment.user_id,
            full_name: comment.full_name
        }
    }

}

module.exports = CommentsService;