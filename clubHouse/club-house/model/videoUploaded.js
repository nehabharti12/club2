const { DataTypes } = require('sequelize');
const Sequelize = require('../services/db');
const User = require('./userModel');
const Comment = require('./commentModel');
const VideoUpload = Sequelize.define('VideoUpload', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  uploadedFor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },

  video_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'complete', 'failed'),
    defaultValue: 'pending', 
    allowNull: false,
  },
  title:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  description:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'VideoUpload',
  timestamps: true,
});
VideoUpload.hasMany(Comment, { as: 'comments', foreignKey: 'videoId' });
Comment.belongsTo(VideoUpload, { as: 'video', foreignKey: 'videoId' });
VideoUpload.belongsTo(User, { as: 'coach', foreignKey: 'uploadedFor' });
VideoUpload.belongsTo(User, { as: 'student', foreignKey: 'uploadedBy' });


Sequelize.sync()
  .then(() => {
    console.log('VideoUpload table has been created.');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = VideoUpload;
