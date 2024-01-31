"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFunc = exports.random = void 0;
const random = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.random = random;
// how to make a new date in js new Date('Year-Month-Day'')
// or Date(Year, Month, Day, Hours, Minutes, Seconds, Milliseconds) as ints
class DateFunc {
}
exports.DateFunc = DateFunc;
DateFunc.jSDateToSQLDate = (date) => {
    // create a new Date object
    const mysqlDate = date.toISOString().slice(0, 19).replace('T', ' '); // convert to MySQL date format
    console.log(mysqlDate);
    return mysqlDate; // logs a date string in MySQL format, e.g. "2022-04-01 12:30:00"
};
DateFunc.sQLDateToJSDate = (date) => {
    // create a new Date object
    const jsDate = new Date(date); // convert to MySQL date format
    console.log(jsDate);
    return jsDate; // logs a date string in MySQL format, e.g. "2022-04-01 12:30:00"
};
DateFunc.getTodaysDate = () => {
    const today = new Date();
    const dateAsString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
    const todayDate = new Date(dateAsString);
    return todayDate;
};
DateFunc.getYearOfDate = (date) => {
    return date.getFullYear();
};
DateFunc.stringToDate = (date) => {
    return new Date(date);
};
