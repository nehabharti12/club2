const jwt = require("jsonwebtoken");
const secret = "gywfyfwc63fddvdcd";
const db_query = {
  changeRoleValue(role) {
    let assignedRole;
    switch (role) {
      case "superAdmin":
        assignedRole = 1;
        break;
      case "admin":
        assignedRole = 2;
        break;
      case "user":
        assignedRole = 3;
        break;
      case "student":
        assignedRole = 4;
        break;
      case "coach":
        assignedRole = 5;
        break;
      case "parent":
        assignedRole = 6;
        break;
      default:
        assignedRole = 1;
    }
    return assignedRole;
  },

  create_Token_Forgot_Password: (user_id) => {
    const createToken = jwt.sign({ user_id }, secret, {
      expiresIn: "1h",
    });
    return createToken;
  }
  
};







module.exports = db_query;
