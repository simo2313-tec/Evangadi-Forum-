const mysql2 = require("mysql2");
const dbconnection = mysql2.createPool({
  host: "localhost",
  user: "evangadi_admin_test",
  password: "123456",
  database: "evangadi_forum_test",
  connectionLimit: 10,
});
module.exports = dbconnection.promise();




