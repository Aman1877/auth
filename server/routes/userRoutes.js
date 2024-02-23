import express from "express";
import {
  registerController,
  loginController,
  sendOTPController,
  submitOTPController,
} from "../controllers/userController.js";
import {
  addLoginValidation,
  addOTPPassvalidation,
  addOTPvalidation,
  addUserValidation,
} from "../validation/user/userValidation.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
const app = express();

const router = express.Router();

// REGISTER NEW USER
router.post("/register-user", addUserValidation, registerController);

// LOGIN USER
router.post("/login-user", addLoginValidation, loginController);

// FORGET PASSWORD (SEND OTP)
router.post("/send-otp", addOTPvalidation, sendOTPController);

// FORGET PASSWORD (SUBMIT OTP)
router.post("/submit-otp", addOTPPassvalidation, submitOTPController);

// DUMMY API
router.get("/dashboard", verifyUser, (req, res) => {
  res.status(200).send({
    success: true,
    message: "Authorized",
  });
});

export default router;
