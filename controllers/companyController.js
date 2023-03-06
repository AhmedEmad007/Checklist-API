const Company = require("../models/company_model");
const { validateCompany } = require("../models/company_model");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const companyCtr = {
  // * _________________________________GET FUNCTION_____________________________________________

  getCompany: async (req, res, next) => {
    let time;
    try {
      time = await Company.find().select("-__v");
      if (!time) {
        return res
          .status(404)
          .json({ status: false, message: "Cannot find Companys" });
      }

      return res
        .status(200)
        .json({ status: true, message: "Success", Company: time });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  },


  getCompanyById: async (req, res, next) => {
    const companyId = req.query.companyId;

    try {


      time = await Company.findOne({_id:ObjectId(companyId)} )
        
        .select("-__v");
        // let count  =0;
        // let lengthChecked = time.checks.length;
        // for(let i = 0;i<time.checks.length;i++){
        //   if(time.checks[i].ckecked == true){
        //     count++;
           
        //   }
        // }
        // console.log(count);
      if (!time) {
        return res
          .status(404)
          .json({ status: false, message: "Cannot find Companys" });
      }

      return res
        .status(200)
        .json({ status: true, message: "Success", Company: time });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  },

  // * ______________________________________CREATE FUNCTION__________________________

  createCompany: async (req, res, next) => {
 
    const validateError = validateCompany(req.body);
    let errors = [];
    if (validateError.error) {
      for (i = 0; i < validateError.error.details.length; i++) {
        errors[i] = validateError.error.details[i].message;
      }
      console.log(errors);
      console.log(validateError.error);
      return res.status(400).json({
        status: false,
        message: errors,
      });
    }
    let newCompany;
    try {

    

      const orders = new Company({
        companyName: req.body.companyName,
        website: req.body.website,
        phoneNumber: req.body.phoneNumber,
      });

      newCompany = await orders.save();

      // res.newtime = newtime
      return res
        .status(201)
        .json({ status: true, message:[ "Success"], Company: newCompany});
    } catch (err) {
      console.log(err);
      return res.status(400).json({ status: false, message: [err] });
    }
  },

  // ? ______________________________________UPDATE FUNCTION_____________________________

  updateCompany: async (req, res) => {
    const { id, name, assign } = req.body;
    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Company.findById(ObjectId(id));
      console.log(name);
      console.log(assign);

      if (check) {
        if (check.reporter == user.id) {
          const result = await Company.updateOne(
            {
              _id: req.body.id,
            },
            {
              $set: {
                CompanyName: req.body.name,
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

  //     const check = await Company.findById(ObjectId(id));

  //     for(let i =0 ; i<check.checks.length;i++){
  //      const checks = check.checks[i]
  //      if(checks._id == checksId){
  //        console.log(checks)

  //        if (check) {
  //         if (check.reporter == user.id) {
  //           const result = await Company.updateOne(
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

      const check = await Company.findById(ObjectId(id));
   

      if (check) {
        const   result = await Company.updateOne(
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

  updateRemoveCompanyAssignee: async (req, res) => {
    const { id, assign } = req.body;
    const removeAssignee = req.query.removeAssignee;
    const addAssigne = req.query.addAssigne;
    const addChecks = req.query.addChecks;
    const updateCheck = req.query.updateCheck;
    const removeChecks = req.query.removeChecks;

    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Company.findById(ObjectId(id));

      let result;
      if (check) {
        if (check.reporter == user.id) {
          if (removeAssignee == "true") {
            result = await Company.updateOne(
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
            result = await Company.updateOne(
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
            const   result = await Company.updateOne(
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
            result = await Company.updateOne(
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
            result = await Company.updateOne(
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

  deleteCompany: async (req, res) => {
    const { id } = req.body;
    const token = req.header("x-auth-token");
    try {
      const check = await Company.findById(ObjectId(id));
      const user = jwt.verify(token, "privateKey");
      if (check) {
        if (check.reporter == user.id) {
          const result = await Company.deleteOne({
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
module.exports = companyCtr;
