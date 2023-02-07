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
    const repo = req.query.repo;
    const ownChecklist = req.query.ownChecklist;

    try {
      const user = jwt.verify(token, "privateKey");
      console.log(repo);
      const id = user.id;
      console.log(id);
      console.log(user.isAdmin);

      time = await Checklist.find(
        
        user.isAdmin == true
          ? { reporter: ObjectId(id), own: ownChecklist }
          : { assignee: ObjectId(id), own: ownChecklist }
      )
        .populate(
          "assignee reporter",
          "-__v -email -isAdmin -password -checklist"
        )
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
  getChecklistById: async (req, res, next) => {
    const token = req.header("x-auth-token");
    const checklistId = req.query.checklistId;

    try {
      const user = jwt.verify(token, "privateKey");
      const id = user.id;
      console.log(id);

      time = await Checklist.findOne({_id:ObjectId(checklistId)} )
        .populate(
          "assignee reporter",
          "-__v -email -isAdmin -password -checklist"
        )
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
    const ownChecklist = req.body.own;

    let newOrder;
    try {
      const user = jwt.verify(token, "privateKey");
      const id = user.id;
      console.log(id);

      const orders = new Checklist({
        checklistName: req.body.checklistName,
        checks: req.body.checks,
        assignee: ownChecklist == true ? ObjectId(id) : req.body.assignee,
        reporter: ObjectId(id),
        own: req.body.own,
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

  updateChecklist: async (req, res) => {
    const { id, name, assign } = req.body;
    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Checklist.findById(ObjectId(id));
      console.log(name);
      console.log(assign);

      if (check) {
        if (check.reporter == user.id) {
          const result = await Checklist.updateOne(
            {
              _id: req.body.id,
            },
            {
              $set: {
                checklistName: req.body.name,
                assignee: req.body.assign,
              },
            }
          );
          console.log(result);
          return res.json({ status: true, message: "Accepted" });
        } else {
          return res
            .status(403)
            .json({ status: false, message: "You are not allowed" });
        }
      } else {
        return res.status(404).json({ status: false, message: "not found" });
      }
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },

  // updateChecks: async (req, res) => {
  //   const { id,checksId } = req.body;
  //   const token = req.header("x-auth-token");
  //   try {
  //     const user = jwt.verify(token, "privateKey");

  //     const check = await Checklist.findById(ObjectId(id));

  //     for(let i =0 ; i<check.checks.length;i++){
  //      const checks = check.checks[i]
  //      if(checks._id == checksId){
  //        console.log(checks)

  //        if (check) {
  //         if (check.reporter == user.id) {
  //           const result = await Checklist.updateOne(
  //             {
  //               _id: req.body.checksId,
  //             },
  //             {
  //               $set: {

  //                 title: req.body.title,
  //                 description: req.body.description,
  //                 ckecked: req.body.ckecked,
  //               },
  //             }
  //           );
  //           console.log(result);
  //           return res.json({ status: true, message: "Accepted" });
  //         } else {
  //           return res
  //             .status(403)
  //             .json({ status: false, message: "You are not allowed" });
  //         }
  //       } else {
  //         return res.status(404).json({ status: false, message: "not found" });
  //       }
  //      }

  //     }

  //   } catch (error) {
  //     return res.status(400).json({ status: false, message: error.message });
  //   }
  // },

  updateChecks: async (req, res) => {
    const { id, checksId } = req.body;
    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Checklist.findById(ObjectId(id));
   

      if (check) {
        const   result = await Checklist.updateOne(
          {
            _id:req.body.id,
            "checks": { "$elemMatch": { "_id":  req.body.checksId  }}
            // "checks._id": req.body.checksId ,
          },
          {
            $set: {
              "checks.$.ckecked": req.body.ckecked
              // checks: {
                
              //   ckecked: req.body.ckecked,
              // },
            },
          }
        );
        console.log(result);
        return res.json({ status: true, message: "Accepted" });
      } else {
        return res.status(404).json({ status: false, message: "not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  },

  updateRemoveChecklistAssignee: async (req, res) => {
    const { id, assign } = req.body;
    const removeAssignee = req.query.removeAssignee;
    const addAssigne = req.query.addAssigne;
    const addChecks = req.query.addChecks;
    const updateCheck = req.query.updateCheck;
    const removeChecks = req.query.removeChecks;

    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Checklist.findById(ObjectId(id));

      let result;
      if (check) {
        if (check.reporter == user.id) {
          if (removeAssignee == "true") {
            result = await Checklist.updateOne(
              {
                _id: req.body.id,
              },
              {
                $pull: {
                  assignee: req.body.assign,
                },
              }
            );
          } else if (addChecks == "true") {
            console.log(req.body.title);
            result = await Checklist.updateOne(
              {
                _id: req.body.id,
              },
              {
                $push: {
                  checks: {
                    title: req.body.title,
                    description: req.body.description,
                    ckecked: req.body.ckecked,
                  },
                },
              }
            );
          }else if (updateCheck ==  'true'){
            const   result = await Checklist.updateOne(
              {
                _id:req.body.id,
                "checks": { "$elemMatch": { "_id":  req.body.checksId  }}
                // "checks._id": req.body.checksId ,
              },
              {
                $set: {
                  "checks.$.ckecked": req.body.ckecked
                  // checks: {
                    
                  //   ckecked: req.body.ckecked,
                  // },
                },
              }
            );
          } else if (removeChecks == "true") {
            console.log(req.body.title);
            result = await Checklist.updateOne(
              {
                _id: req.body.id,
              },
              {
                $pull: {
                  checks: {
                    _id: req.body.checksId,
                  },
                },
              }
            );
          } else if (addAssigne == "true") {
            result = await Checklist.updateOne(
              {
                _id: req.body.id,
              },
              {
                $push: {
                  assignee: req.body.assign,
                },
              }
            );
          }

          console.log(result);
          return res.json({ status: true, message: "Accepted" });
        } else {
          return res
            .status(403)
            .json({ status: false, message: "You are not allowed" });
        }
      } else {
        return res.status(404).json({ status: false, message: "not found" });
      }
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },

  // ! __________________________________________DELETE FINCTION____________________________

  deleteChecklist: async (req, res) => {
    const { id } = req.body;
    const token = req.header("x-auth-token");
    try {
      const check = await Checklist.findById(ObjectId(id));
      const user = jwt.verify(token, "privateKey");
      if (check) {
        if (check.reporter == user.id) {
          const result = await Checklist.deleteOne({
            _id: req.body.id,
          });
          console.log(result);
          return res.json({ status: true, message: "Deleted" });
        } else {
          return res
            .status(403)
            .json({ status: false, message: "You are not allowed" });
        }
      } else {
        return res.status(404).json({ status: false, message: "Not found" });
      }
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
};
module.exports = checklistCtr;
