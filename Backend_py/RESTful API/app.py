from flask import Flask, request, jsonify
import tensorflow as tf
import keras
import tensorflow_ranking as tfr
import tensorflow_recommenders as tfrs
from flask_cors import CORS
from model_class import UserModel, BookModel, RankingModel
from tensorflow.keras.models import load_model


app = Flask(__name__)

CORS(app)


def tensor_to_json(tensor):
    tensor_list = tensor.numpy().tolist()
    return jsonify(tensor_list)


def batched_book_features(input_list, batch_size=5):
    batched_books = []
    total_items = len(input_list)
    # Ensure we have enough elements
    expanded_book_ids = input_list * \
        ((batch_size + total_items - 1) // total_items)
    for i in range(0, len(expanded_book_ids), batch_size):
        # Get the batch of book IDs
        batch_ids = expanded_book_ids[i:i + batch_size]
        # Make sure the batch has exactly batch_size elements, wrapping around if necessary
        while len(batch_ids) < batch_size:
            batch_ids += input_list[:batch_size - len(batch_ids)]
        # Add the list of IDs to the batch
        batch = [batch_ids]
        batched_books.append(batch)
    # Ensure we only return the needed number of batches
    return batched_books[:len(input_list) // batch_size + (1 if len(input_list) % batch_size != 0 else 0)]


def get_saved_model():
    loaded_model = load_model('listwise_model', custom_objects={
        'UserModel': UserModel,
        'BookModel': BookModel,
        'RankingModel': RankingModel,
        'NDCGMetric': tfr.keras.metrics.NDCGMetric
    })
    return loaded_model


def make_predictions(model, user_id, sex, book_id, book_titles):
    predictions = []
    for i in range(len(book_id)):
        predictions.append(model({
            'user_id': tf.constant([user_id], dtype=tf.int64),
            'sex': tf.constant([sex], dtype=tf.int64),
            'book_id': tf.constant(book_id[i], dtype=tf.int64),
            'book_title': tf.constant(book_titles[i]),
        }, training=False))
    predictions = tf.concat(predictions, axis=1)
    predictions = predictions.numpy().flatten().tolist()
    return predictions


def predict_books(user_id=42, sex=0, book_id=[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6],  book_titles=["1", "2", "3", "4", "5", "6", "1", "2", "3", "4", "5", "6"]):

    rating_len = len(book_id)
    listwise_model = get_saved_model()

    batched_books_ids = batched_book_features(book_id)
    batched_book_titles = batched_book_features(book_titles)

    predictions = make_predictions(listwise_model,
                                   user_id, sex,
                                   batched_books_ids,
                                   batched_book_titles)
    predictions = predictions[:rating_len]
    # predictions = tensor_to_json(predictions)
    return predictions


@app.route('/', methods=['POST', 'GET'])
def hello_world():
    data = request.get_json()
    user_id = data['user_id']
    sex = data['sex']
    book_titles = data['book_title']
    book_id = data['book_id']
    predictions = predict_books(user_id,sex,book_id,book_titles)
    return predictions


if __name__ == '__main__':
    app.run(debug=True)
