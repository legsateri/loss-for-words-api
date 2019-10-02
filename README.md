# Loss For Words App

A community creative writing prop application. Users can find prompts that inspire them, comment with their own words, and submit new prompts for other people to respond to. 

## Motivation

We wanted a book recommendation app that was community driven. Books and lists are all created by the users.

Writers block is a very common thing, whether you simply write on occasion or professionally. I wanted to provide inspiration that is practical, fun to use, and engages users in a conversation.

## Environment Setup

1. Setup your own postgress server
2. Run the 001.do.create_prompts.sql and  002.do.create_comments.sql files to build your table structure
3. Create a .env file in your server folder which contains the path to your database
4. Run the seed.lossforwords_tables.sql and trunc.lossforwords_tables.sql diles to seed your database.
5. Run your project with
```
npm run dev
```

## Running Tests

To run tests, run
```
npm test
```

## Built With

### Back-End
* Postgress
* Express
* Node
* Knex

### Testing
* Mocha
* Chai

## Features

* GET all writing prompts
* DELETE individual writing prompts
* POST a writing prompt
* GET all comments
* DELETE individual comments
* POST a comment

## Demo

- [Live Demo](https://loss-for-words-app.legsateri.now.sh/)

## Client

- [Client Repo](https://github.com/legsateri/loss-for-words-app)