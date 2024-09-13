const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ error: 'Something went wrong!', details: err }));
  },
  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: 'Failed to create user', details: err }));
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ error: 'Failed to update user', details: err }));
  },
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: 'User and associated thoughts successfully deleted!' }))
      .catch(err => res.status(500).json({ error: 'Failed to delete user', details: err }));
  },
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ error: 'Failed to add friend', details: err }));
  },
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ error: 'Failed to remove friend', details: err }));
  },
};
