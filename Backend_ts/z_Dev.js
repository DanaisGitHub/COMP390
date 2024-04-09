"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pyAPI_1 = __importDefault(require("./API/pyAPI"));
(0, pyAPI_1.default)('410000', ['1', '2', '3', "4", "5", "6"]).then(console.log).catch(console.error); // Promise { <pending> }
