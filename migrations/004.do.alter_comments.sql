  
ALTER TABLE comments
    ADD COLUMN
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL;