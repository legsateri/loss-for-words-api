BEGIN;

TRUNCATE
    prompts,
    comments
    RESTART IDENTITY CASCADE;

INSERT INTO prompts (prompt_content, category, author)
VALUES  
    ('If you could have any zoo animal as a puppy-sized pet, what would you do?', 'Animals', 'Unkown'),
    ('A Guide to Caring for Your Invisible Pet', 'Animals', 'Unkown'),
    ('A sweaty and medicated superhero who is hiding from a coal miner in plain sight.', 'Comedy', 'Unknown'),
    ('Tell this story: I have seen a few fridge related disasters in my life, but this was the fridge disaster to end all fridge disasters.', 'Comedy', 'Unknown'),
    ('You are in the mountain forest when you come face-to-face with the snow dragon: an adorable, furry, and surprisingly tiny creature who breathes fire.', 'Fantasy', 'Unknown'),
    ('You have discovered a magical bowl that automatically refills with whatever you choose, with one restriction: It can not be money. What do you do?', 'Fantasy', 'Unkown'),
    ('A writer loses the ability to distinguish reality from the fantastical worlds of their stories.', 'Fiction', 'Unknown'),
    ('A single mother leaves her two teenage boys home alone for the summer.', 'Fiction', 'Unknown'),
    ('A serial killer confesses to his crimes, in detail.', 'Horror', 'Unkown'),
    ('The Halloween party was a pretty standard affair. Or, at least it was until Gary fell over dead.', 'Horror', 'Unkown'),
    ('A young police detective must find the kidnapped daughter of the mayor. The hitch? She was at a Star Trek convention when she was kidnapped, and the only description of the culprite is that he looked like Mr. Spock.', 'Mystery', 'Unknown'),
    ('You are legally allowed to commit murder once, but you must first fill out the proper paperwork... and your proposed victim must be notified of your intentions.', 'Mystery', 'Unknown'),
    ('Write a letter to your dad.', 'Nonfiction', 'Unknown'),
    ('Narrate a photo: Find a picure that intrigues you and write about it. What does it remind you of? How does it make you feel? What does it make you think about?', 'Nonfiction', 'Unknown'),
    ('Create a haiku about your favorite food.', 'Poems', 'Unknown'),
    ('Write the song that a super villain sings in the shower every morning to get mentally prepared for the day.', 'Poems', 'Unknown'),
    ('Boy meets girl. Boy falls in love with girl. The catch? Their parents are engaged to be married.', 'Romance', 'Unknown'),
    ('A skeptic who does not believe in psychics falls in love with a psychic, who is the real deal.', 'Romance', 'Unknown'),
    ('Your main character is the warden of a virtual-reality prison. One day, a notorious murderer attempts to orchestrate a “breakout.”', 'Science Fiction', 'Unknown'),
    ('A troubled teenager discovers he has the power to see peoples futures by touching them. When he accidentally bumps into a man on the subway, he sees him piloting a spaceship and it is headed straight toward the city. Now he must find the man—and convince everyone else that the fanger is real.', 'Science Fiction', 'Unknown'),
    ('Write about your favorite sports hero.', 'Sports', 'Unknown'),
    ('What would you do after winning the World Series?', 'Sports', 'Unknown');

COMMIT;