const mongoose = require('mongoose');
// const redis = require("redis");
// const REDIS_PORT = process.env.PORT || 6379;
// const client = redis.createClient(REDIS_PORT);

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})


const addUser = async (req, res) => {
  const Users = mongoose.model('Users', userSchema)
  const user = new Users(req.body)
  await user.save().then(item => {
    res.send("Saved to database")
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });
};

const UpdateUser = async (req, res) => {
  const Users = mongoose.model('Users', userSchema)
  await Users.findByIdAndUpdate(req.params.userId, req.body).then(item => {
    res.send("User Updated")
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};


const getUser = async (req, res) => {
  try {
    const Users = mongoose.model('Users', userSchema)
    await Users.findOne({ _id: req.params.userId }).then(item => {
      if (item) {
        // client.setex(req.params.userId, 2, JSON.stringify(item))
        res.send({
          success: true,
          item
        })
      }
    }).catch(err => {
      console.log(err)
      res.send("Error Occured")
    });
  } catch {
    res.send({ message: 'Exception occured' })
  }
};


//cacheInRedis
const cacheMiddleware = (req, res, next) => {
  const { userId } = req.params;
  client.get(userId, (err, item) => {
    if (err) throw err

    if (item != null) {
      res.send({
        success: true,
        item: JSON.parse(item)
      })
    } else {
      next();
    }
  })
}

module.exports = {
  addUser,
  UpdateUser,
  getUser,
  cacheMiddleware
};
