const mongoose = require("mongoose");
const joi = require("joi");

const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

// *schema like model of company
const CompanySchema = new mongoose.Schema({
  companyName: { type: String, lowercase: false, minlength: 3, maxlength: 44, required: true },
  website: { type: String, lowercase: true, required: true, maxlength: 1024 },
  phoneNumber: { type: String, minlength: 4, maxlength: 20, },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  aproved: { type: Boolean, default: false },

});

//*validation on company inputs register
function validateCompany(company) {
  const JoiSchema = joi
    .object({
      companyName: joi
        .string()
        .min(3)
        .max(44)
        .regex(/[a-zA-Z]/)
        .lowercase(),
      website: joi
        .string()
        .domain({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(1024)
        .required()
        .trim(),
        phoneNumber: joi.string().min(4).max(20).pattern(/^[0-9]+$/).trim(),
        
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

    })
    .options({ abortEarly: false });

  return JoiSchema.validate(company);
}
function validateCompanyLogin(user) {
  const JoiSchema = joi
    .object({
      _id: joi
      .required()
      ,

      password: joiPassword
        .string()

        .noWhiteSpaces()
        .required(),
    })
    .options({ abortEarly: false });

  return JoiSchema.validate(user);
}


//*export to use this scehma or function in different files
module.exports = mongoose.model("Company", CompanySchema);

module.exports.validateCompany = validateCompany;
module.exports.validateCompanyLogin = validateCompanyLogin;

