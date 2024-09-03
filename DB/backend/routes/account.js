const express = require('express');
const bcrypt = require('bcrypt');

const { AccoutModel, AccountModel } = require('../models');

const router = express.Router();
const saltRounds = 10;

// Create Account
router.post("/customer", async (req, res) => {
  const body = req.body;
  const password = body.password.toString();
  
  bcrypt.hash(password, saltRounds, async function(err, hash) {
    if (err) {
      console.log(err)
      res.status(400).send({
        message: err.message
      })
      return
    }
    const account = new AccountModel({
      email: body.email,
      password: hash,
    });

    try {
      const saved = await account.save();
      res.status(201).json(saved);
    } catch(err) {
      res.status(400).json({
        message: err.message
      });
    }
  });
});

router.get("/customer/all", async (req, res) => {
  try {
    const data = await AccountModel.find();
    res.json(data);
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.get("/customer/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await AccountModel.findById(id);
    res.json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
})

router.post("/customer/login", async (req, res) => {
  const body = req.body;
  try {
    const data = await AccountModel.findOne({email: body.email});
    if (!data) {
      res.status(400).json({
        "message": "Invalid credentials"
      })
      return
    }
    bcrypt.compare(body.password.toString(), data.password, (err, result) => {
      if (result) {
        res.status(200).send(data);
      } else {
        res.status(400).send({
          "message": "Invalid credentials"
        })
      }
      return
    });
  } catch (err) {
    res.status(400).json({
      "message": err.message
    })
  }
})


module.exports = router