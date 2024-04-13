from flask import Flask, request, jsonify
import tensorflow as tf
import keras
import tensorflow_ranking as tfr
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



def tensor_to_json(tensor):
    tensor_list = tensor.numpy().tolist()
    return jsonify(tensor_list)


def prepare_batches(user_id, movie_titles, batch_size=5):
    # If the list of movie_titles is shorter than 5, extend it by repeating titles
    if len(movie_titles) < batch_size:
        movie_titles = (movie_titles * batch_size)[:batch_size]
    elif len(movie_titles) % batch_size != 0:
        # If the list is not a multiple of 5, extend it by repeating the first few titles
        extra_titles_needed = batch_size - (len(movie_titles) % batch_size)
        movie_titles.extend(movie_titles[:extra_titles_needed])

    # Create batches of 5 movie_titles
    title_batches = [movie_titles[i:i + batch_size]
                     for i in range(0, len(movie_titles), batch_size)]
    # Associate each batch with the same user_id
    user_batches = [[user_id] * batch_size for _ in range(len(title_batches))]

    return title_batches


def scale_to_range(input_list, new_min=0, new_max=5):
    # Find the current range
    old_min, old_max = min(input_list), max(input_list)

    # Avoid division by zero in case all values are the same
    if old_min == old_max:
        # or return any constant list within [new_min, new_max]
        return [new_min] * len(input_list)

    # Scale values to the new range [0, 5]
    scaled_list = [((value - old_min) / (old_max - old_min)) *
                   (new_max - new_min) + new_min for value in input_list]

    return scaled_list


def make_predictions(model, user_id, books_lists):
    predictions = []
    for i in range(len(books_lists)):
        predictions.append(model({
            "user_id": tf.constant([user_id]),
            "movie_title": tf.constant([books_lists[i]])
        }))

    predictions = tf.concat(predictions, axis=1)
    predictions = predictions.numpy().flatten().tolist()
    return predictions


def predict_books(user_id="42", movie_titles=["1", "2", "3", "4", "5", "1", "2", "3", "4", "5", "1", "2", "3"]):
    rating_len = len(movie_titles)
    listwise_model = keras.models.load_model('./easy_listwise_model_saved')
    batched_books_ids = prepare_batches(user_id, movie_titles)
    predictions = make_predictions(listwise_model, user_id, batched_books_ids)
    predictions = scale_to_range(predictions)
    predictions = predictions[:rating_len]

    # predictions = tensor_to_json(predictions)
    return predictions


@app.route('/', methods=['POST', 'GET'])
def hello_world():
    data = request.get_json()
    user_id = data['user_id']
    movie_titles = data['movie_titles']
    predictions = predict_books(user_id, movie_titles)
    return predictions


if __name__ == '__main__':
    app.run(debug=True)
