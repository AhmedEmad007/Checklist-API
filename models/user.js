const mongoose = require("mongoose");
const joi = require("joi");

const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

// *schema like model of user
const UserSchema = new mongoose.Schema({
  userName: { type: String, lowercase: false, minlength: 3, maxlength: 44 },
  noId: { type: String, default: "" },
  email: { type: String, lowercase: true, required: true, maxlength: 1024 },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  department: { type: String, lowercase: true, minlength: 3, maxlength: 44 },
  isAdmin: { type: Boolean, default: false },

  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company",required:true },
});

//*validation on user inputs register
function validateUser(user) {
  const JoiSchema = joi
    .object({
      userName: joi
        .string()
        .min(3)
        .max(44)
        .regex(/[a-zA-Z]/)
        .lowercase(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(1024)
        .required()
        .trim(),

      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(5)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required()
        .messages({
          "password.minOfUppercase":
            "{#label} should contain at least {#min} uppercase character",
          "password.minOfSpecialCharacters":
            "{#label} should contain at least {#min} special character",
          "password.minOfLowercase":
            "{#label} should contain at least {#min} lowercase character",
          "password.minOfNumeric":
            "{#label} should contain at least {#min} numeric character",
          "password.noWhiteSpaces": "{#label} should not contain white spaces",
        }),

      department: joi
        .string()
        .min(3)
        .max(44)
        .regex(/[a-zA-Z]/)
        .lowercase(),

        company: joi
        .string(),
    })
    .options({ abortEarly: false });

  return JoiSchema.validate(user);
}

//*validation on user inputs in login
function validateUserLogin(user) {
  const JoiSchema = joi
    .object({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .min(3)
        .max(256)
        .required()
        .trim(),

      password: joiPassword
        .string()

        .noWhiteSpaces()
        .required(),
    })
    .options({ abortEarly: false });

  return JoiSchema.validate(user);
}

//*export to use this scehma or function in different files
module.exports = mongoose.model("User", UserSchema);

module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;
