// Swipe functionality for mobile birthday wish website
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const container = document.getElementById('container');

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Initialize
function init() {
    showSlide(0);
    setupEventListeners();
}

// Show specific slide
function showSlide(index) {
    // Ensure index is within bounds
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        
        if (i === index) {
            slide.classList.add('active');
        } else if (i < index) {
            slide.classList.add('prev');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
    
    // Hide swipe hint after first swipe
    if (index > 0) {
        const swipeHint = document.querySelector('.swipe-hint');
        if (swipeHint) {
            swipeHint.style.opacity = '0';
        }
    }
}

// Next slide
function nextSlide() {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Handle touch start
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

// Handle touch move (optional: add visual feedback)
function handleTouchMove(e) {
    // Prevent default scrolling
    const touchMoveY = e.touches[0].clientY;
    const deltaY = Math.abs(touchMoveY - touchStartY);
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
    
    // If horizontal swipe is more dominant, prevent vertical scroll
    if (deltaX > deltaY) {
        e.preventDefault();
    }
}

// Handle touch end
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    handleSwipe();
}

// Determine swipe direction
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            // Swipe right - go to previous slide
            prevSlide();
        } else {
            // Swipe left - go to next slide
            nextSlide();
        }
    }
}

// Handle keyboard navigation
function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
}

// Handle dot clicks
function handleDotClick(e) {
    const index = parseInt(e.target.dataset.index);
    if (!isNaN(index)) {
        showSlide(index);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Keyboard events (for desktop testing)
    document.addEventListener('keydown', handleKeyboard);
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', handleDotClick);
    });
    
    // Mouse swipe for desktop (optional)
    let mouseDown = false;
    let startX = 0;
    
    container.addEventListener('mousedown', (e) => {
        mouseDown = true;
        startX = e.clientX;
    });
    
    container.addEventListener('mouseup', (e) => {
        if (mouseDown) {
            const deltaX = e.clientX - startX;
            const minSwipeDistance = 100;
            
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
        mouseDown = false;
    });
    
    container.addEventListener('mouseleave', () => {
        mouseDown = false;
    });
}

// Auto-play option (optional - can be enabled)
function autoPlay() {
    setInterval(() => {
        if (currentSlide < slides.length - 1) {
            nextSlide();
        } else {
            showSlide(0); // Loop back to start
        }
    }, 5000); // Change slide every 5 seconds
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Optional: Uncomment to enable auto-play
// document.addEventListener('DOMContentLoaded', () => {
//     init();
//     autoPlay();
// });
