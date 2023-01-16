const express = require("express");
const userCtrl = require("../controllers/userController");

const router = express.Router();
const auth = require("../middleware/auth");

//*______________________________GETTIG_____________________________

//* middleware auth check first if user loged in and have a token
router.get("/get-profile", auth, userCtrl.profile);

// Getting Author Contents
router.get("/profile/:id", userCtrl.getUserId);

// Getting all
router.get("/allUsers", userCtrl.allUsers);

// Getting users count
router.get("/usersCount", userCtrl.getUserCount);

// Getting user
router.get("/getUser/:search", userCtrl.getUser);

//* ____________________________________________CREATING_______________________________

/*   router.post('/upload-profile',auth,upload.single('profile'),userCtrl.uploadProfile); */

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

// change password
router.post("/change-password", [auth, userCtrl.changePassword]);

//? ______________________________________UPDATE________________________________________

// Updating One

module.exports = router;
