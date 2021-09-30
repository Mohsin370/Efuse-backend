var jwt = require("jsonwebtoken");
const { accounts } = require("../../models");

const addCardDetails = async (req, res) => {
  const { accNo, accTitle, bankName, cardNo, token } = req.body.data;
  let decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      return decoded;
    }
  );
  if (decodedJWT) {
    try {
      let result = await accounts.create({
        acc_no: accNo,
        email: decodedJWT,
        acc_title: accTitle,
        bank_name: bankName,
        card_no: cardNo,
      });
      if (result) {
        res.send({
          message: "success",
        });
      } else {
        res.send({
          message: "DBError",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({
      message: "invalid_token",
    });
  }
};

const getAccounts = async (req, res) => {
  const token = req.query.token;
  let decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      return decoded;
    }
  );
  if (decodedJWT) {
    try {
      const result = await accounts.findAll({
        where: { email: decodedJWT },
      });
      if (result) {
        res.send({
          message: "success",
          accounts: result,
        });
      } else {
        res.send({
          message: "DBError",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({
      message: "invalid_token",
    });
  }
};

const deleteAccounts = async (req, res) => {
  const { id, token } = req.body.data;
  let decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      return decoded;
    }
  );
  if (decodedJWT) {
    try {
      let result = await accounts.destroy({ where: { id: id } });
      if (result) {
        res.send({
          message: "success",
        });
      } else {
        res.send({
          message: "DBError",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({
      message: "invalid_token",
    });
  }
};

const editAccounts = async (req, res) => {
  const { accNo, accTitle, bankName, cardNo, token, id } = req.body.data;

  let decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      return decoded;
    }
  );
  if (decodedJWT) {
    try {
      let result = await accounts.update(
        {
          acc_no: accNo,
          acc_title: accTitle,
          bank_name: bankName,
          card_no: cardNo,
        },
        { where: { id: id } }
      );
      if (result) {
        res.send({ message: "success" });
      } else {
        res.send({
          message: "DBError",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({
      message: "invalid_token",
    });
  }
};

module.exports = {
  addCardDetails,
  getAccounts,
  deleteAccounts,
  editAccounts,
};
