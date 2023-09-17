const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

let apiQuotes = [];

// Show Loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// hide loading when its done
function loadingComplete() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

//When error occures take backup quotes from local document 'quotes.js'
function localBackup() {
  loading();

  const backup = localQuotes[Math.floor(Math.random() * localQuotes.length)];
  console.log(backup);

  if (!backup.author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = backup.author;
  }

  if (backup.text.length > 100) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }

  quoteText.textContent = backup.text;
  loadingComplete();
}

//Show new quote
function newQuote() {
  loading();
  try {
    //Pick a random quote from apiQuuotes array
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    //Check if author field is blank and replace it with unknown
    if (!quote.author) {
      authorText.textContent = "Unknown";
    } else {
      authorText.textContent = quote.author;
    }
    //Check quote length to determine styling
    if (quote.text.length > 50) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }

    quoteText.textContent = quote.text;
    loadingComplete();

    //if catch error, get quote source from quotes.js
  } catch (error) {
    loading();
    localBackup();
    loadingComplete();
  }
}

// Get Quotes From API
async function getQuotes() {
  loading();
  const apiUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
  try {
    const response = await fetch(apiUrl);

    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    localBackup();
  }
  loadingComplete();
}

//Tweet quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} -- ${authorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

//Event Listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);

//On Load
getQuotes();
