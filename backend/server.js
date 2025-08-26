const app = require("./app");
const sequelize = require("./db"); 


sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
