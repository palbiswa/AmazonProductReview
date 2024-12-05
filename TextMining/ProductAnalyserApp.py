from flask import Flask, jsonify, request
import logging
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime
import calendar

from TextMining.NLTKKeyPhraseExtractor import NLTKKeyPhraseExtractor
from TextMining.TextBlobSentimentAnalyzer import TextBlobSentimentAnalyzer
from TextMining.TextBlobSentimentTrends import TextBlobSentimentTrends
from TextMining.VaderSentimentAnalyzer import VaderSentimentAnalyzer
from TextMining.VaderSentimentTrends import VaderSentimentTrends

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)


def group_by_month(review_dates, sentiment_scores):
    monthly_sentiments = defaultdict(list)

    for date_str, sentiment in zip(review_dates, sentiment_scores):
        try:
            date = datetime.strptime(date_str, '%m/%d/%Y')
            month_key = date.replace(day=1)
            monthly_sentiments[month_key].append(sentiment)
        except ValueError as e:
            app.logger.warning(f"Date parsing error: {e}")
            continue

    sentiment_trends = [
        {
            'date': date.strftime('%m-%Y'),
            'avgSentiment': sum(sentiments) / len(sentiments)
        }
        for date, sentiments in monthly_sentiments.items()
    ]

    return sorted(sentiment_trends,
                  key=lambda x: datetime.strptime(x['date'], '%m-%Y'))
@app.route('/analyze', methods=['POST'])
def analyze_product():
    app.logger.info('Rest api called and review received .....')
    raw_review_data = request.get_json()
    selected_model = raw_review_data.get("model", "textblob")
    review_data = []
    # Iterating through the raw_review_data to remove unwanted strings
    app.logger.debug(f"Received raw data: {raw_review_data}")
    review_dates = raw_review_data.get("reviewDates", [])
    raw_review_data = raw_review_data.get("reviews", [])
    for cur_review in raw_review_data:
        if cur_review != 'Read more':
            processed_data = cur_review.replace('<br>','')
            if processed_data != '':
                review_data.append(processed_data)

    app.logger.info(f'Model used: {selected_model}')
    app.logger.info(f'Review data: {len(review_data)}')
    app.logger.info(f'Review dates: {len(review_dates)}')

    sentiment_scores = []
    sentiment_dates = []

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

        app.logger.info(f'count: {len(sentiment_scores_charting)}')



        # Calculate sentiment trends by date
        sentiment_trends = group_by_month(review_dates, sentiment_scores_charting)

        response_data = {
            "reviewSentiment": sentiment,
            "popularReviewKeywords": key_phrases,
            "sentimentChartData": sentiment_scores_charting,
            "sentimentTrendsByDate": sentiment_trends,
            "modelUsed": selected_model
        }

        app.logger.info(f'sentimentTrendsByDate: {sentiment_trends}')

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
