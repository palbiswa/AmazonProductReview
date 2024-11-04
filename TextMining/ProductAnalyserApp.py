from flask import Flask, jsonify, request
import logging
from flask_cors import CORS

from TextMining.NLTKKeyPhraseExtractor import NLTKKeyPhraseExtractor
from TextMining.TextBlobSentimentAnalyzer import TextBlobSentimentAnalyzer

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_product():
    app.logger.info('Rest api called and review received .....')

    review_data = request.get_json()
    app.logger.info(f'Review data: {review_data}')

    if len(review_data) > 0 :

        # Analyze Sentiment :
        analyzer = TextBlobSentimentAnalyzer(review_data)
        sentiment = analyzer.get_sentiment()

        # Extract Key phrases
        extractor = NLTKKeyPhraseExtractor(review_data)
        key_phrases = extractor.extract_key_phrases()

        response_data = {
            "reviewSentiment": sentiment,
            "popularReviewKeywords": key_phrases
        }

    else:

        # Create Text Mining Response
        response_data = {
            "reviewSentiment": "Not Found",
            "popularReviewKeywords": ["No Data Available"]
        }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
