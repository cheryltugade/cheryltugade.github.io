/***
 * This script runs the interactive elemnts of Cheryl's World.
 */

let currentSlide = 0;
let currentSlides = [];

/***
 * Animates the 'Explore World' button into the splash screen upon loading.
 */
window.onload = function() {
    const splashImage = document.querySelector('.splash-container img');
    setTimeout(() => {
        splashImage.classList.add('bounce-in'); /* Trigger bounce-in effect */
    }, 500);
}

function adjustSplashPageElementDimensions() {
    if (visualViewport.width < visualViewport.height) {
        splashImage.style.width = '60%';
        splashImage.style.height = 'auto';
    } else {
        splashImage.style.width = '35%'
        splashImage.style.height = 'auto';
    }
}

window.addEventListener('load', adjustSplashPageElementDimensions);
window.addEventListener('resize', adjustSplashPageElementDimensions);

window.onresize = function() {
    const splashImage = document.querySelector('.splash-container img');
    if (visualViewport.width < visualViewport.height) {
        splashImage.style.width = '70%';
        splashImage.style.height = 'auto';
    } else {
        splashImage.style.width = '35%'
        splashImage.style.height = 'auto';
    }
}
    

/***
 * Loads the main room when the splash image is clicked.
 */
const splashImage = document.getElementById('splash-image');
const splashContainer = document.querySelector('.splash-container');
const mainContent = document.querySelector('.background');
splashImage.addEventListener('click', () => {
    splashContainer.style.opacity = 0;

    setTimeout(() => {
        splashContainer.style.display = 'none';
    }, 1000);

    setTimeout(() => {
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = 1;
    }, 500);

    const tutorialContainer = document.querySelector('.tutorial-container');
    setTimeout(() => {
        tutorialContainer.style.opacity = '1';
        tutorialContainer.style.visibility = 'visible';
    }, 3000);

});

/***
 * Shows a slide in the popoup depending on index.
 */
function showSlide(index) {
    const slides = document.querySelectorAll('.popup-slide');    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
}

// // Function to detect if the user is on a mobile device
//     function isMobileDevice() {
//         return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
//     }

//     // Function to check screen orientation and toggle the rotate message
//     function checkOrientation() {
//         const rotateMessage = document.getElementById('rotate-message');
//         if (isMobileDevice() && window.innerWidth < window.innerHeight) {
//             // Show message for portrait mode on mobile devices
//             rotateMessage.style.display = 'flex';
//         } else {
//             // Hide the message otherwise
//             rotateMessage.style.display = 'none';
//         }
//     }

//     // Add event listeners for screen orientation changes and page load
//     window.addEventListener('resize', checkOrientation);
//     window.addEventListener('load', checkOrientation);

/***
 * Creates slides for a popup based on info.
 */
function createSlides(info) {
    const slidesContainer = document.getElementById('popup-slides');
    slidesContainer.innerHTML = '';
    currentSlides = JSON.parse(info);

    const popupNav = document.querySelector('.popup-nav');
    if (currentSlides.length === 1) {
        popupNav.style.display = 'none';
    } else {
        popupNav.style.display = 'flex';
    }

    currentSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'popup-slide';
        
        let slideContent = `<p class="popup-title">${slide.title}</p>`;

        if (slide.youtube_link) {
            slideContent += `
                <div style="left: 0; width: 75%; height: 0; position: relative; padding-bottom: 42.1875%;"><iframe src="${slide.youtube_link}" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0; border-radius: 8px;" allowfullscreen scrolling="no" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"></iframe></div>
            `;
        }

        if (slide.spotify_link) {
            slideContent += `
            <div style="left: 0; width: 75%; height: 0; position: relative; padding-bottom: 37.5%;"><iframe src="${slide.spotify_link}" style="top: 0; border: 2px solid orange; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"></iframe></div>
            `;
        }

        if (slide.link && slide.image) {
            slideContent += `
                <a class="popup-link" id="${slide.image_orientation}"href="${slide.link}" target="_blank">
                    <img class="popup-link-image" id ="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
                </a>
            `;
        } else if (slide.image) {
            slideContent += `
                <img class="popup-image" id ="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
            `;
        }

        // Add the text if it exists
        if (slide.text) {
            slideContent += `<p class="popup-text">${slide.text.replace(/\n/g, '<br>')}</p>`;
        }

        if (slide.long_text) {
            slideContent += `<p class="popup-long-text">${slide.long_text.replace(/\n/g, '<br>')}</p>`;
        }

        slideDiv.innerHTML = slideContent;
        slidesContainer.appendChild(slideDiv);
    });
    
    showSlide(0);
}
 
/***
 * Shows a pop-up when each object is clicked.
 */
document.querySelectorAll('.object').forEach(object => {
    object.addEventListener('click', function(e) {
        e.stopPropagation();
        const popup = document.getElementById('popup');
        createSlides(this.dataset.info);
        popup.style.display = 'block';
    });
});

/***
 * Closes the pop-up when the close buton is clicked.
 */
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});

/***
 * Navigates to the previous slide when the previous button is clicked.
 */
document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentSlide == 0) {
        showSlide(currentSlides.length - 1)
    } else if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
});


/***
 * Navigates to the next slide when the previous button is clicked.
 */
document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentSlide == currentSlides.length - 1) {
        showSlide(0)
    } else if (currentSlide < currentSlides.length - 1) {
        showSlide(currentSlide + 1);
    }
});

/***
 * Play the corresponding sound for an object whenever it is hovered over.
 */
const objects = document.querySelectorAll('.object');
objects.forEach((object) => {
    object.addEventListener('mouseenter', function () { // Trigger on hover
        const soundId = object.getAttribute('data-sound'); // Get the sound ID
        if (soundId) {
            const sound = document.getElementById(soundId);
            if (soundId == "hover-sound-drawing") {
                sound.volume = 1;
            } else {
                console.log(sound.volume)
                sound.volume = 0.5;
            }
            
            if (sound) {
                sound.currentTime = 0; // Reset sound to the beginning
                sound.play(); // Play the sound
            }
        }
    });
});

/***
 * Closes the pop-up when anywhere outside the pop-up is clicked.
 */
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target !== popup && !popup.contains(event.target)) {
        popup.style.display = 'none';
    }
});

document.querySelector('.gotit-btn').addEventListener('click', () => {
    const tutorialContainer = document.querySelector('.tutorial-container');
    tutorialContainer.style.display = 'none';
});