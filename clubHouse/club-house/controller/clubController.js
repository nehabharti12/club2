const validation = require("../services/validation");
const Logger = require("../services/loggerService");
const logger = new Logger("app");
const clubModel = require("../model/clubModel");
const userRoles = require("../model/userRoles");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const email = require("../services/email");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = "hdygdtgfgrnx";
const userClubModel = require("../model/userClubModel");

module.exports = {
  createClub: async (req, res) => {
    try {
      const { value, error } = validation.clubRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const uuid = uuidv4();
      const newClub = await clubModel.create({
        ...value,
        uuid: uuid,
      });
      return res.status(201).json({
        message: "Club created successfully",
        body: {
          id: newClub.id,
          name: newClub.name,
          description: newClub.description,
          uuid: newClub.uuid,
          activity: newClub.activity,
          location: newClub.location,
          openingTime: newClub.openingTime,
          closingTime: newClub.closingTime,
        },
      });
    } catch (err) {
      console.error("✌️err --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err });
    }
  },

  getClubById: async (req, res) => {
    try {
      logger.info(req, res);
      const { id } = req.params;
      const club = await clubModel.findOne({
        where: { id: id },
      });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      const response = {
        message: "Club found successfully",
        body: {
          id: club.id,
          name: club.name,
          description: club.description,
          uuid: club.uuid,
          activity: club.activity,
          location: club.location,
          openingTime: club.openingTime,
          closingTime: club.closingTime,
        },
      };

      return res.status(200).json(response);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err });
    }
  },
  updateClubById: async (req, res) => {
    try {
      logger.info(req, res);
      const { id } = req.params;
      const { value, error } = validation.updateClub.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const club = await clubModel.findOne({ where: { id } });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      const [updatedRows] = await clubModel.update(value, { where: { id } });
      if (updatedRows === 0) {
        return res
          .status(500)
          .json({ message: "No rows updated. Please try again later." });
      }
      return res.status(500).json({ message: "Club updated successfully" });
    } catch (err) {
      console.error("Error updating club:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  deleteClubById: async (req, res) => {
    try {
      logger.info(req, res);
      const { id } = req.params;
      const club = await clubModel.findOne({ where: { id } });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      const deletedRows = await clubModel.destroy({ where: { id } });
      if (deletedRows === 0) {
        return res
          .status(500)
          .json({ message: "No rows deleted. Please try again later." });
      }
      return res.status(200).json({ message: "Club deleted successfully" });
    } catch (err) {
      console.error("Error deleting club:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getAllClub: async (req, res) => {
    try {
      logger.info(req, res);

      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const offset = (pageNumber - 1) * pageSize;

      const { count, rows } = await clubModel.findAndCountAll({
        attributes: { exclude: ["createdAt", "updatedAt", "uuid"] },
        limit: pageSize,
        offset: offset,
      });
      const totalPages = Math.ceil(count / pageSize);
      return res.status(200).json({
        message: "Clubs fetched successfully",
        totalCount: count,
        currentPage: pageNumber,
        totalPages: totalPages,
        body: rows,
      });
    } catch (err) {
      console.error("Error fetching clubs:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getAllRolesV1: async (req, res) => {
    try {
      logger.info(req, res);

      const roles = await userRoles.findAll({
        attributes: ["id", "roleName"],
        order: [["roleName", "ASC"]],
      });

      res.status(200).send({
        message: "Roles fetched successfully",
        roles: roles,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching roles." });
    }
  },
  InviteUser: async (req, res) => {
    try {
      logger.info(req, res);
      const { value, error } = validation.inviteUser.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const club = await clubModel.findOne({ where: { id: value.clubId } });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      const token = jwt.sign(
        {
          email: value.emailAddress,
          clubId: value.clubId,
          role: value.role,
        },
        process.env.NODEMAILER_SECRET,
        { expiresIn: "24h" }
      );

      email.sendInvitationEmail(
        value.emailAddress,
        token,
        club.name,
        value.role
      );
      return res.status(201).json({
        message: "User created successfully and invitation sent",
        body: token,
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while inviting the user." });
    }
  },
  verifyInviteUserLink: async (req, res) => {
    try {
      logger.info(req, res);

      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      const decoded = jwt.verify(token, process.env.NODEMAILER_SECRET);
      if (!decoded) {
        return res
          .status(400)
          .json({ message: "LINK EXPIRED PLEASE LOGIN AGAIN" });
      }

      const randomPassword = crypto.randomBytes(8).toString("hex");
      const hashPassword = await bcrypt.hash(randomPassword, 10);
      const findEmail = await userModel.findOne({
        where: { emailAddress: decoded.email },
      });
      if (findEmail) {
        return res.status(409).json({ message: "User already exists" });
      }
      const createUser = await userModel.create({
        emailAddress: decoded.email,
        password: hashPassword,
        role: decoded.role,
      });
      if (!createUser) {
        return res.status(400).json({ message: "User not created" });
      }
      const createClubUser = await userClubModel.create({
        clubId: decoded.clubId,
        userId: createUser.id,
      });
      if (!createClubUser) {
        return res.status(400).json({ message: "User not added to club" });
      }
      return res.status(200).json({
        message: "User created and associated with club successfully",
        body: {
          id: createUser.id,
          emailAddress: createUser.emailAddress,
          clubId: decoded.clubId,
          roleName: decoded.role,
          password: createUser.password,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while verifying the user." });
    }
  },
  clubMemeberUpdatePassword: async (req, res) => {
    try {
      const { value, error } = validation.updatePassword.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const user = await userModel.findOne({ where: { id: value.id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (value.newPassword !== value.confirmPassword) {
        return res.status(400).json({ message: "Password does not match" });
      }

      const hashPassword = await bcrypt.hash(value.newPassword, 10);
      await userModel.update(
        { password: hashPassword },
        { where: { id: value.id } }
      );
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while updating the password." });
    }
  },
  getAllRoles: async (req, res) => {
    try {
      logger.info(req, res);

      const userId = req.user.id;
      const user = await userModel.findOne({ where: { id: userId } });

      const roleMap = {
        "SUPER-ADMIN": ["ADMIN"],
        ADMIN: ["COACH", "PARENT",],
        COACH: ["PARENT", "STUDENT"],
        STUDENT: ["PARENT"],
      };

      const rolesToFetch = roleMap[user.role] || [];

      const roles = await userRoles.findAll({
        attributes: ["id", "roleName"],
        where: {
          roleName: rolesToFetch,
        },
        order: [["roleName", "ASC"]],
      });

      res.status(200).json({
        message: "Roles fetched successfully",
        roles: roles,
      });
    } catch (error) {
      console.log("✌️error --->", error);
      res.status(500).json({
        error: "An error occurred while fetching roles.",
      });
    }
  },
};
