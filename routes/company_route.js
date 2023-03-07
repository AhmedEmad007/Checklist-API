const express = require("express");

const router = express.Router();

const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const compCtrl = require("../controllers/companyController");

// ____________________________GETTING_________________________________

// get CheckIn middleware
router.get("/allCompany", compCtrl.getCompany);
router.get("/CompanyById",  compCtrl.getCompanyById);
// get CheckOut middleware
// router.get('/allCheckOut',timeCtrl.getCheckOut)

// // get CheckIn middleware
// router.get('/allCheckInRequests',[admin,timeCtrl.getCheckInRequest])
// // get CheckOut middleware
// router.get('/allCheckOutRequests',[admin,timeCtrl.getCheckOutRequest])

// // get time middleware
// router.get('/getCheckIn/:date',timeCtrl.getByDateCheckIn)
// // get time middleware
// router.get('/getCheckOut/:date',timeCtrl.getByDateCheckOut)

//* ________________________________CREATE_________________________________________

// Creating one Course
router.post("/newCompany",  compCtrl.createCompany);
router.post("/login",  compCtrl.login);

// router.post('/newCheckOut', [auth,timeCtrl.createCheckOut])

//? ____________________________________UPDATE____________________________________________

router.patch('/updateCompany', [auth,compCtrl.updateCompany])
router.patch('/updateChecks', [auth,compCtrl.updateChecks])
router.patch('/updateRemoveCompanyAssignee', [auth,compCtrl.updateRemoveCompanyAssignee])

// router.patch('/acceptCheckOut', [auth,timeCtrl.updateAcceptanceCheckOut])

//! _____________________________________________DELETE_____________________________________

router.delete('/deleteCompany', [auth,compCtrl.deleteCompany])

//! Deleting course

module.exports = router;
