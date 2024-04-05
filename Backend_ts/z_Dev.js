"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modelSetUp_1 = require("./models/DB_Functions/Set_Up/modelSetUp");
const userModels_1 = require("./models/typesOfModels/Users/userModels");
const getUserFullDetails = async (userID) => {
    try {
        const userModel = new userModels_1.UserModel();
        const user = await userModel.getUserFullDetails(userID, { userPref: true, bookPref: true, ratings: false });
        console.log(user);
    }
    catch (err) {
        console.log(err);
        throw new Error("Error in getUserFullDetails");
    }
};
modelSetUp_1.sequelize.authenticate()
    .then(async () => {
    //await initialize();
    console.log('DB connection successful');
    getUserFullDetails(1).then((res) => console.log(res)).catch((err) => console.log(err));
})
    .catch((error) => {
    console.log('DB connection Failed becuase: ', error);
});
