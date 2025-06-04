const mysql2 = require("mysql2");
const dbconnection = mysql2.createPool({
  host: "localhost",
  user: "evangadi",
  password: "123456",
  database: "forum",
  connectionLimit: 10,
});
module.exports = dbconnection.promise();




