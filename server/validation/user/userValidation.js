import { submitOTP, userValid, userLogin, sendOTP } from "./userSchema.js";

// REGISTRATION VALIDATION
export const addUserValidation = async (req, res, next) => {
  const value = await userValid.validate(req.body);
  if (value.error) {
    console.log(value.error.message);
    res.json({
      success: 0,
      message: value.error.message,
    });
  } else {
    next();
  }
};

// LOGIN VALIDATION
export const addLoginValidation = async (req, res, next) => {
  const value = await userLogin.validate(req.body);
  if (value.error) {
    console.log(value.error.message);
    res.json({
      success: 0,
      message: value.error.message,
    });
  } else {
    next();
  }
};

// SEND OTP VALIDATION
export const addOTPvalidation = async (req, res, next) => {
  const value = await sendOTP.validate(req.body);
  if (value.error) {
    console.log(value.error.message);
    res.json({
      success: 0,
      message: value.error.message,
    });
  } else {
    next();
  }
};

// SUBMIT OTP VALIDATION
export const addOTPPassvalidation = async (req, res, next) => {
  const value = await submitOTP.validate(req.body);
  if (value.error) {
    console.log(value.error.message);
    res.json({
      success: 0,
      message: value.error.message,
    });
  } else {
    next();
  }
};
