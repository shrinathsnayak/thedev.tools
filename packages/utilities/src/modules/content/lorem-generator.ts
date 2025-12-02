/**
 * Lorem Ipsum text generator
 */

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

export interface LoremOptions {
  words?: number;
  sentences?: number;
  paragraphs?: number;
  startWithLorem?: boolean;
}

/**
 * Gets random word from Lorem Ipsum dictionary
 * @returns Random word string
 */
function _getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] || "lorem";
}

/**
 * Capitalizes first letter of a word
 * @param word - Word to capitalize
 * @returns Capitalized word string
 */
function _capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Generates a Lorem Ipsum sentence
 * @param wordCount - Number of words in sentence
 * @param capitalizeFirst - Whether to capitalize first word (default: true)
 * @returns Generated sentence string
 */
function _generateSentence(
  wordCount: number,
  capitalizeFirst: boolean = true,
): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const word = _getRandomWord();
    words.push(i === 0 && capitalizeFirst ? _capitalize(word) : word);
  }
  return words.join(" ") + ".";
}

/**
 * Generates Lorem Ipsum text in various formats
 * @param options - Generation options (words, sentences, paragraphs, startWithLorem)
 * @returns Generated Lorem Ipsum text string
 */
export function generateLorem(options: LoremOptions = {}): string {
  const { words, sentences, paragraphs, startWithLorem = true } = options;

  if (words !== undefined && words > 0) {
    const wordList: string[] = [];

    if (startWithLorem && words > 0) {
      wordList.push("Lorem");
    }

    const remainingWords = startWithLorem ? words - 1 : words;

    for (let i = 0; i < remainingWords; i++) {
      wordList.push(_getRandomWord());
    }

    return wordList.join(" ");
  }

  if (sentences !== undefined && sentences > 0) {
    const sentenceList: string[] = [];
    const avgWordsPerSentence = 10;

    for (let i = 0; i < sentences; i++) {
      const wordCount = Math.floor(
        avgWordsPerSentence * (0.7 + Math.random() * 0.6),
      );
      sentenceList.push(_generateSentence(wordCount, i === 0 && startWithLorem));
    }

    return sentenceList.join(" ");
  }

  const paragraphCount = paragraphs || 3;
  const sentencesPerParagraph = 4;
  const paragraphList: string[] = [];

  for (let p = 0; p < paragraphCount; p++) {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesPerParagraph; s++) {
      const wordCount = Math.floor(10 * (0.7 + Math.random() * 0.6));
      sentences.push(
        _generateSentence(
          wordCount,
          s === 0 && (p === 0 ? startWithLorem : false),
        ),
      );
    }
    paragraphList.push(sentences.join(" "));
  }

  return paragraphList.join("\n\n");
}

/**
 * Generates array of Lorem Ipsum words
 * @param count - Number of words to generate
 * @returns Array of word strings
 */
export function generateWords(count: number): string[] {
  return Array.from({ length: count }, () => _getRandomWord());
}

/**
 * Generates array of Lorem Ipsum sentences
 * @param count - Number of sentences to generate
 * @returns Array of sentence strings
 */
export function generateSentences(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const wordCount = Math.floor(10 * (0.7 + Math.random() * 0.6));
    return _generateSentence(wordCount, i === 0);
  });
}

/**
 * Generates array of Lorem Ipsum paragraphs
 * @param count - Number of paragraphs to generate
 * @param sentencesPerParagraph - Number of sentences per paragraph (default: 4)
 * @returns Array of paragraph strings
 */
export function generateParagraphs(
  count: number,
  sentencesPerParagraph: number = 4,
): string[] {
  return Array.from({ length: count }, (_, pIndex) => {
    const sentences = Array.from(
      { length: sentencesPerParagraph },
      (_, sIndex) => {
        const wordCount = Math.floor(10 * (0.7 + Math.random() * 0.6));
        return _generateSentence(wordCount, sIndex === 0 && pIndex === 0);
      },
    );
    return sentences.join(" ");
  });
}
