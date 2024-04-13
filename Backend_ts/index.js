"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const modelSetUp_1 = require("./models/DB_Functions/Set_Up/modelSetUp");
const baseRoutes_1 = __importDefault(require("./routes/baseRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// all routes run through the middleware def app.use(X)
app.use(body_parser_1.default.urlencoded({ extended: false })); // we mihgt not need
app.use(body_parser_1.default.json()); // we might not need 
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)());
// sending all routes that start with '/' to routes folder
// start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
app.use('/', baseRoutes_1.default);
modelSetUp_1.sequelize.authenticate()
    .then(async () => {
    await (0, modelSetUp_1.initialize)();
    console.log('DB connection successful');
})
    .catch((error) => {
    console.log('DB connection Failed becuase: ', error);
});
