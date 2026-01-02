// Global variables
let heroesData = [];
let timelineData = [];
let storiesData = [];
let currentFilter = 'all';
let currentStoryFilter = 'all';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initStatsCounter();
    initNavbarScroll();
    loadHeroesData();
    loadTimelineData();
    loadStoriesData();
    initHeroFilters();
    initStoryFilters();
    initTimelineSearch();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
        });
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
    });
}

// Smooth Scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobile-nav');
                if (mobileNav && !mobileNav.classList.contains('hidden')) {
                    mobileNav.classList.add('hidden');
                }
            }
        });
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stats-counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Load Heroes Data from API
async function loadHeroesData() {
    try {
        const response = await fetch('tables/heroes?limit=100');
        const result = await response.json();
        heroesData = result.data;
        displayHeroes(heroesData);
    } catch (error) {
        console.error('Error loading heroes data:', error);
        document.getElementById('heroes-container').innerHTML = 
            '<p class="text-center text-red-600 col-span-full">حدث خطأ في تحميل بيانات الأبطال</p>';
    }
}

// Display Heroes
function displayHeroes(heroes) {
    const container = document.getElementById('heroes-container');
    
    if (!heroes || heroes.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600 col-span-full">لا توجد بيانات لعرضها</p>';
        return;
    }
    
    container.innerHTML = heroes.map(hero => `
        <div class="hero-card" onclick="showHeroModal('${hero.id}')">
            <div class="hero-card-header">
                <div class="flex items-center justify-between mb-3">
                    <i class="fas ${hero.icon} text-5xl"></i>
                    <span class="px-3 py-1 bg-white/20 rounded-full text-sm">${hero.category}</span>
                </div>
                <h3 class="text-2xl font-bold mb-1">${hero.name}</h3>
                <p class="text-green-100 text-lg">${hero.title}</p>
            </div>
            <div class="hero-card-body">
                <div class="flex items-center text-gray-600 mb-3">
                    <i class="fas fa-calendar ml-2"></i>
                    <span class="font-semibold">${hero.birth_year}${hero.death_year ? ' - ' + hero.death_year : ' - حتى الآن'}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-4">
                    <i class="fas fa-map-marker-alt ml-2"></i>
                    <span>${hero.birthplace}</span>
                </div>
                <div class="text-gray-700 line-clamp-3 leading-relaxed">
                    ${stripHtml(hero.biography).substring(0, 150)}...
                </div>
                <button class="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold">
                    <i class="fas fa-info-circle ml-2"></i>
                    المزيد عن ${hero.name}
                </button>
            </div>
        </div>
    `).join('');
}

// Strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Hero Filters
function initHeroFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter heroes
            const category = this.getAttribute('data-category');
            currentFilter = category;
            
            if (category === 'all') {
                displayHeroes(heroesData);
            } else {
                const filtered = heroesData.filter(hero => hero.category === category);
                displayHeroes(filtered);
            }
        });
    });
}

// Show Hero Modal
function showHeroModal(heroId) {
    const hero = heroesData.find(h => h.id === heroId);
    if (!hero) return;
    
    const modal = document.getElementById('hero-modal');
    const modalTitle = document.getElementById('modal-hero-title');
    const modalContent = document.getElementById('modal-hero-content');
    
    modalTitle.textContent = hero.name;
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-4 pb-4 border-b">
                <div class="flex items-center gap-3">
                    <i class="fas ${hero.icon} text-5xl text-green-600"></i>
                    <div>
                        <p class="text-sm text-gray-500">التصنيف</p>
                        <p class="font-semibold text-lg">${hero.category}</p>
                    </div>
                </div>
                <div>
                    <p class="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p class="font-semibold">${hero.birth_year}</p>
                </div>
                ${hero.death_year ? `
                <div>
                    <p class="text-sm text-gray-500">تاريخ الوفاة</p>
                    <p class="font-semibold">${hero.death_year}</p>
                </div>
                ` : ''}
                <div>
                    <p class="text-sm text-gray-500">مكان الميلاد</p>
                    <p class="font-semibold">${hero.birthplace}</p>
                </div>
            </div>
            
            <div>
                <h4 class="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-user ml-2 text-green-600"></i>
                    ${hero.title}
                </h4>
                <div class="text-gray-700 leading-relaxed text-lg">
                    ${hero.biography}
                </div>
            </div>
            
            ${hero.achievements ? `
            <div class="bg-green-50 p-6 rounded-xl">
                <h4 class="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-trophy ml-2 text-yellow-600"></i>
                    الإنجازات والمساهمات
                </h4>
                <div class="text-gray-700 leading-relaxed text-lg">
                    ${hero.achievements}
                </div>
            </div>
            ` : ''}
            
            ${hero.famous_quotes ? `
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-r-4 border-green-600">
                <h4 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-quote-right ml-2 text-green-600"></i>
                    أقوال وحكم مأثورة
                </h4>
                <div class="text-gray-700 leading-relaxed text-lg space-y-3">
                    ${hero.famous_quotes}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Hero Modal
function closeHeroModal() {
    const modal = document.getElementById('hero-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Load Stories Data
async function loadStoriesData() {
    try {
        const response = await fetch('tables/stories?limit=100&sort=-year');
        const result = await response.json();
        storiesData = result.data;
        displayStories(storiesData);
    } catch (error) {
        console.error('Error loading stories data:', error);
        document.getElementById('stories-container').innerHTML = 
            '<p class="text-center text-red-600">حدث خطأ في تحميل القصص</p>';
    }
}

// Display Stories
function displayStories(stories) {
    const container = document.getElementById('stories-container');
    
    if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">لا توجد قصص لعرضها</p>';
        return;
    }
    
    container.innerHTML = stories.map((story, index) => `
        <div class="story-card ${story.color}" style="animation-delay: ${index * 0.1}s" onclick="showStoryModal('${story.id}')">
            <div class="story-card-header bg-gradient-to-r from-${story.color}-600 to-${story.color}-700 cursor-pointer">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-3">
                            <i class="fas ${story.icon} text-4xl"></i>
                            <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">${story.category}</span>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold mb-2">${story.title}</h3>
                        <div class="flex flex-wrap items-center gap-4 text-${story.color}-50">
                            <span><i class="fas fa-calendar ml-1"></i> ${story.year}</span>
                            <span><i class="fas fa-map-marker-alt ml-1"></i> ${story.location}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="story-card-body">
                <p class="text-gray-700 text-lg leading-relaxed mb-4 line-clamp-4">
                    ${story.summary}
                </p>
                <button class="inline-flex items-center text-${story.color}-600 hover:text-${story.color}-700 font-semibold transition">
                    <span>اقرأ القصة كاملة</span>
                    <i class="fas fa-arrow-left mr-2"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Story Filters
function initStoryFilters() {
    const filterBtns = document.querySelectorAll('.story-filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter stories
            const filter = this.getAttribute('data-filter');
            currentStoryFilter = filter;
            
            if (filter === 'all') {
                displayStories(storiesData);
            } else {
                const filtered = storiesData.filter(story => story.category === filter);
                displayStories(filtered);
            }
        });
    });
}

