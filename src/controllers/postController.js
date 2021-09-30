const mongoose = require('mongoose');
const redis = require("redis");
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);

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
  try {
    await Post.findOne({ _id: req.params.postId }).then(item => {
      client.setex(req.params.postId, 2, JSON.stringify(item))
      res.send({
        postDetails: item,
        success: true
      })
    }).catch(err => {
      console.log(err)
      res.send("Error Occured")
    });
  } catch {
    res.send({ message: 'Exception occured' })
  }

};

const getPostsByUserId = async (req, res) => {
  await Post.find({ user: req.params.userId }).then(item => {
    res.send({
      item,
      success: true
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};



//cacheInRedis
const cacheMiddleware = (req, res, next) => {
  const { postId } = req.params;
  client.get(postId, (err, item) => {
    if (err) throw err

    if (item != null) {
      res.send({
        postDetails: JSON.parse(item),
        success: true
      })
    } else {
      next();
    }
  })
}


module.exports = {
  addPost,
  getPostById,
  UpdatePost,
  getPostsByUserId,
  cacheMiddleware
};
