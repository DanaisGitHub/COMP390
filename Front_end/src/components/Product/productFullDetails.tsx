import { ProductDetailsType } from '@/types/API_Types/Book/BookApiTypes'

export default function BookDetails(props: ProductDetailsType) {
    const { book, author, description, numPages, rating_we_think, numOfVoters } = props;
    return (
        <div>
            <title>Book Details</title>
            <h1>{book}</h1>
            <h2>{author}</h2>
            <p>{description}</p>
            <p>{numPages}</p>
            <p>{rating_we_think}</p>
            <p>{numOfVoters}</p>
        </div>
    );
};
