import { AuthorModel, BookItemModel, FormatModel, GenreModel } from './models/typesOfModels/bookModel';


const genreModel = new GenreModel();
const formatModel = new FormatModel();
const authorModel = new AuthorModel();


const func = (linkTable: (GenreModel | FormatModel | AuthorModel)) => {
    const jsonName = linkTable.constructor.name === GenreModel.name ? "genre"
        : linkTable.constructor.name === FormatModel.name ? "format"
            : linkTable.constructor.name === AuthorModel.name ? "author" : "error";
    return jsonName;
}

console.log(func(authorModel)); // object