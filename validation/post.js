const validator = require("validator");
const isEmpty = require("./isEmty");

module.exports = function validatePostInput(data) {
  let { text } = data;

  let errors = {};

  text = !isEmpty(text) ? text : "";

  if (!validator.isLength(text, { min: 5 })) {
    errors.text = "Text of post must be at least 5 characters";
  }

  if (validator.isEmpty(text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
