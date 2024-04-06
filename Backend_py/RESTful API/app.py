from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    request_data = request
    print(request_data)
    return request_data

if __name__ == '__main__':
    app.run(debug=True)
    
    

    # what shoyld be the return type of this function?
    # what should be the input type of this function?
    
@app.route('/books/rank', methods=['POST', 'GET'])
def rank_books():
    request_data = request.get_data()
    return request_data