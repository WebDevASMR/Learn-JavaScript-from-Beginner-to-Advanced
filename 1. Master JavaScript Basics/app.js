/*
  App 1: Background colour changer
  -------------------------------
  Changes the background color of the web page based on the user's color selection from a color picker.

  Learn about handling input events, how to access the event target's value and how to modify the style of HTML elements.
*/
const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', (event) => {
  const selectedColor = event.target.value;
  document.body.style.backgroundColor = selectedColor;
});

/*
  App 2: Random quote
  ------------------
  Displays a random quote from an array of quotes when the user clicks a button.
  
  Learn about handling click events, generating random numbers, and updating the content of HTML elements.
*/
const quotes = [
  'If debugging is the process of removing bugs, then programming must be the process of putting them in. - Edsger Dijkstra',
  'There are only two kinds of programming languages: those people always complain about and those nobody uses. - Bjarne Stroustrup',
  "It's not a bug – it's an undocumented feature. - Anonymous",
  'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. - John Woods',
  'The only difference between a bug and a feature is the documentation. - Anonymous',
  'In theory, there is no difference between theory and practice. In practice, there is. - Yogi Berra',
  'Measuring programming progress by lines of code is like measuring aircraft building progress by weight. - Bill Gates',
  'The best thing about a boolean is even if you are wrong, you are only off by a bit. - Anonymous',
  "Why do Java developers wear glasses? Because they don't C#. - Anonymous",
  "There are 10 types of people in this world: those who understand binary and those who don't. - Anonymous",
];
const quoteBtn = document.getElementById('quote-btn');
quoteBtn.addEventListener('click', () => {
  const quoteText = document.getElementById('quote-text');
  const randomNumber = Math.floor(Math.random() * (quotes.length + 1));
  const randomQuote = quotes[randomNumber];
  quoteText.textContent = randomQuote;
});

/*
  App 3: Counting characters
  --------------------------
  Counts the number of characters typed in a textarea and updates the count on the page.

  Learn about handling keyup events, accessing the value of HTML input elements, and updating the content of HTML elements.
*/
const textarea = document.getElementById('textarea');
textarea.addEventListener('keyup', (event) => {
  const characterCountText = document.getElementById('character-count');
  characterCountText.textContent = event.target.value.length;
});

/*
  App 4: Palindrome Checker
  -------------------------
  Checks whether a given word is a palindrome (a word that reads the same backward) and displays the result on the page.

  Learn about handling click events, accessing the value of input elements, working with strings, writing custom functions in JavaScript and using array methods like reverse() and join() to manipulate strings.
*/
const palindromeBtn = document.getElementById('palindrome-btn');
palindromeBtn.addEventListener('click', () => {
  const palindromeInput = document.getElementById('palindrome-input');
  const palindromeResult = document.getElementById('palindrome-result');
  const inputWord = palindromeInput.value;

  if (isPalindrome(inputWord)) {
    palindromeResult.textContent = `"${inputWord}" is a palindrome`;
  } else {
    palindromeResult.textContent = `"${inputWord}" is not a palindrome`;
  }
});

function isPalindrome(input) {
  // remove any non-letter characters and convert to lowercase
  const inputWord = input.toLowerCase().replace(/[^a-z]/g, '');

  // reverse the word and compare to the original
  const reversedWord = [...inputWord].reverse().join('');
  return inputWord === reversedWord;
}

/*
  App 5: Anagram Checker
  ----------------------
  Checks whether two given strings are anagrams (words that can be formed by rearranging the letters of another word) and displays the result on the page.
  
  Like the palinedrome app, but also learn about string and array methods like toLowerCase(), replace(), split(), sort(), and join() to manipulate strings.
*/
document.getElementById('anagram-btn').addEventListener('click', () => {
  const stringOne = document.getElementById('string-one').value;
  const stringTwo = document.getElementById('string-two').value;
  const result = document.getElementById('anagram-result');

  if (isAnagram(stringOne, stringTwo)) {
    result.textContent = `The strings "${stringOne}" and "${stringTwo}" are anagrams.`;
  } else {
    result.textContent = `The strings "${stringOne}" and "${stringTwo}" are not anagrams.`;
  }
});

function isAnagram(str1, str2) {
  // remove any non-letter characters, convert to lowercase and sort the letters alphabetically
  const normalise = (str) => {
    str
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .sort()
      .join('');

    // compare the normalised strings
    return normalise(str1) === normalise(str2);
  };
}

/*
  App 6: Search List
  ------------------
  Filters a list of items based on user input in a search field and updates the displayed list accordingly.

  Learn about handling keyup events, accessing the value of input elements, working with arrays, updating the DOM and using array methods like filter() and map() to manipulate arrays based on user input.
*/
const listItemsCollection = document.getElementById('list').children;
// create an array of the original list items
const originalItemsArray = [...listItemsCollection].map(
  (item) => item.textContent
);

document.getElementById('search-list').addEventListener('keyup', (event) => {
  // get the searchTerm
  const searchTerm = event.target.value.toLowerCase();

  // create a filtered list from the search term
  const filteredList = originalItemsArray.filter((item) =>
    item.toLowerCase().includes(searchTerm)
  );

  // update the list in the DOM with the filtered results
  document.getElementById('list').innerHTML = filteredList
    .map((item) => `<li>${item}</li>`)
    .join('');
});
