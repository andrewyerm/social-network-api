const { Thought, User } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then(thought => 
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
      )
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Thought created, but no user found with that ID' });
        }
        res.json('Created the thought 🎉');
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Thought deleted but no user with this thought' });
        }
        res.json({ message: 'Thought successfully deleted' });
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
};
