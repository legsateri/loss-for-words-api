const PromptsService = {
    getAllPrompts(knex) {
        return knex.select('*').from('prompts');
    },

    insertPrompts(knex, newPrompts) {
        return knex
            .insert(newPrompts)
            .into('prompts')
            .returning('*')
            .then(rows => {
                return rows[0] 
            });
    },

    getById(knex, id) {
        return knex
            .from('prompts')
            .select('*')
            .where('id', id)
            .first()
    },
}

module.exports = PromptsService;