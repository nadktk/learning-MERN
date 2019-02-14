const validator = require("validator");
const isEmpty = require("./isEmty");

module.exports = function validateExperienceInput(data) {
  let { title, company, location, from } = data;

  let errors = {};

  title = !isEmpty(title) ? title : "";
  company = !isEmpty(company) ? company : "";
  location = !isEmpty(location) ? location : "";
  from = !isEmpty(from) ? from : "";

  if (!validator.isLength(title, { min: 2, max: 30 })) {
    errors.title = "Job title must be between 2 and 30 characters";
  }

  if (validator.isEmpty(title)) {
    errors.title = "Job title field is required";
  }

  if (validator.isEmpty(company)) {
    errors.company = "Company field is required";
  }

  if (validator.isEmpty(location)) {
    errors.location = "Location field is required";
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
