"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bookModel_1 = require("./models/typesOfModels/Items/bookModel");
const genreModel = new bookModel_1.GenreModel();
const formatModel = new bookModel_1.FormatModel();
const authorModel = new bookModel_1.AuthorModel();
const func = (linkTable) => {
    const jsonName = linkTable.constructor.name === bookModel_1.GenreModel.name ? "genre"
        : linkTable.constructor.name === bookModel_1.FormatModel.name ? "format"
            : linkTable.constructor.name === bookModel_1.AuthorModel.name ? "author" : "error";
    return jsonName;
};
console.log(func(authorModel)); // object
