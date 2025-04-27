/***
 * This script runs the interactive elements of My Room of Useless Projects.
 */

let currentSlide = 0;
let currentSlides = [];
let bouncingNextBtnOn = true;

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
    const splashImage = document.querySelector('#splash-enter-btn');
    setTimeout(() => {
        splashImage.classList.add('bounce-in');
    }, 500);
}

/***
 * This function adjusts the splash page dimensions depending on the viewport dimensions.
 */
// function adjustSplashPageElementDimensions() {
//     const splashImage = document.querySelector('#splash-enter-btn');
//     if (visualViewport.width < visualViewport.height) {
//         splashImage.style.width = '60%';
//         splashImage.style.height = 'auto';
//     } else {
//         splashImage.style.width = '35%'
//         splashImage.style.height = 'auto';
//     }
// }
// // Adjust splash page dimensions upon load and resize
// window.addEventListener('load', adjustSplashPageElementDimensions);
// window.addEventListener('resize', adjustSplashPageElementDimensions);    

/***
 * This function triggers the transition to the room when the 'Explore World' button is clicked.
 */
const splashImage = document.getElementById('splash-enter-btn');
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

function updateNavButtons(currentIndex, totalSlides) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Hide prev button on first slide
    prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';

    // Hide next button on last slide
    nextBtn.style.visibility = currentIndex === totalSlides - 1 ? 'hidden' : 'visible';
}

