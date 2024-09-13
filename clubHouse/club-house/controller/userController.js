const userModel = require("../model/userModel");
const UserRole = require("../model/userRoles");
const bcrypt = require("bcryptjs");
const validation = require("../services/validation");
const db_query = require("../services/db.query");
const sendResetPasswordEmail = require("../services/email");
const Logger = require("../services/loggerService");
const logger = new Logger("app");
const salt = 10;
const uuid4 = require("uuid").v4;
const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = {
  createUser: async (req, res) => {
    try {
      const { value, error } = validation.registration.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const existUser = await userModel.findOne({
        where: { emailAddress: value.emailAddress },
      });
      if (existUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      if (value.password !== value.confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      const hashPassword = await bcrypt.hash(value.password, salt);
      const createUser = await userModel.create({
        ...value,
        password: hashPassword,
      });
      if (createUser) {
        const role = "Admin" ? 1 : "OtherRoleName";
        const addRoles = await UserRole.create({
          user_id: createUser.id,
          roleName: role,
        });
        console.log("✌️addRoles --->", addRoles);
      }
      return res
        .status(201)
        .json({ message: "User created successfully", body: createUser });
    } catch (err) {
      console.log("✌️err --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err });
    }
  },
  login: async (req, res) => {
    try {
      await logger.info(req, res);

      const { value, error } = validation.login.validate(req.body);
      if (error) {
        console.error("✌️ Validation error --->", error);
        return res.status(400).json({ message: error.details[0].message });
      }
      const user = await userModel.findOne({
        where: { emailAddress: value.emailAddress },
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const uuid = uuid4();
      const validPassword = await bcrypt.compare(value.password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
    const jwt_token = jwt.sign({ userId: user.id }, process.env.TOKEN_ACCESS, { expiresIn: "24h" });
      if (jwt_token) {
        const responseBody = {
          id: user.id,
          userType: user.userType,
          role: user.role,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
          token: jwt_token,
        };
        if (uuid) {
          const updateUid = await userModel.update(
            { uuid: uuid },
            { where: { id: user.id } }
          );
        }
        return res
          .status(200)
          .json({ message: "Login successful", body: responseBody });
      } else {
        return res.status(500).json({ message: "Failed to generate token" });
      }
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      logger.info(req, res);

      const userId = req.user.id;
console.log('✌️userId --->', userId);
      const user = await userModel.findOne({ where: { id: userId } });
      return res
        .status(200)
        .json({ message: "User fetched successfully", body: user });
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    logger.info(req, res);

    const { value, error } = validation.forgotPassword.validate(req.body);
    console.log("✌️forgotPassworderror --->", error);
    console.log("✌️forgotPasswordvalue --->", value);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      const findUser = await userModel.findOne({
        where: { emailAddress: value.emailAddress },
      });
      if (!findUser) {
        return res.status(400).json({ message: "User does not exist" });
      }
      const token = db_query.create_Token_Forgot_Password(findUser.id);
      findUser.resetPasswordToken = token;
      findUser.resetPasswordExpires = Date.now() + 3600000;
      await findUser.save();

      sendResetPasswordEmail(value.emailAddress, token);
      return res.status(200).json({
        message:
          "Password reset token created successfully. Please check your email.",
      });
    } catch (error) {
      console.log("✌️error --->", error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const userId = req.userId;
      console.log("✌️userId --->", userId);
      const { value, error } = validation.resetPassword.validate(req.body);
      if (error) {
        console.error("✌️ Validation error --->", error);
        return res.status(400).json({ message: error.details[0].message });
      }
      const findUser = await userModel.findOne({
        where: { id: userId },
      });
      if (!findUser) {
        return res.status(400).json({ message: "User does not exist" });
      }

      if (value.newPassword !== value.confirmPassword) {
        return res.status(400).json({ message: "Passwords are not the same" });
      }

      const hashedPassword = await bcrypt.hash(value.newPassword, 10);
      await userModel.update(
        { password: hashedPassword },
        { where: { id: userId } }
      );

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const userId = req.userId;
      console.log("✌️userId --->", userId);
      const { value, error } = validation.updatePassword.validate(req.body);
      if (error) {
        console.error("✌️ Validation error --->", error);
        return res.status(400).json({ message: error.details[0].message });
      }
      const findUser = await userModel.findOne({
        where: { id: userId },
      });
      if (!findUser) {
        return res.status(400).json({ message: "User does not exist" });
      }
      const isOldPasswordCorrect = bcrypt.compareSync(
        value.oldPassword,
        findUser.password
      );
      if (!isOldPasswordCorrect) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      if (value.oldPassword === value.newPassword) {
        return res
          .status(400)
          .json({ message: "New password cannot be the same as old password" });
      }
      if (value.newPassword !== value.confirmPassword) {
        return res.status(400).json({ message: "Passwords are not the same" });
      }
      const hashedPassword = await bcrypt.hash(value.newPassword, 10);
      await userModel.update(
        { password: hashedPassword },
        { where: { id: userId } }
      );

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      logger.info(req, res);
      const userId = req.params.id;
      console.log("✌️userId --->", userId);
      const user = await userModel.findOne({ where: { id: userId } });
      if (!user) {
        const notFoundError = `User with ID ${userId} not found`;
        console.error("✌️ Error --->", notFoundError);
        return res.status(404).json({ message: notFoundError });
      }
      return res
        .status(200)
        .json({ message: "User fetched successfully", body: user });
    } catch (err) {
      console.error("✌️ Errxxxxxxxxxxor --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  
};
