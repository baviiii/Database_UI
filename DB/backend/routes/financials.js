/**
 *  Express router to manipulate financials
 *  @module routes/financials
 *
 *  @requires express
 */

const express = require('express');

const { FinanceModel, MembershipModel, HealthApplicationModel } = require('../models');

const router = express.Router();

/**
 * Route to get all transactions
 *
 * @name /transactions
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.get("/transactions", async (req, res) => {
  try {
    const data = await FinanceModel.find();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({
      "message": "failed",
      "err": err
    })
  }
})

/**
 * Route to fund kokatha company accounts.

 * @name /fund
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.post("/fund", async (req, res) => {
  try {
    // Create a financial object
    const data = new FinanceModel({
      amount: req.body.amount,
      type: "MONEY_IN",
      comment: "Finance Kokatha Company"
    });

    await data.save(); // save the model

    res.status(201).json({
      "message": "update",
      "data": data
    });
  } catch(err) {
    res.status(500).json({
      "message": "failed",
      "error": err
    });
  }
})

/**
 * Route to get the current financials stats
 *
 * @name /create_member
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.get("/stats", async (req, res) => {

  try {
    // Sum of the money that has been financed into the company.
    const balance = await FinanceModel.aggregate([
      {
        $match: {
          type: "MONEY_IN"
        }
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" }
        }
      }
    ])

    // Sum of money allocated to members
    const allocated = await MembershipModel.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: "$account_balance" }
        }
      }
    ])

    // Sum of money used in approved health applications
    const used = await HealthApplicationModel.aggregate([
      {
        $match: {
          linked: true
        }
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" }
        }
      }
    ]);

    const result = {
      balance: balance[0]["amount"] - allocated[0]["amount"],
      allocated: allocated[0]["amount"],
      linked: used[0]["amount"]
    }

    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({
      "message": "failed",
      "data": err
    })
  }
})

module.exports = router;