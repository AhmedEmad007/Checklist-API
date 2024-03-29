const Company = require("../models/company_model");
const Users = require("../models/user");


const { validateCompany } = require("../models/company_model");
const { validateCompanyLogin } = require("../models/company_model");

const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
      time = await Company.findOne({ _id: ObjectId(companyId) }).select("-__v");
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
    const {
      companyName,
      website,
      password: plainTextPassword,
      phoneNumber,
   
    } = req.body;
  //  const  email = req.query.email
  //   const validateError = validateCompany(req.body);

  //   let errors = [];

  //   if (validateError.error) {
  //     for (i = 0; i < validateError.error.details.length; i++) {
  //       errors[i] = validateError.error.details[i].message;
  //     }
  //     console.log(errors);
  //     console.log(validateError.error);
  //     return res.status(400).json({
  //       status: false,
  //       message: errors,
  //     });
  //   }
  //  //* check in database by email
  //   let user = await Users.findOne({ email }).lean();

  //   //* if not exist return an error messge
  //   if (!user) {
  //     return res
  //       .status(400)
  //       .json({ status: false, message: ["Invalid email or password"] });
  //   }

    let newCompany = await Company.findOne({ companyName }).lean();

    //* if exist return an error messge
    if (newCompany) {
      return res
        .status(400)
        .json({ status: false, message: ["Compnay already in use"] });
    }

    try {
      newCompany = new Company(
        _.pick(req.body, ["companyName", "website", "phoneNumber", "password"])
      );

      //* crypt the password using bcrypt package
      newCompany.password = await bcrypt.hash(plainTextPassword, 10);
      //   user.userName = userNameCheck
      //* generate token that have his id
      const token = jwt.sign(
        { id: newCompany.id, approved: newCompany.aproved },
        "privateKey"
      );
      await newCompany.save();
      // console.log(user._id);

    //  const result= await Users.updateOne(
    //     {
    //       _id: user._id,
    //     },
    //     {
    //       $set: {
    //         isAdmin:true
    //       },
    //     }
    //   );
      // console.log(result);
      // res.newtime = newtime
      return res.status(201).json({
        status: true,
        message: ["Success"],
        id: newCompany.id,
        companyName: newCompany.companyName,
        website: newCompany.website,
        phoneNumber: newCompany.phoneNumber,
        aproved: newCompany.aproved,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ status: false, message: [err] });
    }
  },

  login: async (req, res) => {
    //* take the inputs from user and validate them
    const { _id, password: plainTextPassword } = req.body;

    const validateError = validateCompanyLogin(req.body);

    //* if validate error just send to user an error message
    console.log("error", validateError.error);
    let errors = [];

    if (validateError.error) {
      for (i = 0; i < validateError.error.details.length; i++) {
        errors[i] = validateError.error.details[i].message;
      }
      console.log(errors);
      return res.status(400).json({
        status: false,
        message: errors,
      });
    }
    if (!ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ status: false, message: ["Invalid Company!"] });
    }

    //* check in database by email
    let companyCheck = await Company.findOne({ _id }).lean();

    //* if not exist return an error messge
    if (!companyCheck) {
      return res
        .status(404)
        .json({ status: false, message: ["Company Not Found"] });
    }
    if (!companyCheck.aproved) {
      return res
        .status(401)
        .json({ status: false, message: ["Not Accepted yet!"] });
    }
    try {
      console.log(companyCheck.password);
      //* compare between password and crypted password of user
      const checkPassword = await bcrypt.compare(
        plainTextPassword,
        companyCheck.password
      );
      console.log(checkPassword);
      //* if password doesnt match return to user an error message
      if (!checkPassword) {
        return res
          .status(400)
          .json({ status: false, message: ["Invalid company or password"] });
      }

      //* generate token that have his id and if admin or not
      //  const token= createAccessToken(  { id: user._id, isAdmin: user.isAdmin })

      return res.status(200).json({
        status: true,
        message: ["Success"],
        companyName: companyCheck.companyName,
        companyId: companyCheck._id,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
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

  acceptOrRejectCompany: async (req, res) => {
    const { id, checksId } = req.body;
    const token = req.header("x-auth-token");
    try {
      const user = jwt.verify(token, "privateKey");

      const check = await Company.findById(ObjectId(id));

console.log(!(check.aproved))
      if (check) {
     
          const result = await Company.updateOne(
            {
              _id: req.body.id,
            },
            {
              $set: {
                aproved:!(check.aproved),
               
              },
            }
          );
          // console.log(result);
          return res.json({ status: true, message: "Accepted" });
     
      } else {
        return res.status(404).json({ status: false, message: "not found" });
      }
    } catch (error) {
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
          } else if (updateCheck == "true") {
            const result = await Company.updateOne(
              {
                _id: req.body.id,
                checks: { $elemMatch: { _id: req.body.checksId } },
                // "checks._id": req.body.checksId ,
              },
              {
                $set: {
                  "checks.$.ckecked": req.body.ckecked,
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
