from textblob import TextBlob


class TextBlobSentimentAnalyzer:
    def __init__(self, text):
        if isinstance(text, list):
            text = ' '.join(text)  # Join the list into a single string
        self.text = text
        self.analysis = TextBlob(text)

    def get_sentiment(self):
        # Determine the sentiment polarity
        polarity = self.analysis.sentiment.polarity
         # Log the polarity to the console
        print(f"Polarity: {polarity}")
        # Classify the sentiment as positive or negative
        if polarity < -0.5:
            return "Strongly Negative"
        elif polarity > -0.5 and polarity < 0:
            return "Negative"
        elif polarity == 0:
            return "Neutral"
        elif polarity > 0 and polarity < 0.5:
            return "Positive"
        else:
            return "Strongly Positive" # polarity > 0.5



