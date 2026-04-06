/**
 * 1. THEME TOGGLE
 */
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

if (themeToggle) {
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

/**
 * 2. ABOUT ME "READ MORE"
 */
const aboutText = document.getElementById('about-text');
const readMoreBtn = document.getElementById('read-more-btn');

if (readMoreBtn && aboutText) {
    readMoreBtn.addEventListener('click', () => {
        const isExpanded = aboutText.classList.contains('expanded');
        if (isExpanded) {
            aboutText.classList.remove('expanded');
            readMoreBtn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            aboutText.classList.add('expanded');
            readMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
        }
    });
}

/**
 * 3. HERO SLIDER
 */
let currentHeroSlide = 0;
let heroAutoPlay;

function moveHeroSlide(direction) {
    const slides = document.querySelectorAll('.hero-img');
    if (slides.length === 0) return;
    slides[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (currentHeroSlide + direction + slides.length) % slides.length;
    slides[currentHeroSlide].classList.add('active');
    
    clearInterval(heroAutoPlay);
    heroAutoPlay = setInterval(() => moveHeroSlide(1), 5000);
}
if (document.querySelectorAll('.hero-img').length > 0) {
    heroAutoPlay = setInterval(() => moveHeroSlide(1), 5000);
}

/**
 * 4. SUBWAY PHOTO GALLERY (Auto-Play)
 */
let galleryPos = 0;
let subwayAutoPlay = null;

function moveGalleryAuto() {
    const track = document.getElementById('subwayTrack');
    if (!track) return;
    const totalOriginals = track.querySelectorAll('.carousel-img:not(.clone)').length;
    galleryPos++;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${galleryPos * 34.9}%)`;

    if (galleryPos >= totalOriginals) {
        setTimeout(() => {
            track.style.transition = "none";
            galleryPos = 0;
            track.style.transform = `translateX(0)`;
        }, 500);
    }
}

function toggleGallery(btn) {
    const content = btn.nextElementSibling;
    const isActive = content.classList.toggle('active');
    btn.classList.toggle('active');

    if (isActive) {
        btn.innerHTML = 'Hide Project Photos <i class="fas fa-chevron-up"></i>';
        subwayAutoPlay = setInterval(moveGalleryAuto, 2000);
    } else {
        btn.innerHTML = 'View Project Photos <i class="fas fa-chevron-down"></i>';
        clearInterval(subwayAutoPlay);
    }
}

/**
 * 5. FEATURED PROJECTS SLIDER (Fixed to match changeProject)
 */
let projectIndex = 0;
function changeProject(direction) {
    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    cards[projectIndex].classList.remove('active');
    projectIndex = (projectIndex + direction + cards.length) % cards.length;
    cards[projectIndex].classList.add('active');
}

/**
 * 6. MILESTONES / CAREER JOURNEY (Auto-Generate Dots)
 */
const timelineWrapper = document.getElementById('timelineWrapper');
const dotsWrapper = document.getElementById('dotsWrapper');
let timelineIndex = 0;

function updateTimeline() {
    if (!timelineWrapper) return;
    const slides = document.querySelectorAll('.timeline-slide');
    const dots = document.querySelectorAll('.dot'); 
    
    // Move the slider
    timelineWrapper.style.transform = `translateX(-${timelineIndex * 100}%)`;
    
    // Update Arrow Opacity
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.style.opacity = timelineIndex === 0 ? '0.3' : '1';
    if (nextBtn) nextBtn.style.opacity = timelineIndex === slides.length - 1 ? '0.3' : '1';

    // Update Dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === timelineIndex);
    });
}

// Function to create dots based on number of slides
function initTimelineDots() {
    const slides = document.querySelectorAll('.timeline-slide');
    if (!dotsWrapper || slides.length === 0) return;

    dotsWrapper.innerHTML = ''; // Clear existing
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        // Make dots clickable
        dot.addEventListener('click', () => {
            timelineIndex = index;
            updateTimeline();
        });
        dotsWrapper.appendChild(dot);
    });
}

// Button Listeners
document.getElementById('nextBtn')?.addEventListener('click', () => {
    const slides = document.querySelectorAll('.timeline-slide');
    if (timelineIndex < slides.length - 1) { 
        timelineIndex++; 
        updateTimeline(); 
    }
});

document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (timelineIndex > 0) { 
        timelineIndex--; 
        updateTimeline(); 
    }
});

// Run initialization
document.addEventListener('DOMContentLoaded', () => {
    initTimelineDots();
    updateTimeline();
});

/**
 * 7. SKILLS TABS & SOFTWARE EXPANDABLE (Fixed for Re-click to Collapse)
 */
function toggleTab(evt, tabName) {
    const target = document.getElementById(tabName);
    if (!target) return;

    const isAlreadyActive = target.classList.contains('active');
    const allTabs = document.querySelectorAll('.tab-content');
    const allButtons = document.querySelectorAll('.bubble-btn');

    // 1. Always clear all other tabs/buttons first
    allTabs.forEach(content => {
        content.classList.remove('active');
        content.style.maxHeight = null; // Reset height
    });
    allButtons.forEach(btn => btn.classList.remove('active'));

    // 2. If it wasn't active, open it. 
    // If it WAS active, we leave it closed (achieving the collapse effect).
    if (!isAlreadyActive) {
        target.classList.add('active');
        evt.currentTarget.classList.add('active');
        
        // Optional: Smoothly scroll to the opened content if on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }
}

function toggleSoftwareList(event, element) {
    event.stopPropagation();
    
    // Check if the current card is already expanded
    const isExpanded = element.classList.contains('expanded');

    // Close other expanded cards in the same grid for a clean look
    const allCards = element.parentElement.querySelectorAll('.skill-card');
    allCards.forEach(card => card.classList.remove('expanded'));

    // Toggle current only if it wasn't already expanded
    if (!isExpanded) {
        element.classList.add('expanded');
    }
}

/**
 * 8. SCROLL EFFECTS & INITIALIZATION
 */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) scrollTopBtn.style.display = window.pageYOffset > 500 ? "block" : "none";
});
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('fade-in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Clone subway images on load
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('subwayTrack');
    if (track) {
        const originalImages = track.querySelectorAll('.carousel-img');
        originalImages.forEach((img, i) => {
            if (i < 3) {
                let clone = img.cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }
        });
    }
});
/**
/**
 * 9. FORMSPREE SUBMISSION (Silent & Error-Free)
 */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Stop page reload
        
        const btn = document.getElementById('submit-btn');
        const status = document.getElementById('form-status');
        const formData = new FormData(contactForm);

        // Visual feedback
        if (btn) {
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
        }

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                if (status) status.style.display = "inline-block";
                if (btn) btn.style.display = "none";
                contactForm.reset();
            } else {
                throw new Error('Formspree Error');
            }
        })
        .catch(error => {
            if (btn) {
                btn.innerHTML = 'Try Again';
                btn.disabled = false;
            }
            console.error("Submission Error:", error);
        });
    });
}