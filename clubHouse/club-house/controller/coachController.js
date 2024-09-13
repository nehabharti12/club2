
const coachModel = require("../model/coachModel");
const roleModel = require("../model/userRoles");
const validation = require("../services/validation");
const db_query = require("../services/db.query");
const { sendSetPasswordEmail } = require("../services/email");
const Logger = require("../services/loggerService");
const logger = new Logger("app");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createCoach: async (req, res) => {
    try {
      const { value, error } = validation.coachRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const existingCoach = await coachModel.findOne({
        where: { emailAddress: value.emailAddress },
      });

      if (existingCoach) {
        return res.status(400).json({ message: "Coach already exists" });
      }
      const uuid = uuidv4();
      const newCoach = await coachModel.create({
        ...value,
        uuid: uuid,
      });
      await roleModel.create({
        userId: newCoach.id,
        roleName: "COACH",
      });

      const createToken = db_query.create_Token_Forgot_Password(
        value.emailAddress
      );
      sendSetPasswordEmail(value.emailAddress, createToken);

      return res.status(201).json({
        message: "Coach created successfully",
        body: {
          id: newCoach.id,
          role: newCoach.role,
          name: newCoach.name,
          emailAddress: newCoach.emailAddress,
          uuid: newCoach.uuid,
        },
      });
    } catch (err) {
      console.error("Error creating coach:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getCoachWithClubId: async (req, res) => {
    try {
      const { clubId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const coaches = await coachModel.findAndCountAll({
        where: { clubId: clubId },
        attributes: [
          "id",
          "uuid",
          "name",
          "emailAddress",
          "phoneNo",
          "role",
          "clubId",
        ],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      if (!coaches.rows.length) {
        return res
          .status(404)
          .json({ message: "No coaches found for the given club" });
      }

      return res.status(200).json({
        message: "Coaches fetched successfully",
        body: coaches.rows,
      });
    } catch (err) {
      console.error("Error fetching coaches:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getCoachWithId: async (req, res) => {
    try {
      const { coachId } = req.params;

      const coach = await coachModel.findOne({
        where: { id: coachId },
        attributes: [
          "id",
          "uuid",
          "name",
          "emailAddress",
          "phoneNo",
          "role",
          "clubId",
        ], 
      });

      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }

      return res.status(200).json({
        message: "Coach fetched successfully",
        body: coach,
      });
    } catch (err) {
      console.error("Error fetching coach:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
};
