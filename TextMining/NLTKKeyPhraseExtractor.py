import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.collocations import BigramCollocationFinder
from nltk.metrics import BigramAssocMeasures

# Download necessary NLTK data files
nltk.download('punkt_tab')
nltk.download('stopwords')


class NLTKKeyPhraseExtractor:
    def __init__(self, texts):
        if isinstance(texts, list):
            self.texts = ' '.join(texts)  # Join the list into a single string
        else:
            self.texts = texts
        self.stop_words = set(stopwords.words('english'))

    def extract_key_phrases(self, top_n=10):
        words = word_tokenize(self.texts)
        words = [word.lower() for word in words if word.isalnum() and word.lower() not in self.stop_words]

        bigram_finder = BigramCollocationFinder.from_words(words)
        bigrams = bigram_finder.nbest(BigramAssocMeasures.likelihood_ratio, top_n)

        key_phrases = [' '.join(bigram) for bigram in bigrams]
        return key_phrases
