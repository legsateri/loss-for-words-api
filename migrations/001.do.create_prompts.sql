CREATE TABLE lossforwords_prompts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    prompt_content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL
);