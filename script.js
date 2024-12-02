/***
 * This script runs the interactive elements of Cheryl's World.
 */

let currentSlide = 0;
let currentSlides = [];

/***
 * This function determines if the user is on a mobile device or not.
 */
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/***
 * This function determines if the user is on a mobile device or not.
 */
function rotateMessageIfPortraitMobileDevice() {
    const rotateMessage = document.getElementById('rotate-message');
    
    if (isMobileDevice() && window.innerWidth < window.innerHeight) {
        rotateMessage.style.visibility = 'visible';
        rotateMessage.style.display = 'flex';
    } else {
        rotateMessage.style.display = 'none';
    }
}
// Check whether to show rotate message upon load and resize
window.addEventListener('load', rotateMessageIfPortraitMobileDevice);
window.addEventListener('resize', rotateMessageIfPortraitMobileDevice);

/***
 * This function triggers the bounce-in animation for the 'Explore World' button when the splash screen loads.
 */
window.onload = function() {
    const splashImage = document.querySelector('.splash-container img');
    setTimeout(() => {
        splashImage.classList.add('bounce-in');
    }, 500);
}

/***
 * This function adjusts the splash page dimensions depending on the viewport dimensions.
 */
function adjustSplashPageElementDimensions() {
    const splashImage = document.querySelector('.splash-container img');
    if (visualViewport.width < visualViewport.height) {
        splashImage.style.width = '60%';
        splashImage.style.height = 'auto';
    } else {
        splashImage.style.width = '35%'
        splashImage.style.height = 'auto';
    }
}
// Adjust splash page dimensions upon load and resize
window.addEventListener('load', adjustSplashPageElementDimensions);
window.addEventListener('resize', adjustSplashPageElementDimensions);    

/***
 * This function triggers the transition to the room when the 'Explore World' button is clicked.
 */
const splashImage = document.getElementById('splash-image');
splashImage.addEventListener('click', () => {
    const splashContainer = document.querySelector('.splash-container');
    const background = document.querySelector('.background');
    const tutorialContainer = document.querySelector('.tutorial-container');

    // Make sure that splashContainer is not visible
    splashContainer.style.opacity = 0;

    // Remove the splashContainer
    setTimeout(() => {
        splashContainer.style.display = 'none';
    }, 1000);

    // Make the background visible
    setTimeout(() => {
        background.style.visibility = 'visible';
        background.style.opacity = 1;
    }, 500);

    // Make the tutorialContainer visible after a few seconds
    setTimeout(() => {
        tutorialContainer.style.opacity = '1';
        tutorialContainer.style.visibility = 'visible';
    }, 3000);

});

/***
 * This function creates and shows slides for a pop-up based on input info.
 */
function createSlides(info) {
    const popupSlides = document.getElementById('popup-slides');
    popupSlides.innerHTML = '';
    currentSlides = JSON.parse(info);

    // Only show popup-nav if there is more than one slide
    const popupNav = document.querySelector('.popup-nav');
    if (currentSlides.length === 1) {
        popupNav.style.display = 'none';
    } else {
        popupNav.style.display = 'flex';
    }

    // Update popupSlides depending on content in slide
    currentSlides.forEach((slide, index) => {
        // Create popup-slide div
        const slideDiv = document.createElement('div');
        slideDiv.className = 'popup-slide';

        let slideContent = ``;

        if (slide.title) {
            slideContent += `<p class="popup-title">${slide.title}</p>`;
        } 

        if (slide.youtube_link) {
            slideContent += `
                <div class="popup-youtube-div">
                    <iframe 
                        src="${slide.youtube_link}" 
                        class="popup-youtube-iframe" 
                        allowfullscreen 
                        scrolling="no" 
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;">
                    </iframe>
                </div>
            `;
        }

        if (slide.spotify_link) {
            slideContent += `
                <div class="popup-spotify-div">
                    <iframe 
                        src="${slide.spotify_link}" 
                        class="popup-spotify-iframe" 
                        allowfullscreen 
                        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture">
                    </iframe>
                </div>
            `;
        }

        if (slide.link && slide.image) {
            slideContent += `
                <a class="popup-link" id="${slide.image_orientation}"href="${slide.link}" target="_blank">
                    <img class="popup-linked-image" id ="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
                </a>
            `;
        } else if (slide.image) {
            slideContent += `
                <img class="popup-image" id ="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
            `;
        }

        if (slide.text) {
            slideContent += `<p class="popup-text">${slide.text.replace(/\n/g, '<br>')}</p>`;
        }

        // Update slideDiv innerHTML to have slideContent
        slideDiv.innerHTML = slideContent;

        // Update popupSlides to have slideDev
        popupSlides.appendChild(slideDiv);
    });
    
    // Show first slide
    showSlide(0);
}

