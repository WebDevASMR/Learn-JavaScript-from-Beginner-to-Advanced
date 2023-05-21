// select all image elements from the DOM
const images = document.querySelectorAll('img');
let currentSlideIndex = 0; // initialise the current slide index

// loop through all images and add a dataset 'index' property and also set the alt text for accessibility
for (let i = 0; i < images.length; i++) {
  images[i].dataset.index = i;
  images[i].alt = `Image slide ${i + 1}`;
}

// add a keyup listener to the body so that the images can be navigated using left/right keyboard keys
document.body.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    // decrement or increment the current index based on the key pressed
    event.key === 'ArrowLeft' ? currentSlideIndex-- : currentSlideIndex++;

    // if the current slide index is beyond the last slide, wrap around to the first slide
    if (currentSlideIndex >= images.length) {
      currentSlideIndex = 0;
    }

    // if the current slide index is before the first slide, wrap around to the last slide
    if (currentSlideIndex < 0) {
      currentSlideIndex = images.length - 1;
    }

    // call the changeImage function to update the visible image
    changeImage();
  }
});

// add a click event listener for thumbnail images
document.body.addEventListener('click', (event) => {
  // only react if thumbnail image is clicked and set the current slide index to the index of the clicked thumbnail
  if (event.target.className.includes('thumbnail')) {
    currentSlideIndex = Number(event.target.dataset.index);
    changeImage();
  }
});

// change the displayed image, first remove all clases from all images and then call the setImageClasses function
function changeImage() {
  images.forEach((image) => (image.className = ''));
  setImageClasses();
}

// set the classes of the images based on the current slide index
function setImageClasses() {
  // add 'active' class to the current slide
  images[currentSlideIndex].classList.add('active');

  // calculate the previous and next image indices
  const prevIndex =
    currentSlideIndex - 1 < 0 ? images.length - 1 : currentSlideIndex - 1;
  const nextIndex =
    currentSlideIndex + 1 >= images.length ? 0 : currentSlideIndex + 1;

  // add the 'thumbnail' and position classes to the previous and next images
  images[prevIndex].className = 'thumbnail thumbnail-prev';
  images[nextIndex].className = 'thumbnail thumbnail-next';
}
