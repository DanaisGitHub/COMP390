"use strict";
// import { initialize, sequelize } from "./models/DB_Functions/Set_Up/modelSetUp";
// import { UserModel } from "./models/typesOfModels/Users/userModels";
// const getUserFullDetails = async (userID: number): Promise<any> => {
//     try {
//         const userModel = new UserModel();
//         const user = await userModel.getUserFullDetails(userID,{userPref: true, bookPref: true, ratings: false});
//         console.log(user)
//     } catch (err) {
//         console.log(err)
//         throw new Error("Error in getUserFullDetails")
//     }
// }
// sequelize.authenticate()
//         .then(async () => {
//                 //await initialize();
//                 console.log('DB connection successful');
//                 getUserFullDetails(1).then((res) => console.log(res)).catch((err) => console.log(err))
//         })
//         .catch((error) => {
//                 console.log('DB connection Failed becuase: ', error)
//         });
console.log(Date.now());