/***
 * This function shows a slide in the pop-up depending on input index.
 */
function showSlide(index) {
    const popupSlides = document.querySelectorAll('.popup-slide');
    popupSlides.forEach(slide => slide.classList.remove('active'));
    popupSlides[index].classList.add('active');
    currentSlide = index;
}

/***
 * This function creates slides and shows a pop-up for all objects when they are clicked.
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
 * This function closes the pop-up when the close button is clicked.
 */
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});

/***
 * This function navigates to the previous slide when the previous button is clicked.
 */
document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentSlide == 0) {
        showSlide(currentSlides.length - 1)
    } else if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
});

/***
 * This function navigates to the next slide when the next button is clicked.
 */
document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentSlide == currentSlides.length - 1) {
        showSlide(0)
    } else if (currentSlide < currentSlides.length - 1) {
        showSlide(currentSlide + 1);
    }
});

/***
 * This function plays the corresponding sound for an object when it is hovered over.
 */
const objects = document.querySelectorAll('.object');
objects.forEach((object) => {
    object.addEventListener('mouseenter', function () {
        const soundId = object.getAttribute('data-sound');

        if (soundId) {
            const sound = document.getElementById(soundId);

            // Adjust volume depending on the object
            if (soundId == "hover-sound-drawing") {
                sound.volume = 1;
            } else {
                sound.volume = 0.5;
            }
            
            // Play the sound
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        }
    });
});

/***
 * This function closes the pop-up when anywhere outside the pop-up is clicked.
 */
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');

    if (event.target !== popup && !popup.contains(event.target)) {
        popup.style.display = 'none';
    }
});

/***
 * This function closes the tutorial pop-up when the got it butotn is clicked.
 */
document.querySelector('.tutorial-got-it-btn').addEventListener('click', () => {
    const tutorialContainer = document.querySelector('.tutorial-container');
    tutorialContainer.style.display = 'none';
});

/***
 * This function makes the speech bubble visible or adjusts the light setting when hidden objects are clicked.
 */
document.querySelectorAll('.hidden-object').forEach(object => {
    object.addEventListener('click', (e) => {
        e.stopPropagation();

        const objectId = object.getAttribute('id');
        const speechBubble = document.querySelector('.speech-bubble');

        // Adjust position and make the speech bubble visible when the couch or light is clicked
        // Update light setting when the light is clicked
        if (objectId == "couch") {
            speechBubble.style.left = '54%'
            speechBubble.style.bottom = '36%'
        } else if (objectId == "clock") {
            speechBubble.style.left = '14%'
            speechBubble.style.bottom = '74%'
        } else if (objectId == "light") {
            updateLightSetting();
            return
        }

        speechBubble.style.visibility = 'visible';

        // Make the speechBubble disappear after a few seconds
        setTimeout(() => {
            speechBubble.style.visibility = 'hidden';
        }, 1250);
    });
});

/***
 * This function updates the light settting of the room.
 */
function updateLightSetting() {
    const videoSource = document.getElementById('video-source');
    const roomVideo = document.querySelector('.room-video');
    const background = document.querySelector('.background');
    const lightImageSource = document.getElementById('light-image-source');

    // Change background video and light image depending on current setting
    if (videoSource.src.includes('media/background-night.mp4')) {
        videoSource.src = 'media/background-day.mp4';
        lightImageSource.setAttribute('href', 'media/objects/light-day.png');
        background.style.background = 'white';
    } else if (videoSource.src.includes('media/background-day.mp4')) {
        videoSource.src = 'media/background-night.mp4';
        lightImageSource.setAttribute('href', 'media/objects/light-night.png');
        background.style.background = 'black';
    }                
    
    // Load and play the video
    roomVideo.load();
    roomVideo.play();
}