function createSlides(info) {
    const popupSlides = document.getElementById('popup-slides');
    popupSlides.innerHTML = '';
    currentSlides = JSON.parse(info);

    // Only show popup-nav if there is more than one slide
    const popupNav = document.querySelector('.popup-nav');
    const dotsContainer = document.getElementById('slide-dots');
    dotsContainer.innerHTML = ''; // clear previous dots

    if (currentSlides.length === 1) {
        popupNav.style.display = 'none';
        dotsContainer.style.display = 'none';
    } else {
        popupNav.style.display = 'flex';
        dotsContainer.style.display = 'flex';

        // Create a dot for each slide
        currentSlides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
    }

    // Create and append each slide
    currentSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'popup-slide';

        let slideContent = ``;


        if (slide.title) {
            slideContent += `<p class="popup-title">${slide.title}</p>`;
        } 

        if (slide.button) {
            slideContent += `<button onclick="toggleMessage(this)">${slide.button}</button>`
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
                <a class="popup-link" id="${slide.image_orientation}" href="${slide.link}" target="_blank">
                    <img class="popup-linked-image" id="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
                </a>
            `;
        } else if (slide.image) {
            slideContent += `
                <img class="popup-image" id="${slide.image_orientation}" src="${slide.image}" alt="Slide ${index + 1}">
            `;
        }

        if (slide.text) {
            slideContent += `<p class="popup-text">${slide.text.replace(/\n/g, '<br>')}</p>`;
        }

        slideDiv.innerHTML = slideContent;
        popupSlides.appendChild(slideDiv);
    });

    updatePopupTitlesAndText();

    // Show the first slide
    showSlide(0);
}

function updatePopupTitlesAndText() {
    const videoSource = document.getElementById('video-source');

    if (videoSource.src.includes('media/backgrounds/background.mp4')) {
        document.querySelectorAll('.popup-title').forEach(el => {
            el.style.color = 'black';
        });
        document.querySelectorAll('.popup-text').forEach(el => {
            el.style.color = 'black';
        });
    } if (videoSource.src.includes('media/backgrounds/background_night.mp4')) {
        document.querySelectorAll('.popup-title').forEach(el => {
            el.style.color = 'white';
        });
        document.querySelectorAll('.popup-text').forEach(el => {
            el.style.color = 'white';
        });
    }
}

function updateSlideDotColors() {
    const videoSource = document.getElementById('video-source');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const activeDot = document.querySelector('.slide-dots .dot.active');

    if (videoSource.src.includes('media/backgrounds/background.mp4')) {
        dots.forEach(dot => {
                dot.style.backgroundColor = 'white';
                dot.style.borderColor = '#333';
        });
        activeDot.style.backgroundColor = '#333'; // Active dot color for day
    } else if (videoSource.src.includes('media/backgrounds/background_night.mp4')) {
        dots.forEach(dot => {
            dot.style.backgroundColor = 'black';
            dot.style.borderColor = 'white';
        });
        activeDot.style.backgroundColor = 'white'; // Active dot color for night
    }
}

function toggleMessage(button) {
    const messages = [
        "Join or start a community around an interest of yours", 
        "Take an acting, public speaking, or improv class", 
        "Run a 5k, 10k, or half-marathon",
        "Learn how to draw",
        "Make a list of 5 things that feel the most terrifying to do, and do them this year",
        "Start a YouTube channel",
        "Learn how to play an instrument you've always wanted to play",
        "Cold email someone you admire and ask if you can interview them",
        "Make a comedy skit video",
        "Post on social media every day for 30 days",
        "Start a blog or newsletter",
        "Learn how to cook a dish you've always wanted to cook",
        "Start a business",
        "Volunteer for an org you believe in",
        "Start a podcast with friends",
        "Start a reading habit",
        "Build a personal website",
        "Learn a new sport you've always wanted to try",
        "Start growing fruits and vegetables",
        "Learn how to make sourdough from scratch",
        "Learn how to code",
        "Write a song",
        "Learn how to speak a language you've always wanted to learn",
        "Build something with your bare hands",
        "Learn photography",
        "Plan a solo trip",
        "Live without social media for a month",
        "Make a zine",
        "Host an event for friends",
        "Meditate every day for a month",
    ];
    let messageDiv = button.nextElementSibling;

  if (!messageDiv || !messageDiv.classList.contains('message')) {
    // First time: create message div and fade in
    messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.dataset.index = 0;
    messageDiv.textContent = messages[0];
    button.insertAdjacentElement('afterend', messageDiv);
    requestAnimationFrame(() => messageDiv.classList.add('visible'));
  } else {
    // Cycle to next message
    let currentIndex = parseInt(messageDiv.dataset.index, 10);
    let nextIndex = (currentIndex + 1) % messages.length;

    // Reset fade, update text, then fade in
    messageDiv.classList.remove('visible');

    setTimeout(() => {
      messageDiv.textContent = messages[nextIndex];
      messageDiv.dataset.index = nextIndex;
      // Trigger fade-in
      requestAnimationFrame(() => messageDiv.classList.add('visible'));
    }, 50); // Slight delay to allow class removal to take effect
  }
}

function showSlide(index) {
    const popupSlides = document.querySelectorAll('.popup-slide');
    const dots = document.querySelectorAll('#slide-dots .dot');

    popupSlides.forEach(slide => slide.classList.remove('active'));
    popupSlides[index].classList.add('active');

    if (dots.length) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    updateSlideDotColors();

    currentSlide = index;
    updateNavButtons(currentSlide, popupSlides.length);
}

function setupDotClickHandlers() {
    const dots = document.querySelectorAll('#slide-dots .dot');
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
        });
    });
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


function changeSlide(num) { 
    if (bouncingNextBtnOn) {
        bouncingNextBtnOn = false;
        document.querySelector('.next-btn').style.animation = 'none';
    }

    if (num === 0) {
        if (currentSlide == 0) {
            showSlide(currentSlides.length - 1)
        } else if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    } else if (num === 1) {
        if (currentSlide == currentSlides.length - 1) {
            showSlide(0)
        } else if (currentSlide < currentSlides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
}

/***
 * This function navigates to the previous slide when the previous button is clicked.
 */
document.querySelector('.prev-btn').addEventListener('click', () => {
    changeSlide(0)
});

/***
 * This function navigates to the next slide when the next button is clicked.
 */
document.querySelector('.next-btn').addEventListener('click', () => {
    changeSlide(1)
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        changeSlide(0)
    } else if (event.key === 'ArrowRight') {
        changeSlide(1)
    } else if (event.key === 'Escape') {
        closePopup()
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
            if (soundId === "hover-sound-notebook") {
                sound.volume = 0.8;
            } else if (soundId === "hover-sound-eggs") {
                sound.volume = 0.05;
            } else if (soundId === "hover-sound-figurine" || soundId === "hover-sound-poster" || soundId === "hover-sound-tv") {
                sound.volume = 0.1;
            } else {
                sound.volume = 0.3;
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
    closePopup()
});


function closePopup() {
    const popup = document.getElementById('popup');

    if (event.target !== popup && !popup.contains(event.target)) {
        popup.style.display = 'none';
    }
}

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
        if (objectId == "clock") {
            speechBubble.style.left = '12%'
            speechBubble.style.bottom = '74%'
        } else if (objectId == "map") {
            speechBubble.style.left = '82.8%'
            speechBubble.style.bottom = '65%'
        } else if (objectId == "trainers") {
            speechBubble.style.left = '71.5%'
            speechBubble.style.bottom = '8%'
        } else if (objectId == "berkeley-flag") {
            speechBubble.style.left = '28%'
            speechBubble.style.bottom = '66%'
        } else if (objectId == "light") {
            updateLightSetting();
            return
        } else if (objectId == "books") {
            speechBubble.style.left = '13%'
            speechBubble.style.bottom = '23%'
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
    const lightImgSrc = document.getElementById('light-img-src');
    const clockImgSrc = document.getElementById('clock-img-src');
    const berkeleyFlagImgSrc = document.getElementById('berkeley-flag-img-src');
    const mapImgSrc = document.getElementById('map-img-src');
    const trainersImgSrc = document.getElementById('trainers-img-src');
    const speechBubbleImgSrc = document.getElementById('speech-bubble-img-src');


    const popup = document.getElementById('popup');

    // Change background video and light image depending on current setting
    if (videoSource.src.includes('media/backgrounds/background_night.mp4')) {
        videoSource.src = 'media/backgrounds/background.mp4';
        lightImgSrc.setAttribute('href', 'media/objects/light.png');
        clockImgSrc.setAttribute('href', 'media/objects/clock.png');
        berkeleyFlagImgSrc.setAttribute('href', 'media/objects/berkeley_flag.png');
        mapImgSrc.setAttribute('href', 'media/objects/map.png');
        trainersImgSrc.setAttribute('href', 'media/objects/trainers.png');
        speechBubbleImgSrc.setAttribute('href', 'media/other/speech_bubble.png');


        background.style.background = 'white';
        document.documentElement.style.setProperty('--pointer-cursor', "url('media/icons/pointer.png'), auto");
        document.documentElement.style.setProperty('--regular-cursor', "url('media/icons/cursor.png'), auto");

        document.documentElement.style.setProperty('--link-color', '#0000ff'); // darker blue
        document.documentElement.style.setProperty('--link-visited-color', '#800080'); // darker purple

        updatePopupLightSetting(0);
        document.getElementById("easter-eggs").style.display = "none";
    } else if (videoSource.src.includes('media/backgrounds/background.mp4')) {
        videoSource.src = 'media/backgrounds/background_night.mp4';
        lightImgSrc.setAttribute('href', 'media/objects/light_night.png');
        clockImgSrc.setAttribute('href', 'media/objects/clock_night.png');
        berkeleyFlagImgSrc.setAttribute('href', 'media/objects/berkeley_flag_night.png');
        mapImgSrc.setAttribute('href', 'media/objects/map_night.png');
        trainersImgSrc.setAttribute('href', 'media/objects/trainers_night.png');
        speechBubbleImgSrc.setAttribute('href', 'media/other/speech_bubble_night.png');


        background.style.background = 'black';
        updatePopupLightSetting(1);
        document.getElementById("easter-eggs").style.display = "block";

        document.documentElement.style.setProperty('--link-color', '#7aa9ff'); // lighter blue
        document.documentElement.style.setProperty('--link-visited-color', '#c084fc'); // lighter purple

        document.documentElement.style.setProperty('--pointer-cursor', "url('media/icons/pointer_night.png'), auto");
        document.documentElement.style.setProperty('--regular-cursor', "url('media/icons/cursor_night.png'), auto");
    }                

    // Load and play the video
    roomVideo.load();
    roomVideo.play();
}

/***
 * This function updates the popup light settting.
 */

// popup-title
// popup-text
// popup indicators
function updatePopupLightSetting(num) {
    const popup = document.getElementById('popup');
    const prevBtnImg = document.querySelector('.nav-btn.prev-btn img');
    const nextBtnImg = document.querySelector('.nav-btn.next-btn img');
    const closeBtnImg = document.querySelector('.close-btn img');

    // Change background video and light image depending on current setting
    if (num === 0) {
        popup.style.backgroundColor = 'white';
        popup.style.color = 'black';
        prevBtnImg.src = 'media/icons/left_arrow.png';
        nextBtnImg.src = 'media/icons/right_arrow.png';
        closeBtnImg.src = 'media/icons/cross.png';
        document.querySelectorAll('.info-popup').forEach(el => {
            el.style.border = '1px solid #ddd';
            el.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.2)';
        });
    } else {
        popup.style.backgroundColor = 'black';
        popup.style.color = 'white';
        prevBtnImg.src = 'media/icons/left_arrow_night.png';
        nextBtnImg.src = 'media/icons/right_arrow_night.png';
        closeBtnImg.src = 'media/icons/cross_white.png';
        document.querySelectorAll('.info-popup').forEach(el => {
            el.style.border = '1px solid #444';
            el.style.boxShadow = '0 5px 25px rgba(255, 255, 255, 0.2)';
        });
    }
}

