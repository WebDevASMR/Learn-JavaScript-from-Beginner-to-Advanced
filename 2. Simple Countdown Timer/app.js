// HTML elements
const endTime = document.getElementById('end-time');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const timerDisplay = document.getElementById('timer');

// listen for user input on the end time input field
endTime.addEventListener('input', () => {
  startBtn.disabled = false;
});

// event listeners for countdown buttons
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

// global variables
let countdownInterval;

function startTimer() {
  const endTimeValue = new Date(endTime.value);

  // check if the end time is valid
  if (isNaN(endTimeValue)) {
    alert('Please set a valid end time');
    return;
  }

  // clear any existing countdown interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // enable the stop button and disable the start button
  stopBtn.disabled = false;
  startBtn.disabled = true;

  // start a new countdown interval
  countdownInterval = setInterval(() => {
    const now = Date.now();

    // calculate the remaining time
    const remainingTime = endTimeValue - now;

    // if the remaining time is 0 or less, the countdown has finished
    if (remainingTime <= 0) {
      clearInterval(countdownInterval); // stop the countdown
      timerDisplay.textContent = '00:00:00'; // reset the display to 00:00:00
      alert('Countdown finished!'); // show a message to the user
    } else {
      // display the remaining time
      timerDisplay.textContent = formatTime(remainingTime);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdownInterval); // stop the timer from counting down
  timerDisplay.textContent = '00:00:00'; // reset the timer display
  stopBtn.disabled = true; // disable the stop button
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000); // convert milliseconds to total seconds
  const days = Math.floor(totalSeconds / 86400); // convert total seconds to days
  const hours = Math.floor((totalSeconds % 86400) / 3600); // convert total seconds to hours within a 24-hour range
  const minutes = Math.floor((totalSeconds % 3600) / 60); // convert total seconds to minutes
  const seconds = totalSeconds % 60; // convert total seconds to seconds

  // Return the days (if any), hours, minutes, and seconds as a string
  let daysString = '';
  if (days > 0) {
    daysString = days === 1 ? `${days} day, ` : `${days} days, `;
  }

  return `${daysString}${hours.toString().padStart(2, '0')} hours, ${minutes
    .toString()
    .padStart(2, '0')} minutes & ${seconds
    .toString()
    .padStart(2, '0')} seconds`;
}
