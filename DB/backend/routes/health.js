/**
 *  Express router to handle health operations
 *  @module routes/health
 *
 *  @requires express
 *  @requires path
 *  @requires csv
 */


const express = require('express');

const { MembershipModel, HealthApplicationModel } = require('../models');

const router = express.Router();

const mail = require('../utils/mail');

// Email Templates
const SUCCESSFUL_EMAIL = "Your funding has been approved";
const FAILED_APPLICATION_EMAIL = "You don't have enough funding.\n " +
    "Please contact the office for further enquiries.\n" +
    " Tel (08) 8642 2068";


/**
 * Route to get a specific health application
 *
 * @name /id/:id
 * @param {id} id health application id
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.get("/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await HealthApplicationModel.findById(id);
    res.status(200).json(data);
  } catch(err) {
    res.status(400).json({
      message: err.message
    })
  }
});

/**
 * Route to get health applications for a certain member.
 *
 * @name /member/:id
 * @param {string} id member id
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.get("/member/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await HealthApplicationModel.find({member: id});
    res.status(200).json(data);
  } catch(err) {
    res.status(400).json({
      message: err.message
    })
  }
})


/**
 * Route to create a new health application
 *
 * @name /new/apply
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.post('/new/apply/', async (req, res) => {
  const body = req.body;

  try{
    const m_body = {};

    for (const key in body) { // Format some values to values that can be input into the schema
      const value = body[key];
      if (key === "member") continue;       // ignore member
      if (key === "amount") {
        m_body[key] = parseFloat(value);    // change amount from str to number
      } else if (key === "common_holder") {
        m_body[key] = value === "on";       // change to boolean
      } else if (key === "self") {
        m_body[key] = value === "on";       // change to boolean
      } else if (key === "child") {
        m_body[key] = value === "on";       // change to boolean
      } else {
        m_body[key] = value;                // remain asis
      }
    }

    console.log(m_body);

    const data = await MembershipModel.findOne({email: body.email}).orFail(); // get instance a member
    const link = new HealthApplicationModel({
      member: data, // pass member instance to HealthApplication Schema
      ...m_body
    });

    const saved = await link.save();
    res.status(201).json(saved);
  }
  catch(error){
    res.status(400).json({message: error.message})
  }
});

/**
 * Route to approve a health application for a certain member.
 * Only succeeds if the member has enough funds in their account.
 *
 * @name /link/:application_id
 * @param {string} application_id Health application id to approve
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.put("/link/:application_id", async (req, res) => {
  // noinspection JSUnresolvedVariable
  const id = req.params.application_id;
  
  try{
    const data = await HealthApplicationModel.findById(id);
    console.log(data);
    const member = await MembershipModel.findById(data.member);

    console.log(member);

    // Check the member has enough funds in their account
    // noinspection JSUnresolvedVariable
    if (member.account_balance < data.amount) {
      // If not send an email notifying them of the error.
      // noinspection JSUnresolvedVariable
      const res = mail.sendEmail(member.email, "Kokatha Health Application",
        FAILED_APPLICATION_EMAIL
      )
      // noinspection JSUnresolvedVariable
      res.status(400).json({
        "message": "Insufficient funds",
        "balance": member.account_balance,
      })
      return
    }

    await HealthApplicationModel.findOneAndUpdate(
        {_id: data._id}, // filter
        {linked: true} // set to true, approved
    ).orFail();
    // noinspection JSUnresolvedVariable
    await MembershipModel.updateOne(
        {member_id: m_id},
        {
          $inc: {
            account_balance: -data.amount
          }
        }
    ).orFail()

    // Send a success email notification to the member
    // noinspection JSUnresolvedVariable
    await mail.sendEmail(member.email, "Kokatha Health Application",
        SUCCESSFUL_EMAIL
    )
    res.status(200).json({message: "success"});
  }catch(error) {
    res.status(400).json({message: error.message})
  }
})


module.exports = router;