// Show Story Modal
function showStoryModal(storyId) {
    const story = storiesData.find(s => s.id === storyId);
    if (!story) return;
    
    const modal = document.getElementById('story-modal');
    const modalTitle = document.getElementById('modal-story-title');
    const modalContent = document.getElementById('modal-story-content');
    
    modalTitle.textContent = story.title;
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-4 pb-4 border-b">
                <div class="flex items-center gap-3">
                    <i class="fas ${story.icon} text-5xl text-${story.color}-600"></i>
                    <div>
                        <p class="text-sm text-gray-500">الفئة</p>
                        <p class="font-semibold text-lg">${story.category}</p>
                    </div>
                </div>
                <div>
                    <p class="text-sm text-gray-500">السنة</p>
                    <p class="font-semibold">${story.year}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">المكان</p>
                    <p class="font-semibold">${story.location}</p>
                </div>
            </div>
            
            <div class="bg-${story.color}-50 p-6 rounded-xl border-r-4 border-${story.color}-600">
                <h4 class="text-2xl font-bold text-gray-800 mb-3">ملخص القصة</h4>
                <p class="text-gray-700 leading-relaxed text-lg">${story.summary}</p>
            </div>
            
            <div>
                <h4 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-book-open ml-2 text-${story.color}-600"></i>
                    القصة الكاملة
                </h4>
                <div class="text-gray-700 leading-loose text-lg space-y-4">
                    ${story.content}
                </div>
            </div>
            
            ${story.impact ? `
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <h4 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-lightbulb ml-2 text-yellow-600"></i>
                    التأثير والدروس المستفادة
                </h4>
                <div class="text-gray-700 leading-relaxed text-lg">
                    ${story.impact}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Story Modal
function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Load Timeline Data
async function loadTimelineData() {
    try {
        const response = await fetch('tables/timeline?limit=100&sort=-year');
        const result = await response.json();
        timelineData = result.data;
        displayTimeline(timelineData);
    } catch (error) {
        console.error('Error loading timeline data:', error);
        document.getElementById('timeline-container').innerHTML = 
            '<p class="text-center text-red-600">حدث خطأ في تحميل الأحداث التاريخية</p>';
    }
}

// Display Timeline
function displayTimeline(events) {
    const container = document.getElementById('timeline-container');
    
    if (!events || events.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">لا توجد أحداث لعرضها</p>';
        return;
    }
    
    container.innerHTML = events.map((event, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
            <div class="timeline-card">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                        <i class="fas ${event.icon} text-4xl text-green-600"></i>
                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800">${event.title}</h3>
                            <p class="text-green-600 font-semibold text-lg mt-1">${event.date}</p>
                        </div>
                    </div>
                    ${event.importance === 'عالية' ? 
                        '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold whitespace-nowrap">حدث مهم</span>' : 
                        '<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold whitespace-nowrap">حدث بارز</span>'
                    }
                </div>
                <div class="text-gray-700 leading-relaxed text-lg">
                    ${event.description}
                </div>
            </div>
        </div>
    `).join('');
}

// Timeline Search
function initTimelineSearch() {
    const searchInput = document.getElementById('timeline-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                displayTimeline(timelineData);
            } else {
                const filtered = timelineData.filter(event => 
                    event.title.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm) ||
                    event.date.toLowerCase().includes(searchTerm)
                );
                displayTimeline(filtered);
            }
        });
    }
}

// Active Navigation Link Highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-green-600', 'border-green-600');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-green-600', 'border-green-600');
        }
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const heroModal = document.getElementById('hero-modal');
    const storyModal = document.getElementById('story-modal');
    
    if (e.target === heroModal) {
        closeHeroModal();
    }
    
    if (e.target === storyModal) {
        closeStoryModal();
    }
});
