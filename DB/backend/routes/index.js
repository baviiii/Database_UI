const express = require('express');

const { MembershipModel, LinkModel } = require('../models');

const router = express.Router();

// Post Method
router.post('/post', (req, res) => {
  res.send("Post API");
})

// Create Membership
router.post('/create_member', async (req, res) => {
  const body = req.body;
  const member = new MembershipModel({
    ...body
  })

  try {
    const saved = await member.save();
    res.status(201).json(saved);
  } catch(err) {
    res.status(400).json({
      message: err.message
    })
  }
})

router.post('/create_link/:member_id', async (req, res) => {
  const id = req.params.member_id;
  const body = req.body;
  try{
    const data = await MembershipModel.findById(id);
    const link = new LinkModel({
      member: data,
      amount: body.amount,
      application_reason: body.application_reason,
      application_self: body.application_self,
      application_child: body.application_child,
      childs_name: body.childs_name
    })
    const saved = await link.save();
    res.status(201).json(saved);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})


module.exports = router;