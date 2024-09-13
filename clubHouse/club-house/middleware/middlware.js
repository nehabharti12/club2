
const jwtCheckMethod = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessSecret = process.env.TOKEN_ACCESS;
const UserModel = require("../model/userModel");
jwtCheckMethod.authVerifyFunction = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Token not found");
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS);
    const user = await UserModel.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const { authorization } = req.headers;
      const oldToken = authorization.split(" ")[1];
      const decoded = jwt.decode(oldToken);
      const user = await UserModel.findOne({ where: { id: decoded.userId } });

      if (user) {
        const newToken = jwt.sign({ userId: user.id }, accessSecret, {
          expiresIn: "3m",
        });
        console.log('✌️newToken --->', newToken);


        res.setHeader("Authorization", `Bearer ${newToken}`);
        req.user = user;
        next();
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } else {
      return res.status(401).json({ message: error.message });
    }
  }
};
jwtCheckMethod.authVerifySuperAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Token not found");
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS);
    const user = await UserModel.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }
        if (user.role !== "SUPER-ADMIN") {
      return res.status(403).json({ message: "Access denied. Super Admin allowed only." });
    }
    req.user = user;
    next();
  } catch (error) {
   
    return res.status(401).json({ message: error.message });
  }
};
jwtCheckMethod.authVerifyStudent = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Token not found");
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS);
    const user = await UserModel.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }
        if (user.role !== "STUDENT") {
      return res.status(403).json({ message: "Access denied. Student allowed only." });
    }
    req.user = user;
    next();
  } catch (error) {
   
    return res.status(401).json({ message: error.message });
  }
};



module.exports = jwtCheckMethod;
