const User = require("../model/userModel");
const validation = require("../services/validation");
const Logger = require("../services/loggerService");
const logger = new Logger("app");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;
const videoModel = require("../model/videoUploaded");
const commentModel = require("../model/commentModel");
const UserModel = require("../model/userModel");
const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, "minutes");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hours");

  const days = Math.floor(hours / 24);
  return rtf.format(-days, "days");
};

module.exports = {
  generatePresignedUrl: async (req, res) => {
    try {
      logger.info(req, res);
      const { fileName, fileType, imageType } = req.body;
      const config = {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
      };
      if (!config.accessKeyId || !config.secretAccessKey || !config.region) {
        throw new Error("AWS credentials not found");
      }
      AWS.config.update(config);
      const s3 = new AWS.S3();
      let videoUrl = null;
      let imageUrl = null;
      if (fileName && fileType) {
        const videoParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Expires: 300,
          ContentType: fileType,
        };
        videoUrl = await s3.getSignedUrlPromise("putObject", videoParams);
      }

      if (fileName && imageType) {
        const imageParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Expires: 300,
          ContentType: imageType,
        };
        imageUrl = await s3.getSignedUrlPromise("putObject", imageParams);
      }

      return res.status(200).json({
        message: "Presigned URLs generated successfully",
        body: {
          videoUrl,
          imageUrl,
        },
      });
    } catch (err) {
      console.error("Error in generatePresignedUrl", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  createVideoRecord: async (req, res) => {
    try {
      logger.info(req, res);
      const { value, error } = validation.videoUpload.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const uuid1 = uuid();
      const videoUploaded = await videoModel.create({
        video_url: value.video_url,
        uuid: uuid1,
        uploadedBy: value.uploadedBy,
        uploadedFor: value.uploadedFor,
        status: value.status,
        title: value.title,
        description: value.description,
      });
      const responseBody = {
        id: videoUploaded.id,
        video_url: videoUploaded.video_url,
        uuid: videoUploaded.uuid,
        uploadedBy: videoUploaded.uploadedBy,
        uploadedFor: videoUploaded.uploadedFor,
        status: videoUploaded.status,
        title: value.title,
        description: value.description,
      };
      return res.status(200).json({
        message: "Video record created successfully",
        body: responseBody,
      });
    } catch (err) {
      console.error("✌️ Error --->", err);
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    }
  },
  updateVideo: async (req, res) => {
    try {
      const { videoId } = req.params;
      const { value, error } = validation.updateVideo.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const video = await videoModel.findOne({ where: { id: videoId } });

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      if (value.video_url && value.image_url) {
        await videoModel.update(
          { video_url: value.video_url, image_url: value.image_url },
          { where: { id: videoId } }
        );
      } else {
        if (value.video_url) {
          await videoModel.update(
            { video_url: value.video_url },
            { where: { id: videoId } }
          );
        }
        if (value.image_url) {
          await videoModel.update(
            { image_url: value.image_url },
            { where: { id: videoId } }
          );
        }
      }
      const updatedVideo = await videoModel.findOne({ where: { id: videoId } });

      let status =
        updatedVideo.video_url && updatedVideo.image_url
          ? "complete"
          : "pending";
      await videoModel.update({ status }, { where: { id: videoId } });

      return res.status(200).json({ message: "Video updated successfully" });
    } catch (err) {
      console.error("Error updating video:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllVideosByCurrentUser: async (req, res) => {
    try {
      logger.info(req, res);
      const userId = req.user.id;
      const findUser = await UserModel.findOne({
        where: { id: userId },
        attributes: ["role"],
      });
      if (!findUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { role } = findUser;
      if (!["COACH", "STUDENT"].includes(role)) {
        return res
          .status(403)
          .json({
            message:
              "Access denied. Only coaches and students can access this resource.",
          });
      }

      const { page = 1, limit = 10 } = req.query;
      const whereCondition =
        role === "STUDENT" ? { uploadedBy: userId } : { uploadedFor: userId };

      const offset = (page - 1) * limit;

      const videos = await videoModel.findAndCountAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: User,
            as: "student",
            attributes: ["firstName"],
          },
          {
            model: commentModel,
            as: "comments",
            attributes: ["comment", "id", "status"],
            separate: true,
          },
        ],
      });

      if (videos.count === 0) {
        return res.status(404).json({ message: "No videos found" });
      }

      const videoData = videos.rows.map((video) => {
        const readCount = video.comments.filter(
          (comment) => comment.status
        ).length;
        const unreadCount = video.comments.length - readCount;

        return {
          video_url: video.video_url,
          id: video.id,
          title: video.title,
          description: video.description,
          uploaderName: video.student?.firstName || "Unknown",
          commentCount: video.comments.length.toString(),
          readCount: readCount.toString(),
          unreadCount: unreadCount.toString(),
          uploadedTime: timeAgo(video.createdAt),
        };
      });

      videoData.sort((a, b) => b.commentCount - a.commentCount);

      return res.status(200).json({
        message: "Videos fetched successfully",
        totalCount: videos.count,
        body: videoData,
      });
    } catch (err) {
      console.error("Error fetching videos:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
