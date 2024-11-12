from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class VaderSentimentTrends:

    def __init__(self, text_list):
        self.text_list = text_list
        self.analyzer = SentimentIntensityAnalyzer()

    def calculate_sentiment(self):
        sentiment_data = []
        for text in self.text_list:
            score = self.analyzer.polarity_scores(text)['compound']
            sentiment_data.append(round(score, 2))
        return list(set(sentiment_data))

# Example usage:
text_list = ["I love this!", "This is terrible.", "I'm feeling great today."]
analyzer = VaderSentimentTrends(text_list)
sentiment_scores = analyzer.calculate_sentiment()
print(sentiment_scores)
