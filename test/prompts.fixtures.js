function makePromptsArray() {
    return [
        {
            id: 1,
            prompt_content: 'Test prompt 1',
            category: 'Animals',
            author: 'Legs'

        },
        {
            id: 2,
            prompt_content: 'Test prompt 2',
            category: 'Comedy',
            author: 'Arms'

        },
        {
            id: 3,
            prompt_content: 'Test prompt 3',
            category: 'Horror',
            author: 'Heads'

        },
        {
            id: 4,
            prompt_content: 'Test prompt 4',
            category: 'Sports',
            author: 'Toes'

        },
    ]
}

module.exports = {
    makePromptsArray
}