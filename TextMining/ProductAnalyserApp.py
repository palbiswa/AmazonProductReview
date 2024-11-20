from flask import Flask, jsonify, request
import logging
from flask_cors import CORS

from TextMining.NLTKKeyPhraseExtractor import NLTKKeyPhraseExtractor
from TextMining.TextBlobSentimentAnalyzer import TextBlobSentimentAnalyzer
from TextMining.TextBlobSentimentTrends import TextBlobSentimentTrends
from TextMining.VaderSentimentAnalyzer import VaderSentimentAnalyzer
from TextMining.VaderSentimentTrends import VaderSentimentTrends

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_product():
    app.logger.info('Rest api called and review received .....')
    raw_review_data = request.get_json()
    selected_model = raw_review_data.get("model", "textblob")
    review_data = []
    # Iterating through the raw_review_data to remove unwanted strings
    raw_review_data = raw_review_data.get("reviews", [])
    for cur_review in raw_review_data:
        if cur_review != 'Read more':
            processed_data = cur_review.replace('<br>','')
            if processed_data != '':
                review_data.append(processed_data)
    app.logger.info(f'Model used: {selected_model}')
    app.logger.info(f'Review data: {review_data}')
    if len(review_data) > 0 :
        if selected_model == "vader":
            analyzer = VaderSentimentAnalyzer(review_data)
            sentiment = analyzer.get_sentiment()
            analyzer = VaderSentimentTrends(review_data)
            sentiment_scores_charting = analyzer.calculate_sentiment()
        else:
            analyzer = TextBlobSentimentAnalyzer(review_data)
            sentiment = analyzer.get_sentiment()
            analyzer = TextBlobSentimentTrends(review_data)
            sentiment_scores_charting = analyzer.calculate_sentiment()

        # Extract Key phrases
        extractor = NLTKKeyPhraseExtractor(review_data)
        key_phrases = extractor.extract_key_phrases()

        response_data = {
            "reviewSentiment": sentiment,
            "popularReviewKeywords": key_phrases,
            "sentimentChartData": sentiment_scores_charting,
            "modelUsed": selected_model
        }

    else:

        # Create Text Mining Response
        response_data = {
            "reviewSentiment": "Not Found",
            "popularReviewKeywords": ["No Data Available"],
            "modelUsed": selected_model
        }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
