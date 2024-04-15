import tensorflow as tf
import tensorflow_ranking as tfr
import tensorflow_recommenders as tfrs

class RankingModel(tfrs.Model):

    def __init__(self, loss):
        super().__init__()
        embedding_dimension = 32

        # User embeddings
        self.user_embeddings = tf.keras.Sequential([
            UserModel()
        ])
        # Restaurand embeddings
        self.book_embeddings = tf.keras.Sequential([
            BookModel(),

        ])
        # Compute predictions
        self.score_model = tf.keras.Sequential([
            # Learn multiple dense layers.
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dense(64, activation="relu"),
            # Sigmoid activation to ensure output is between 0 and 1
            tf.keras.layers.Dense(1, activation="sigmoid"),
            # Scale up by 5 to adjust the range to 0-5
            tf.keras.layers.Lambda(lambda x: x * 5)

        ])

        self.task = tfrs.tasks.Ranking(
            loss=loss,
            metrics=[
                tfr.keras.metrics.NDCGMetric(name="ndcg_metric"),
                tf.keras.metrics.RootMeanSquaredError()
            ]
        )

    def call(self, features):
        # Extract user embeddings [batch_size, embedding_dim].
        user_embeddings = self.user_embeddings({
            'user_id': features['user_id'],
            'sex': features['sex'],
        })

        # Extract book embeddings [batch_size, num_books, embedding_dim].
        book_embeddings = self.book_embeddings({
            'book_id': features['book_id'],
            'book_title': features['book_title'],
            # Potentially include other book features here
        })

        # Determine the number of books in the list for each user.
        list_length = features['book_id'].shape[1]

        # Repeat the user embeddings to match the shape of book embeddings.
        # New shape: [batch_size, num_books, embedding_dim].
        user_embedding_repeated = tf.repeat(
            tf.expand_dims(user_embeddings, 1), [list_length], axis=1)

        print("User Embedding Repeated Shape:", user_embedding_repeated.shape)
        print("Book Embeddings Shape:", book_embeddings.shape)

        # Concatenate user and book embeddings along the last dimension.
        combined_embeddings = tf.concat(
            [user_embedding_repeated, book_embeddings], axis=2)

        combined_embeddings_flat = tf.reshape(
            combined_embeddings, [tf.shape(combined_embeddings)[0] * list_length, -1])

        # Passing the flattened embeddings to the scoring model.
        scores_flat = self.score_model(combined_embeddings_flat)

        # Reshaping scores to match the labels shape (10, 5)
        scores = tf.reshape(scores_flat, [tf.shape(
            features['book_id'])[0], list_length])

        return scores

    def compute_loss(self, features, training=False):
        labels = features.pop("user_rating")
        scores = self(features)
        return self.task(
            labels=labels,
            predictions=scores,
        )


class UserModel(tf.keras.Model):

    # don't these need to be passed in?
    def __init__(self):
        super().__init__()

        # User embedding based on user_id
        self.user_id_embedding = tf.keras.Sequential([
            user_id_lookup,
            tf.keras.layers.Embedding(user_id_lookup.vocabulary_size(), 32),
        ])

        # Sex as a boolean feature, could be treated directly as an input or embedded
        self.sex_embedding = tf.keras.layers.Embedding(
            2, 32)  # Assuming sex is represented as 0 or 1

    def call(self, inputs):
        print("Model input keys:", list(inputs.keys()))
        for key, value in inputs.items():
            print(f"Shape of {key}:", value.shape)

        user_id_feature = self.user_id_embedding(inputs["user_id"])
        sex_feature = self.sex_embedding(
            tf.cast(inputs["sex"], tf.int32))  # Corrected attribute name

        return tf.concat([
            user_id_feature,
            sex_feature,
        ], axis=1)

    def get_config(self):
        config = super(UserModel, self).get_config()
        config.update({
            "user_ids_vocabulary": self.user_id_embedding.layers[0].get_vocabulary(),
            "sex_embedding_dim": self.sex_embedding.output_dim
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)


class BookModel(tf.keras.Model):

    def __init__(self):
        super().__init__()

        # book_id
        # self.book_id_embedding = tf.keras.Sequential([
        #     book_id_lookup,
        #     tf.keras.layers.Embedding(book_id_lookup.vocabulary_size(), 32)
        # ])

        self.book_id_embedding = tf.keras.Sequential([
            tf.keras.layers.IntegerLookup(
                vocabulary=unique_book_ids, mask_token=None),
            tf.keras.layers.Embedding(len(unique_book_ids) + 1, 32)
        ])

        self.book_title_embedding = tf.keras.Sequential([
            tf.keras.layers.StringLookup(
                vocabulary=unique_book_titles, mask_token=None),
            tf.keras.layers.Embedding(len(unique_book_titles) + 1, 32)
        ])

        # self.book_title_embedding = tf.keras.Sequential([
        #     book_title_lookup,
        #     tf.keras.layers.Embedding(book_title_lookup.vocabulary_size(), 32)
        # ])

        # self.num_pages_embedding = tf.keras.Sequential([
        #    num_pages_lookup,
        #    tf.keras.layers.Embedding(num_pages_lookup.vocabulary_size(), 32)
        # ])

    def call(self, inputs):
        print("Model input keys:", list(inputs.keys()))
        for key, value in inputs.items():
            print(f"Shape of {key}:", value.shape)
        return tf.concat([
            self.book_id_embedding(inputs["book_id"]),
            self.book_title_embedding(inputs["book_title"]),
            # self.num_pages_embedding(inputs["num_pages"]),
        ], axis=-1)

    def get_config(self):
        config = super(BookModel, self).get_config()
        config.update({
            "unique_book_ids": self.book_id_embedding.layers[0].get_vocabulary(),
            "unique_book_titles": self.book_title_embedding.layers[0].get_vocabulary()
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)
