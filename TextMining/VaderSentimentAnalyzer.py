from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class VaderSentimentAnalyzer:
    def __init__(self, text):
        if isinstance(text, list):
            text = ' '.join(text)
        self.text = text
        self.analyzer = SentimentIntensityAnalyzer()

    def get_sentiment(self):
        scores = self.analyzer.polarity_scores(self.text)
        compound_score = scores['compound']

        if compound_score >= 0.05:
            return "Positive"
        elif compound_score <= -0.05:
            return "Negative"
        else:
            return "Neutral"
