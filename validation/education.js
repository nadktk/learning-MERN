const validator = require("validator");
const isEmpty = require("./isEmty");

module.exports = function validateEducationInput(data) {
  let { school, degree, fieldofstudy, from } = data;

  let errors = {};

  school = !isEmpty(school) ? school : "";
  degree = !isEmpty(degree) ? degree : "";
  fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : "";
  from = !isEmpty(from) ? from : "";

  if (!validator.isLength(school, { min: 2, max: 50 })) {
    errors.school = "School title must be between 2 and 50 characters";
  }

  if (validator.isEmpty(school)) {
    errors.school = "School field is required";
  }

  if (validator.isEmpty(degree)) {
    errors.degree = "Degree field is required";
  }

  if (validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  if (!validator.toDate(from)) {
    errors.from = "Date is incorrect";
  }

  if (validator.isEmpty(from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
