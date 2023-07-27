// Path: server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const commentsRouter = require('./routes/comments');

app.use('/comments', commentsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Path: comments.js

const router = require('express').Router();
let Comment = require('../models/comment.model');

router.route('/').get((req, res) => {
  Comment.find()
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const date = Date.parse(req.body.date);

  const newComment = new Comment({
    username,
    description,
    date,
  });

  newComment.save()
  .then(() => res.json('Comment added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Comment.findById(req.params.id)
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(() => res.json('Comment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Comment.findById(req.params.id)
    .then(comment => {
      comment.username = req.body.username;
      comment.description = req.body.description;
      comment.date = Date.parse(req.body.date);

      comment.save()
        .then(() => res.json('Comment updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
});