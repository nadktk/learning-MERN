const validator = require("validator");
const isEmpty = require("./isEmty");

module.exports = function validateProfileInput(data) {
  let {
    handle,
    status,
    skills,
    website,
    youtube,
    twitter,
    linkedin,
    instagram,
    facebook
  } = data;

  let errors = {};

  handle = !isEmpty(handle) ? handle : "";
  status = !isEmpty(status) ? status : "";
  skills = !isEmpty(skills) ? skills : "";

  if (!validator.isLength(handle, { min: 2, max: 30 })) {
    errors.handle = "Handle must be between 2 and 30 characters";
  }

  if (validator.isEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  if (validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }

  if (validator.isEmpty(skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(website)) {
    if (!validator.isURL(website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(youtube)) {
    if (!validator.isURL(youtube)) {
      errors.youtube = "Not a valid youtube URL";
    }
  }

  if (!isEmpty(twitter)) {
    if (!validator.isURL(twitter)) {
      errors.twitter = "Not a valid twitter URL";
    }
  }

  if (!isEmpty(linkedin)) {
    if (!validator.isURL(linkedin)) {
      errors.linkedin = "Not a valid linkedin URL";
    }
  }

  if (!isEmpty(instagram)) {
    if (!validator.isURL(instagram)) {
      errors.instagram = "Not a valid instagram URL";
    }
  }

  if (!isEmpty(facebook)) {
    if (!validator.isURL(facebook)) {
      errors.facebook = "Not a valid facebook URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
