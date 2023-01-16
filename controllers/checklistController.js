const Checklist = require("../models/check_model");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const checklistCtr = {
  // * _________________________________GET FUNCTION_____________________________________________

  getChecklist: async (req, res, next) => {
    let time;
    try {
      time = await Checklist.find().select("-__v");
      if (!time) {
        return res
          .status(404)
          .json({ status: false, message: "Cannot find checklists" });
      }

      return res
        .status(200)
        .json({ status: true, message: "Success", checklist: time });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  },
  getUserChecklist: async (req, res, next) => {
    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");
      console.log(user);
      const id = user.id;
      console.log(id);
      time = await Checklist.find({ assignee: ObjectId(id) })
        .populate("reporter", "-__v -email -isAdmin -password -checklist")
        .select("-__v");
      if (!time) {
        return res
          .status(404)
          .json({ status: false, message: "Cannot find checklists" });
      }

      return res
        .status(200)
        .json({ status: true, message: "Success", checklist: time });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  },

  // * ______________________________________CREATE FUNCTION__________________________

  createChecklist: async (req, res, next) => {
    const token = req.header("x-auth-token");

    let newOrder;
    try {
      const user = jwt.verify(token, "privateKey");
      console.log(user);
      const id = user.id;
      console.log(id);

      const orders = new Checklist({
        checklistName: req.body.checklistName,
        checks: req.body.checks,
        assignee: req.body.assignee,
        reporter: ObjectId(id),
      });

      newOrder = await orders.save();

      // res.newtime = newtime
      return res
        .status(201)
        .json({ status: true, message: "Success", checklist: newOrder });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ status: false, message: err });
    }
  },

  // ? ______________________________________UPDATE FUNCTION_____________________________

  // updateAcceptanceCheckIn: async (req, res) => {

  //     const {id, acceptance} = req.body
  //     const token = req.header('x-auth-token')
  //     try {

  //         const check = await CheckIn.findById(ObjectId(id))
  //         console.log(check)
  //         if (check) {
  //             const result = await CheckIn.updateOne({
  //                 _id: req.body.id
  //             }, {$set: req.body})
  //             console.log(result)
  //             return res.json({status: 'ok', message: 'Accepted'})
  //         } else {
  //             return res.status(404).json({status: 'false', message: 'not found'})
  //         }

  //     } catch (error) {

  //         return res.status(400).json({status: 'false', message: error.message})
  //     }
  // },

  // updateAcceptanceCheckOut: async (req, res) => {

  //     const {id, acceptance} = req.body
  //     const token = req.header('x-auth-token')
  //     try {

  //         const check = await CheckOut.findById(ObjectId(id))
  //         console.log(check)
  //         if (check) {
  //             const result = await CheckOut.updateOne({
  //                 _id: req.body.id
  //             }, {$set: req.body})
  //             console.log(result)
  //             return res.json({status: 'ok', message: 'Accepted'})
  //         } else {
  //             return res.status(404).json({status: 'false', message: 'not found'})
  //         }
  //     } catch (error) {

  //         return res.json({status: 'false', message: error.message})
  //     }
  // },

  // ! __________________________________________DELETE FINCTION____________________________
};
module.exports = checklistCtr;
