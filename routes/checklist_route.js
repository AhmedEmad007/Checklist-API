const express = require("express");

const router = express.Router();

const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const checklistCtrl = require("../controllers/checklistController");

// ____________________________GETTING_________________________________

// get CheckIn middleware
router.get("/allChecklist", checklistCtrl.getChecklist);
router.get("/userChecklist", [auth, checklistCtrl.getUserChecklist]);
router.get("/checklistById", [auth, checklistCtrl.getChecklistById]);
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
router.post("/newChecklist",  checklistCtrl.createChecklist);
// router.post('/newCheckOut', [auth,timeCtrl.createCheckOut])

//? ____________________________________UPDATE____________________________________________

router.patch('/updateChecklist', [auth,checklistCtrl.updateChecklist])
router.patch('/updateChecks', [auth,checklistCtrl.updateChecks])
router.patch('/updateRemoveChecklistAssignee', [auth,checklistCtrl.updateRemoveChecklistAssignee])

// router.patch('/acceptCheckOut', [auth,timeCtrl.updateAcceptanceCheckOut])

//! _____________________________________________DELETE_____________________________________

router.delete('/deleteChecklist', [auth,checklistCtrl.deleteChecklist])

//! Deleting course

module.exports = router;
