const userModel = require("../model/userModel");
const validation = require("../services/validation");
const { sendSetPasswordEmail } = require("../services/email");
const Logger = require("../services/loggerService");
const logger = new Logger("app");
const uuid = require("uuid").v4;
const commentModel = require("../model/commentModel");

module.exports = {
  createComment: async (req, res) => {
    try {
      logger.info(req, res);
      const userId = req.user.id
      const findUser = await userModel.findOne({ where: { id: userId } });
      const uuid1 = uuid();

      const { value, error } = validation.comment.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const comment = await commentModel.create({
        ...value,
        coachId: findUser.id,
        uuid: uuid1,
      });

      const responseBody = {
        id: comment.id,
        videoId: comment.videoId,
        comment: comment.comment,
      };

      return res.status(200).json({
        message: "Comment created successfully",
        body: responseBody,
      });
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  getComment: async (req, res) => {
    try {
        logger.info(req, res);
        const { videoId } = req.params;
        const { page = 1, limit = 2 } = req.query;

        if (isNaN(Number(videoId))) {
            return res.status(400).json({ message: "Video ID is required in params" });
        }
        const findVideo = await commentModel.findOne({ where: { videoId } });
        if (!findVideo) {
            return res.status(404).json({ message: "Video not found in comments" });
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await commentModel.findAndCountAll({
            where: { videoId },
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
        });

        const totalPages = Math.ceil(count / limit);

        const totalUnreadCount = await commentModel.count({
            where: { videoId, status: false },
        });

        const totalReadCount = await commentModel.count({
            where: { videoId, status: true },
        });

        return res.status(200).json({
            message: "Comments fetched successfully",
            totalCount: count,
            totalUnreadCount,
            totalReadCount,
            totalPages,
            currentPage: parseInt(page, 10),
            comments: rows,
        });
    } catch (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
},

markCommentsAsReadByVideoId : async (req, res) => {
  try {
      const { videoId } = req.params;

      if (isNaN(Number(videoId))) {
          return res.status(400).json({ message: "Video ID is required in params" });
      }

      const [affectedRows] = await commentModel.update(
          { status: true },
          { where: { videoId } }
      );

      if (affectedRows === 0) {
          return res.status(404).json({ message: "No comments found for this video" });
      }

      const updatedCommentsCount = await commentModel.count({ where: { videoId, status: true } });

      return res.status(200).json({
          message: "Comments marked as read",
          updatedCommentsCount,
      });
  } catch (err) {
      console.error("Error marking comments as read:", err);
      return res.status(500).json({ message: "Internal Server Error" });
  }
},

 
  
};
