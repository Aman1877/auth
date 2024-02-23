import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";

// REGISTER NEW USER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // CHECK FOR EXISTING USER
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(200).send({
        success: false,
        message: "User is already registered",
      });
    }
    // REGISTER NEW USER
    const hashedPassword = await hashPassword(password);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();
    res.status(201).send({
      success: true,
      message: "User has been registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User registration failed",
      error,
    });
  }
};

// LOGIN USER
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // CHECK USER (EMAIL)
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    // CHECK USER (PASSWORD)
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const acessToken = await JWT.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const refreshToken = await JWT.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await user.save();
    // SET TOKEN IN COOKIES
    res.cookie("acessToken", acessToken, { maxAge: 60000 });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 300000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      acessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// FORGET PASSWORD (SEND OTP)
export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const _otp = Math.floor(1000 + Math.random() * 9000);

    // CHECK USER
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    // NODEMAILER (SEND OTP IN MAIL)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dummyreason187@gmail.com", // Sender email address
        pass: "hyjo tfqz skag qfbw", // App password from Gmail account
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: "Aman Mansuri",
        address: "dummyreason187@gmail.com",
      },
      to: req.body.email,
      subject: "OTP verification 😉",
      text: String(_otp), // Generating OTP
    });
    // UPDATE USER DATABASE (ADD OTP FIELD)
    if (info.messageId) {
      // OTP update through email
      const updatedUser = await userModel.updateOne(
        { email: req.body.email },
        { otp: _otp }
      );
      if (updatedUser) {
        res.status(200).send({
          success: true,
          message: "OTP sent Successfully",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "Server error (OTP CANT SEND)",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error,
    });
  }
};

// FORGET PASSWORD (SUBMIT OTP)
export const submitOTPController = async (req, res) => {
  try {
    const { otp, password } = req.body;

    // CHECK USER THROUGH OTP THAT IS REGISTERED
    const user = await userModel.findOne({ otp });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "OTP is not correct",
      });
    }
    const hashedPassword = await hashPassword(password);
    // IF WE GET THE USER THROUGH OTP THEN
    const resetPassword = await userModel.updateOne({
      email: user.email,
      password: hashedPassword,
    });
    res.status(200).send({
      success: true,
      message: "Password updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in submitting OTP",
      error,
    });
  }
};
