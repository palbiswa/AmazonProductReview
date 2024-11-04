from flask import Flask, jsonify, request
import logging
from flask_cors import CORS


logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_product():
    app.logger.info('Rest api called and review received .....')

    review_data = request.get_json()
    app.logger.info(f'Review data: {review_data}')

    # Create Text Mining Response
    response_data = {
        "reviewSentiment": "Positive",
        "popularReviewKeywords": ["Excellent", "GoodForMoney", "Happy"]
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
