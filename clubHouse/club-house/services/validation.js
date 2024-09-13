const Joi = require("joi");
const validation = {};

validation.registration = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  // role: Joi.string()
  //   .valid("superAdmin", "admin", "user", "student", "coach", "parent")
  //   .required(),
});
validation.login = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
validation.forgotPassword = Joi.object({
  emailAddress: Joi.string().email().required(),
});
validation.resetPassword = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});
validation.updatePasswordV1 = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});
validation.clubPassword = Joi.object({
  userId: Joi.number().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
});

validation.generatePresignedUrl = Joi.object({
  video: Joi.string().required(),
});
validation.videoUpload = Joi.object({
  video_url: Joi.string().optional(),
  uploadedBy: Joi.string().required(),
  uploadedFor: Joi.string().required(),
  status: Joi.string().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});
validation.comment = Joi.object({
  comment: Joi.string().required(),
  videoId: Joi.number().required(),
});
validation.updateVideo = Joi.object({
  video_url: Joi.string().optional(),
  image_url: Joi.string().optional(),
  status: Joi.string().optional(),
});
validation.clubRegistration = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
  activity: Joi.array().items(
    Joi.string().valid('Football', 'Basketball', 'Cricket', 'Hockey','Volleyball')
  ).optional().allow(null),
  location: Joi.string().optional().allow(null),
   
  openingTime: Joi.string().optional().allow(null),
  closingTime: Joi.string().optional().allow(null),
});
validation.updateClub = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().default("null"),
  activity: Joi.array().items(
    Joi.string().valid('Football', 'Basketball', 'Cricket', 'Hockey')
  ).optional().allow(null),
  location: Joi.string().optional().allow(null),
  openingTime: Joi.string().optional().allow(null),
  closingTime: Joi.string().optional().allow(null),
});
validation.coachRegistration = Joi.object({
  clubId: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().optional().default("null"),
  password: Joi.string().min(8).optional().default("null"),
  role: Joi.number().optional().default("COACH"),
  emailAddress: Joi.string().email().required(),
});
validation.inviteUser = Joi.object({
  clubId: Joi.number().required(),
  emailAddress: Joi.string().email().required(),
  role: Joi.string().required(),

});
validation.updatePassword = Joi.object({
  id: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .min(8)
    .required()
    
});

module.exports = validation;
