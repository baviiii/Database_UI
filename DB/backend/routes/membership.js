/**
 *  Express router to handle membership operations.
 *  @module routes/membership
 *
 *  @requires express
 *  @requires path
 *  @requires csv
 */

// Import relevant libraries
const express = require('express');
const path = require("path");                     // gets access to system paths, independent of os.
const csv = require("csvtojson");

const { MembershipModel } = require('../models'); // Get membership schema instance

const router = express.Router();                  // get router instance,

/**
 * Helper function to check whether a string is numeric
 * @param str String object to check
 * @returns {boolean} true if it's numeric, false otherwise
 */
function isNumeric(str) {
  if (typeof str == "string") return false;
  return isNaN(str) || isNaN(parseFloat(str));
}

/**
 * Route to create a new member.
 *
 * @name /create_member
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.post('/create_member',  async (req, res) => {
  const body = req.body; // get data sent from the client

  const member = new MembershipModel({
    ...body // extract the body object
  })

  try {
    const saved = await member.save(); // wait till the process is done
    res.status(201).json(saved); // 201 - created
  } catch(err) {
    res.status(500).json({ // send response to the user
      message: err.message
    })
  }
})


/**
 * Route to get all members
 *
 * @name /
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.get("/", async (req, res) => {
  try {
    const data = await MembershipModel.find(); // mongoose query to find all member objects
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

/**
 * Route to get one member object based on member id
 *
 * @name /id/:member_id
 * @param {string} :member_id id of the member
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 */
router.get("/id/:member_id", async (req, res) => {
  const id = req.params.member_id; // get the :member_id path variables
  try {
    // Filter membership models by member_id, and select the first one.
    const member = await MembershipModel.findOne({ member_id: id }).orFail();
    res.json(member);
  } catch(err) {
    res.status(400).json({
      "message": "no such member",
      "err": err.message
    })
  }
})


/**
 * Route to update a members information
 *
 * @name /update/id/:member_id
 * @param {string} member_id id of the member to modify
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.put("/update/id/:member_id", async (req, res) => {
  const id = req.params.member_id;
  const data = req.body;

  try {
    // Get the first member with id `id`, and update its information
    // $set, set the object's fields to the passed data
    await MembershipModel.updateOne({id: id}, { $set: {...data }}).orFail();
    res.status(200).json({
      "message": ""
    })
  } catch(err) {
    res.status(500).json({
      "message": "failed to update",
      "err": err
    })
  }
});

/**
 * Route to fund a members account
 *
 * @name /fund/:member_id
 * @param {string} member_id id of the member to modify
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.put("/fund/:member_id", async (req, res) => {
  const m_id = req.params.member_id;
  const body = req.body;

  console.log(`Funding: ${m_id}`);
  console.log(body);

  // Validate whether amount variable has been passed
  // and that it's numeric.
  if (body.amount === undefined || isNumeric(body.amount)) {
    console.error("Error: Bad Amount");
    res.status(400).json({
      "message": "invalid request. bad amount",
    })
    return
  }

  try {
    // Get the first member with member_id `m_id`,
    // increment their account balance by `body.amount`.
    // if the member exists
    await MembershipModel.updateOne(
      {member_id: m_id},
      {
        $inc: {
          account_balance: body.amount
        }
      }
    ).orFail().then(async () => {
      // Reduce their current balance to 1000, if it is more.
      await MembershipModel.updateOne(
          {member_id: m_id},
          {
            $min: {
              account_balance: 1000
            }}
      );
      console.log("Done Updating");
    });

    const member_new = await MembershipModel.findOne({member_id: m_id}).orFail();
    res.status(200).json({
      "message": "success",
      "body": member_new
    });

  }catch(err) {
    console.error(`Error:`);
    console.error(err.message);
    res.status(400).json({
      "message": "no such member",
      "err": err.message
    })
  }
})

/**
 * Route to upload a .csv file containing members
 *
 * @name /upload
 *
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.post("/upload", async (req, res) => {
  // Check whether a file has been uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    console.error("No file uploaded");
    res.status(400).send('No files were uploaded.');
    return;
  }

  const members_file = req.files.members;                       // get the file instance
  const file_path = path.resolve("extras/members.csv"); // Generate a path (independent of os) whether we'll temporarily
                                                                // store the .csv file
  console.log(file_path);

  // Copy the file object into our file system.
  await members_file.mv(file_path, async (err) => {
    if (err) {
      console.error("Error copying file");
      console.error(err);
      return res.status(500).send({
        "messaged": "failed",
        "info": err
      })
    }

    // noinspection JSCheckFunctionSignatures
    // Convert a .csv file into a JSON object
    csv({
      noHeader: false, // process the headers, which will be converted to JSON keys.
      output: "json"
    })
      .fromFile(file_path) // Set file to read
      .then(async (data) => { // read the file line by line, and return JSON `data` object
        for (let i = 0; i < data.length; i++) { // Loop through JSON array, `data`
          const obj = data[i];
          const member = new MembershipModel({...obj});
          try {
            const saved = await member.save(); // save that member
            console.log("Success");
            console.log(saved);
          } catch(err) {
            console.log("Failed");
            console.log(err);
          }
          console.log(obj);
        }
      })
    res.status(201).json({
      "message": "success"
    })
  })
});

/**
 * Route to delete a member
 *
 * @name /fund/:member_id
 * @param {string} member_id id of the member to modify
 * @inner
 * @param {object} req request object passed from the client, contains http request body
 * @param {object} res router response sent to the client
 *
 */
router.delete("/delete/:member_id", async (req, res) => {
  const id = req.params.member_id;
  try {
    // Find a member with id and delet
    await MembershipModel.findByIdAndDelete(id).orFail();
    res.status(200).json({
      "message": "deleted"
    });
  } catch(err) {
    res.status(400).json({message: err.message});
  }
});

module.exports = router