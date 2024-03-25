
import { BookGenre, Genre } from "../../../../DB_Functions/Set_Up/modelSetUp";
import { BaseBookAttributesModel, BaseAttributeModel } from "../../../baseModel";
import { BookItemModel } from "../bookModel";
import { DatabaseError, NotFoundError } from "../../../../../utils/other/customError";


export class BookGenreModel extends BaseBookAttributesModel<BookGenre> {
    public constructor() {
        super(BookGenre)
    }

    private genreTable = new GenreModel();

    public async addBookGenreLink(bookName: string, genreName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, genreName, this.genreTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookGenreModel() FUNC ERROR " + err);
        }
    }
}

export class GenreModel extends BaseAttributeModel<Genre> {

    public constructor() {
        super(Genre)
    }

}