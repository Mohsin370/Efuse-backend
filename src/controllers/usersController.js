const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
// const { Users } = require("../../models");
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})


const encryptPassword = async (Password) => {
  let promise = new Promise((res, rej) => {
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(Password, salt, function (err, hash) {
        res(hash);
      });
    });
  });
  return promise.then((res) => {
    return res;
  });
};


const addUser = async (req, res) => {
  // const { email, name, password } = req.body.data;
  // let encryptedPassword = await encryptPassword(password);
  const Users = mongoose.model('Users', userSchema)
  const user = new Users(req.body)
  await user.save().then(item => {
    res.send("Saved to database")
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

  // try {
  //   const ExistingUser = await Users.findAll({
  //     where: { email: email },
  //   });

  //   if (ExistingUser.length > 0) {
  //     res.send({
  //       message: "User already Exist",
  //     });
  //     return 0;
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // try {
  //   let result = await Users.create({
  //     name,
  //     email,
  //     password: encryptedPassword,
  //   });
  //   if (result) {
  //     res.send({
  //       message: "success",
  //     });
  //   } else {
  //     res.send({
  //       message: "exists",
  //     });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.send({
  //     message:'Error',
  //     err,
  //   })
  // }
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
  const Users = mongoose.model('Users', userSchema)
  await Users.findOne({ _id: req.params.userId }).then(item => {
    res.send({
      userDetails:item,
      success:true
    })
  }).catch(err => {
    console.log(err)
    res.send("Error Occured")
  });

};

module.exports = {
  addUser,
  UpdateUser,
  getUser
};
