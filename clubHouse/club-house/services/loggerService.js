const { json } = require("body-parser");
const winston = require("winston");
const userActivityModel = require("../model/userActivityModel");
let os = require("os");
let path = require("path");
const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
let parseIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",").shift() ||
  req.socket?.remoteAddress;
dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};
let findKey = (object, value) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => key.includes(value))
  );
};
class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.route = route;
    const logger = winston.createLogger({});
    this.logger = logger;
  }
  async info(req, res) {
   
    if (Object.keys(req.body).length != 0) {
      if (
        findKey(req.body, "user_id").user_id != undefined ||
        findKey(req.body, "sid").sid != undefined
      ) {
        user_id = findKey(req.body, "user_id").user_id;
        sid = findKey(req.body, "sid").sid;
      }
    }
    if (Object.keys(req.params).length != 0) {
      if (
        findKey(req.params, "user_id").user_id != undefined ||
        findKey(req.params, "sid").sid != undefined
      ) {
        user_id = findKey(req.params, "user_id").user_id;
        sid = findKey(req.params, "sid").sid;
      }
    }
    if (Object.keys(req.query).length != 0) {
      if (
        findKey(req.query, "user_id").user_id != undefined ||
        findKey(req.query, "sid").sid != undefined
      ) {
        user_id = findKey(req.query, "user_id").user_id;
        sid = findKey(req.query, "sid").sid;
      }
    }

    let osplatform = os.platform();
    let osHostname = os.hostname();
    let current_datetime = new Date();
    const userAgent = req.headers["user-agent"];
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds =
      getActualRequestDurationInMilliseconds(start);
    let log = `[${formatted_date}] ${
      req.method
    }:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    let userActivity = {
      user_id: 1,
      sid: 1,
      ip: JSON.stringify(parseIp(req)),
      location: req.header("x-forwarded-for") || req.connection.remoteAddress,
      version: req.useragent.version,
      os: osplatform,
      platform: osHostname,
      browser: userAgent,
      method: req.method,
      route: url,
      status: status,
      processTime: durationInMilliseconds.toLocaleString() + " ms",
      time: formatted_date,
      requestObject: JSON.stringify(req.body),
    };
    userActivityModel
      .create(userActivity)
      .then((res) => {
        console.log("logger updae table successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
module.exports = LoggerService;
