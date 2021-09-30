const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})
const Post = mongoose.model('Post', postSchema)



const addPost = async (req, res) => {
  const post = new Post(req.body)
  await post.save().then(item => {
    res.send({
      success: true
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};

const UpdatePost = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.postId, req.body).then(item => {
    res.send({
      success: true
      , item
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};


const getPostById = async (req, res) => {
  await Post.findOne({ _id: req.params.postId }).then(item => {
    res.send({
      postDetails: item,
      success: true
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};

const getPostsByUserId = async (req, res) => {
  await Post.find({ user: req.params.userId }).then(item => {
    res.send({
      allPosts: item,
      success: true
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};
module.exports = {
  addPost,
  getPostById,
  UpdatePost,
  getPostsByUserId
};
