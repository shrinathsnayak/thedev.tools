/**
 * Lorem Ipsum Generator
 * Generates various types of placeholder text
 */

export interface LoremOptions {
  count?: number;
  units?: "words" | "sentences" | "paragraphs";
  startWithLorem?: boolean;
}

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
  "dolore",
  "eu",
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

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Nisi ut aliquip ex ea commodo consequat.",
  "Velit esse cillum dolore eu fugiat nulla pariatur.",
  "Mollit anim id est laborum.",
];

/**
 * Generates Lorem Ipsum placeholder text
 * @param options - Generation options (count, units, startWithLorem)
 * @returns Generated Lorem Ipsum text string
 */
export function generateLoremIpsum(options: LoremOptions = {}): string {
  const { count = 5, units = "words", startWithLorem = true } = options;

  if (units === "words") {
    return _generateWords(count, startWithLorem);
  } else if (units === "sentences") {
    return _generateSentences(count);
  } else {
    return _generateParagraphs(count);
  }
}

/**
 * Generates Lorem Ipsum words
 * @param count - Number of words to generate
 * @param startWithLorem - Whether to start with "Lorem ipsum"
 * @returns Generated words string
 */
function _generateWords(count: number, startWithLorem: boolean): string {
  if (startWithLorem && count > 0) {
    const words = ["Lorem", "ipsum"];
    for (let i = 2; i < count; i++) {
      const word = LOREM_WORDS[i % LOREM_WORDS.length]!;
      words.push(i === 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
    }
    return words.slice(0, count).join(" ");
  }

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = LOREM_WORDS[i % LOREM_WORDS.length]!;
    words.push(i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }
  return words.join(" ");
}

/**
 * Generates Lorem Ipsum sentences
 * @param count - Number of sentences to generate
 * @returns Generated sentences string
 */
function _generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]!);
  }
  return sentences.join(" ");
}

/**
 * Generates Lorem Ipsum paragraphs
 * @param count - Number of paragraphs to generate
 * @returns Generated paragraphs string separated by double newlines
 */
function _generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentences = _generateSentences(3 + Math.floor(Math.random() * 3));
    paragraphs.push(sentences);
  }
  return paragraphs.join("\n\n");
}

/**
 * Generates placeholder text in various themed variations
 * @param type - Placeholder type (latin, bacon, cat, pirate, hipster)
 * @param count - Number of words to generate (default: 5)
 * @returns Generated placeholder text string
 */
export function generatePlaceholderText(
  type: string,
  count: number = 5,
): string {
  switch (type.toLowerCase()) {
    case "latin":
      return generateLoremIpsum({
        count,
        units: "words",
        startWithLorem: true,
      });

    case "bacon":
      return _generateBaconIpsum(count);

    case "cat":
      return _generateCatIpsum(count);

    case "pirate":
      return _generatePirateIpsum(count);

    case "hipster":
      return _generateHipsterIpsum(count);

    default:
      return generateLoremIpsum({ count, units: "words" });
  }
}

/**
 * Generates Bacon Ipsum (meat-themed placeholder text)
 * @param count - Number of words to generate
 * @returns Generated bacon-themed text
 */
function _generateBaconIpsum(count: number): string {
  const baconWords = [
    "Bacon",
    "ipsum",
    "dolor",
    "amet",
    "spare",
    "ribs",
    "short",
    "loin",
    "sirloin",
    "pork",
    "belly",
    "chicken",
    "beef",
    "ham",
    "turkey",
    "venison",
    "brisket",
  ];

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = baconWords[i % baconWords.length]!;
    words.push(i === 0 ? word : word.toLowerCase());
  }
  return words.join(" ");
}

/**
 * Generates Cat Ipsum (cat-themed placeholder text)
 * @param count - Number of words to generate
 * @returns Generated cat-themed text
 */
function _generateCatIpsum(count: number): string {
  const catWords = [
    "Meow",
    "purr",
    "meow",
    "purr",
    "meow",
    "scratch",
    "catnip",
    "whiskers",
    "paws",
    "feline",
    "kitty",
    "meowzer",
    "meow",
    "purrfect",
  ];

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = catWords[i % catWords.length]!;
    words.push(i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }
  return words.join(" ");
}

/**
 * Generates Pirate Ipsum (pirate-themed placeholder text)
 * @param count - Number of words to generate
 * @returns Generated pirate-themed text
 */
function _generatePirateIpsum(count: number): string {
  const pirateWords = [
    "Ahoy",
    "matey",
    "ye",
    "landlubber",
    "scallywag",
    "shiver",
    "me",
    "timbers",
    "sloop",
    "buccaneer",
    "booty",
    "doubloon",
    "privateer",
    "brigantine",
    "peg",
    "leg",
  ];

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = pirateWords[i % pirateWords.length]!;
    words.push(i === 0 ? word : word.toLowerCase());
  }
  return words.join(" ");
}

/**
 * Generates Hipster Ipsum (hipster-themed placeholder text)
 * @param count - Number of words to generate
 * @returns Generated hipster-themed text
 */
function _generateHipsterIpsum(count: number): string {
  const hipsterWords = [
    "Artisan",
    "tote",
    "bag",
    "crucifix",
    "pug",
    "raw",
    "denim",
    "aesthetic",
    "swag",
    "tattooed",
    "woke",
    "celiac",
    "gluten-free",
    "shoreditch",
    "cold-pressed",
    "vegan",
  ];

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = hipsterWords[i % hipsterWords.length]!;
    words.push(i === 0 ? word : word.toLowerCase());
  }
  return words.join(" ");
}
