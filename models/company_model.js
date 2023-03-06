const mongoose = require("mongoose");
const joi = require("joi");

const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

// *schema like model of company
const CompanySchema = new mongoose.Schema({
  companyName: { type: String, lowercase: false, minlength: 3, maxlength: 44, required: true },
  website: { type: String, lowercase: true, required: true, maxlength: 1024 },
  phoneNumber: { type: String, minlength: 4, maxlength: 20, },

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

    })
    .options({ abortEarly: false });

  return JoiSchema.validate(company);
}



//*export to use this scehma or function in different files
module.exports = mongoose.model("Company", CompanySchema);

module.exports.validateCompany = validateCompany;
