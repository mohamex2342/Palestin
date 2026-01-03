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

// Load Heroes Data - 18 Heroes Updated
async function loadHeroesData() {
    heroesData = [
        { id: '1', name: 'ياسر عرفات', title: 'الختيار - رمز القضية', category: 'قائد', icon: 'fa-user-tie', birth_year: '1929', death_year: '2004', birthplace: 'القدس', biography: 'محمد ياسر عبد الرؤوف عرفات، مؤسس حركة فتح ورئيس منظمة التحرير الفلسطينية. قاد الكفاح المسلح لعقود وحصل على جائزة نوبل للسلام.', achievements: 'تأسيس حركة فتح، إعلان الاستقلال 1988، قيادة الثورة المعاصرة.', famous_quotes: 'جئتكم بغصن الزيتون في يدي وببندقية الثائر في الأخرى، فلا تسقطوا الغصن الأخضر من يدي.' },
        { id: '2', name: 'أحمد ياسين', title: 'الشيخ المقعد', category: 'قائد', icon: 'fa-wheelchair', birth_year: '1937', death_year: '2004', birthplace: 'الجورة - عسقلان', biography: 'مؤسس حركة حماس. رغم شلله الكامل، ألهم أجيالاً بالصمود. اغتيل برصاص مروحية عقب صلاة الفجر.', achievements: 'تأسيس حركة حماس وبناء منظومة اجتماعية وخيرية واسعة.', famous_quotes: 'إننا نحب الحياة، ولكننا لا نخشى الموت.' },
        { id: '3', name: 'يحيى السنوار', title: 'مهندس الطوفان', category: 'قائد', icon: 'fa-shield-halved', birth_year: '1962', death_year: '2024', birthplace: 'خانيونس', biography: 'قائد حماس في غزة، أمضى 22 عاماً في السجون. استشهد مشتبكاً ببدلته العسكرية في الميدان برفح.', achievements: 'قيادة معركة طوفان الأقصى وتطوير قدرات المقاومة العسكرية.', famous_quotes: 'سأخرج من السجن لأكمل مشواري.. والمقاومة هي السبيل.' },
        { id: '4', name: 'إسماعيل هنية', title: 'القائد الدبلوماسي', category: 'قائد', icon: 'fa-user-check', birth_year: '1962', death_year: '2024', birthplace: 'مخيم الشاطئ', biography: 'رئيس الوزراء الفلسطيني الأسبق ورئيس المكتب السياسي لحماس. اغتيل في طهران.', achievements: 'تعزيز الوحدة الوطنية وقيادة التحركات الدبلوماسية العالمية.', famous_quotes: 'لن نعترف بإسرائيل.. سقطت القلاع ولم تسقط القلوب.' },
        { id: '5', name: 'جورج حبش', title: 'الحكيم', category: 'قائد', icon: 'fa-user-nurse', birth_year: '1926', death_year: '2008', birthplace: 'اللد', biography: 'مؤسس الجبهة الشعبية لتحرير فلسطين ومنظّر القومية العربية.', achievements: 'تأسيس حركة القوميين العرب والجبهة الشعبية.', famous_quotes: 'إننا نريد تحرير الإنسان لا الأرض فقط.' },
        { id: '6', name: 'خالد مشعل', title: 'رئيس الحركة في الخارج', category: 'قائد', icon: 'fa-globe-asia', birth_year: '1956', death_year: 'حتى الآن', birthplace: 'سلواد', biography: 'شخصية قيادية بارزة نجا من محاولة اغتيال في الأردن عام 1997.', achievements: 'قيادة المكتب السياسي لسنوات طويلة وتعزيز العلاقات الدولية.', famous_quotes: 'حق العودة حق مقدس لا يقبل القسمة أو التفاوض.' },
        { id: '7', name: 'خليل الحية', title: 'كبير المفاوضين', category: 'قائد', icon: 'fa-users-viewfinder', birth_year: '1960', death_year: 'حتى الآن', birthplace: 'غزة', biography: 'نائب رئيس المكتب السياسي، نجا من عدة محاولات اغتيال وقدم عائلته شهداء.', achievements: 'قيادة وفود المفاوضات والعمل السياسي والميداني.', famous_quotes: 'دماء قادتنا هي الوقود الذي يشعل الثورة.' },
        { id: '8', name: 'عز الدين القسام', title: 'شيخ المجاهدين', category: 'مناضل', icon: 'fa-horse-head', birth_year: '1882', death_year: '1935', birthplace: 'جبلة - سوريا', biography: 'عالم مجاهد فجر الثورة المسلحة ضد الانتداب البريطاني في أحراش يعبد.', achievements: 'تأسيس العصبة القسامية والتمهيد للثورة الكبرى.', famous_quotes: 'إنه لجهاد، نصر أو استشهاد.' },
        { id: '9', name: 'أبو عبيدة', title: 'الملثم', category: 'مناضل', icon: 'fa-user-secret', birth_year: 'غير معروف', death_year: 'حتى الآن', birthplace: 'فلسطين', biography: 'الناطق العسكري لكتائب القسام، أصبح رمزاً إعلامياً عالمياً للمقاومة.', achievements: 'إدارة الحرب النفسية وتوجيه رسائل المقاومة للشعوب.', famous_quotes: 'بجهادنا نعبد الطريق للتحرير.' },
        { id: '10', name: 'دلال المغربي', title: 'عروس يافا', category: 'شهيد', icon: 'fa-star-of-david', birth_year: '1959', death_year: '1978', birthplace: 'بيروت', biography: 'قادت عملية كمال عدوان الفدائية وأسست "جمهورية فلسطين" لساعات.', achievements: 'تنفيذ أجرأ عملية إنزال في تاريخ الصراع.', famous_quotes: 'وصيتي لكم هي المقاومة حتى التحرير.' },
        { id: '11', name: 'محمد الدرة', title: 'أيقونة الطفولة', category: 'شهيد', icon: 'fa-child', birth_year: '1987', death_year: '2000', birthplace: 'مخيم البريج', biography: 'استشهد في حضن والده أمام كاميرات العالم، فكان شرارة الانتفاضة الثانية.', achievements: 'فضح وحشية الاحتلال أمام الرأي العام العالمي.', famous_quotes: 'استشهادك يا محمد كان صرخة في وجه الضمير النائم.' },
        { id: '12', name: 'عبد العزيز الرنتيسي', title: 'أسد فلسطين', category: 'شهيد', icon: 'fa-stethoscope', birth_year: '1947', death_year: '2004', birthplace: 'يبنا', biography: 'طبيب وقائد سياسي، خلف الشيخ ياسين في قيادة حماس قبل اغتياله.', achievements: 'بناء الوعي الثوري والقيادة الميدانية والشجاعة المنقطعة النظير.', famous_quotes: 'بالموت سننتصر.. سنموت شهداء.' },
        { id: '13', name: 'هديل الريماوي', title: 'الطفلة الشهيدة', category: 'شهيد', icon: 'fa-heart', birth_year: '2006', death_year: '2014', birthplace: 'رام الله', biography: 'رمز للبراءة التي يقتلها الاحتلال في كل عدوان.', achievements: 'تذكير العالم بحقوق أطفال فلسطين في الحياة.', famous_quotes: 'نامي يا هديل فالسماء أرحب.' },
        { id: '14', name: 'محمود درويش', title: 'شاعر الأرض', category: 'شاعر', icon: 'fa-feather-alt', birth_year: '1941', death_year: '2008', birthplace: 'البروة', biography: 'شاعر المقاومة الذي صاغ وثيقة الاستقلال ونقل المعاناة للعالمية.', achievements: 'تطوير الشعر العربي المعاصر ونشر الأدب الفلسطيني عالمياً.', famous_quotes: 'على هذه الأرض ما يستحق الحياة.' },
        { id: '15', name: 'غسان كنفاني', title: 'الأديب المناضل', category: 'شاعر', icon: 'fa-pen-nib', birth_year: '1936', death_year: '1972', birthplace: 'عكا', biography: 'كاتب وصحفي ربط الأدب بالثورة، اغتاله الموساد في بيروت.', achievements: 'روايات خالدة مثل رجال في الشمس وعائد إلى حيفا.', famous_quotes: 'لا تمت قبل أن تكون نداً.' },
        { id: '16', name: 'إبراهيم طوقان', title: 'شاعر الوطن', category: 'شاعر', icon: 'fa-music', birth_year: '1905', death_year: '1941', birthplace: 'نابلس', biography: 'صاحب النشيد الوطني "موطني"، شاعر الثورة في الثلاثينيات.', achievements: 'تأريخ النضال الفلسطيني المبكر بالقصيدة والموسيقى.', famous_quotes: 'موطني.. الجمال والجلال في رباك.' },
        { id: '17', name: 'فدوى طوقان', title: 'شاعرة فلسطين', category: 'شاعر', icon: 'fa-pen-fancy', birth_year: '1917', death_year: '2003', birthplace: 'نابلس', biography: 'من أهم شاعرات العرب في القرن العشرين، وثقت مشاعر الصمود.', achievements: 'تمثيل المرأة الفلسطينية في المحافل الأدبية الدولية.', famous_quotes: 'كفاني أموت عليها وأدفن فيها.' },
        { id: '18', name: 'ناجي العلي', title: 'رسام الكاريكاتير', category: 'شاعر', icon: 'fa-paint-brush', birth_year: '1938', death_year: '1987', birthplace: 'الشجرة', biography: 'مبدع شخصية "حنظلة" التي تدار ظهرها للعالم احتجاجاً، اغتيل في لندن.', achievements: 'استخدام الفن الساخر كسلاح سياسي وفضح المتخاذلين.', famous_quotes: 'حنظلة ولد في العاشرة ولن يكبر حتى نعود.' }
    ];
    displayHeroes(heroesData);
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
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
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
                ${hero.death_year && hero.death_year !== 'حتى الآن' ? `
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
                <div class="text-gray-700 leading-relaxed text-lg italic">
                    "${hero.famous_quotes}"
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeHeroModal() {
    const modal = document.getElementById('hero-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Load Stories Data - 11 Stories Updated
async function loadStoriesData() {
    storiesData = [
        { id: '1', title: 'مفتاح فاطمة', category: 'النكبة', year: '1948', location: 'دير ياسين', color: 'red', icon: 'fa-key', summary: 'قصة عائلة هُجرت من دير ياسين، ومفتاح البيت الذي بقي محفوظاً منذ 75 عاماً.', content: 'فاطمة كانت في السابعة عندما وقعت المجزرة. هربت العائلة ومعها المفتاح الحديدي للبيت. اليوم في مخيم قلنديا، لا تزال تروي لأحفادها كيف كان كرم الزيتون وحلم العودة.', impact: 'التمسك بحق العودة كحق مقدس لا يموت.' },
        { id: '2', title: 'حلم فريدة', category: 'النكبة', year: '1948', location: 'يافا', color: 'orange', icon: 'fa-suitcase-rolling', summary: 'رحلة تهجير طفلة من يافا الجميلة إلى مخيمات لبنان.', content: 'فريدة كانت تحب البحر، ولكن في عام النكبة أصبحت الأمواج تحمل سفن التهجير. قصة معاناتها في اللجوء وذاكرتها المليئة برائحة البرتقال اليافاوي.', impact: 'تجسيد مأساة الشتات الفلسطيني.' },
        { id: '3', title: 'طفل الحجارة', category: 'الانتفاضة', year: '1987', location: 'مخيم جباليا', color: 'green', icon: 'fa-hand-rock', summary: 'قصة أحمد الذي واجه الدبابات بالحجارة في الانتفاضة الأولى.', content: 'عندما دهست الشاحنة العمال، خرج أحمد ورفاقه. لم يكن يملك سوى حجارة أرضه لمواجهة فولاذ الدبابة. هكذا بدأت أسطورة أطفال الحجارة.', impact: 'المقاومة الشعبية قادرة على هز الضمير العالمي.' },
        { id: '4', title: 'طبيبة تحت الحصار', category: 'الحصار', year: '2007', location: 'غزة', color: 'blue', icon: 'fa-hospital', summary: 'الدكتورة نوران التي تعمل بأقل الإمكانيات لإنقاذ الأرواح.', content: 'بسبب الحصار، تفتقد المستشفيات لأبسط الأدوية. قصة يوسف الطفل الذي توفي في انتظار تصريح سفر للعلاج، ومعاناة الطواقم الطبية.', impact: 'فضح أثر الحصار اللاإنساني على المدنيين.' },
        { id: '5', title: 'بطل طوفان الأقصى', category: 'المقاومة', year: '2023', location: 'غلاف غزة', color: 'green', icon: 'fa-flag', summary: 'خالد المقاوم الذي عبر السياج لاسترداد الكرامة.', content: 'في فجر السابع من أكتوبر، كان خالد ضمن طلائع العبور. قصة إيمان المقاتل بقضيته ورغبته في كسر قيد حصار دام سنوات.', impact: 'إعادة القضية للصدارة العالمية.' },
        { id: '6', title: 'شهيد العز - هنية', category: 'المقاومة', year: '2024', location: 'طهران', color: 'red', icon: 'fa-user-tie', summary: 'اغتيال القائد إسماعيل هنية وتأثيره على المسيرة.', content: 'لم يكن مجرد قائد سياسي، بل كان صوتاً للاجئين والمحاصرين. قصة اغتياله والوداع المليوني الذي شهده العالم.', impact: 'القادة يموتون لكن الثورة تستمر.' },
        { id: '7', title: 'القائد الميداني - السنوار', category: 'المقاومة', year: '2024', location: 'رفح', color: 'green', icon: 'fa-shield', summary: 'استشهاد السنوار مشتبكاً في مقدمة الصفوف.', content: 'في معركة مباشرة فوق الأرض برفح، استشهد يحيى السنوار ببدلته العسكرية. صورة العصا التي واجه بها الدرون أصبحت أيقونة الصمود العالمي.', impact: 'ترسيخ صورة القائد المشتبك في ذاكرة الأجيال.' },
        { id: '8', title: 'صمود الفلاح', category: 'الصمود', year: '2002', location: 'نعلين', color: 'purple', icon: 'fa-tree', summary: 'الحاج عبد الله الذي حمى زيتونه من الجدار.', content: 'عندما بدأ بناء الجدار العازل، ربط الحاج عبد الله نفسه بشجرة زيتون عمرها مئات السنين. رفض التعويضات وصرخ: هذه الأرض قطعة من روحي.', impact: 'الأرض هي جوهر الصراع والارتباط بها عضوي.' },
        { id: '9', title: 'معلمة في الخيمة', category: 'الصمود', year: '2024', location: 'المواصي', color: 'orange', icon: 'fa-graduation-cap', summary: 'ليلى التي تدرّس الأطفال وسط الدمار والنزوح.', content: 'بين خيام النازحين، أنشأت ليلى فصلاً دراسياً على الرمال. تقول: التعليم سلاح، ولن نترك أطفالنا فريسة للجهل رغم الحرب.', impact: 'العلم مقاومة.' },
        { id: '10', title: 'عشرين عاماً في الأسر', category: 'الأسرى', year: '2005', location: 'سجن النقب', color: 'blue', icon: 'fa-bars', summary: 'قصة أحمد الأسير الذي قضى زهرة شبابه خلف القضبان.', content: 'عشرون عاماً لم يرَ فيها أحمد السماء بدون قضبان. قصة الرسائل المهربة وحلم احتضان والدته الذي لم يغب يوماً.', impact: 'قضية الأسرى جرح نازف في قلب كل بيت.' },
        { id: '11', title: 'أطفال الشاطئ', category: 'الحروب', year: '2014', location: 'شاطئ غزة', color: 'red', icon: 'fa-water', summary: 'مجزرة أطفال عائلة بكر الذين استهدفوا وهم يلعبون.', content: 'أربعة أطفال كانوا يلعبون الكرة على الرمل عندما قصفهم الزورق الحربي. جريمة شاهدها العالم بأسره وظلت وصمة عار في جبين الاحتلال.', impact: 'توثيق قتل البراءة المتعمد.' }
    ];
    displayStories(storiesData);
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
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
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

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Load Timeline Data - 16 Events Updated
async function loadTimelineData() {
    timelineData = [
        { title: 'وعد بلفور', date: '1917', description: 'رسالة بريطانية وعدت بإنشاء وطن قومي لليهود في فلسطين، وهي جذور المأساة.', icon: 'fa-file-signature', importance: 'عالية' },
        { title: 'ثورة 1936', date: '1936', description: 'أطول إضراب في التاريخ ضد الانتداب البريطاني والتهجير الصهيوني.', icon: 'fa-fist-raised', importance: 'عالية' },
        { title: 'قرار التقسيم 181', date: '1947', description: 'قرار الأمم المتحدة الجائر بتقسيم الأرض الذي رفضه الشعب الفلسطيني.', icon: 'fa-scissors', importance: 'عادية' },
        { title: 'مجزرة دير ياسين', date: '1948', description: 'مجزرة بشعة ارتكبتها العصابات الصهيونية لترهيب السكان وتهجيرهم.', icon: 'fa-skull', importance: 'عالية' },
        { title: 'النكبة', date: '1948', description: 'إعلان قيام دولة الاحتلال وتهجير 750 ألف فلسطيني وتدمير قراهم.', icon: 'fa-key', importance: 'عالية' },
        { title: 'انطلاق الثورة', date: '1965', description: 'تأسيس حركة فتح وانطلاق الكفاح المسلح المعاصر لاستعادة الأرض.', icon: 'fa-gun', importance: 'عالية' },
        { title: 'حرب يونيو/النكسة', date: '1967', description: 'احتلال إسرائيل لبقية فلسطين (الضفة، غزة، القدس) والجولان وسيناء.', icon: 'fa-map-marked', importance: 'عالية' },
        { title: 'معركة الكرامة', date: '1968', description: 'أول انتصار للفدائيين والجيش الأردني كسر أسطورة "الجيش الذي لا يقهر".', icon: 'fa-shield-heart', importance: 'عالية' },
        { title: 'الانتفاضة الأولى', date: '1987', description: 'انتفاضة الحجارة التي انطلقت من مخيم جباليا وهزت ضمير العالم.', icon: 'fa-users', importance: 'عالية' },
        { title: 'اتفاقيات أوسلو', date: '1993', description: 'توقيع اتفاق سلام أدى لإنشاء السلطة الوطنية الفلسطينية.', icon: 'fa-handshake', importance: 'عادية' },
        { title: 'الانتفاضة الثانية', date: '2000', description: 'انتفاضة الأقصى التي انطلقت عقب اقتحام شارون للمسجد الأقصى.', icon: 'fa-fire', importance: 'عالية' },
        { title: 'حرب لبنان', date: '2006', description: 'العدوان الإسرائيلي على لبنان وصمود المقاومة في وجه الآلة العسكرية.', icon: 'fa-bomb', importance: 'عادية' },
        { title: 'العدوان 2008-2009', date: '2008', description: 'حرب الفرقان، عدوان واسع على غزة استهدف البشر والشجر والحجر.', icon: 'fa-radiation', importance: 'عالية' },
        { title: 'عمود السحاب', date: '2012', description: 'مواجهة عسكرية اغتيل فيها الجعبري وردت فيها المقاومة بقوة.', icon: 'fa-cloud-bolt', importance: 'عادية' },
        { title: 'العدوان 2014', date: '2014', description: 'حرب العصف المأكول التي استمرت 51 يوماً من الصمود في غزة.', icon: 'fa-building-circle-xmark', importance: 'عالية' },
        { title: 'طوفان الأقصى', date: '2023', description: 'عملية عسكرية تاريخية للمقاومة رداً على الانتهاكات، غيرت موازين القوى.', icon: 'fa-water', importance: 'عالية' }
    ];
    displayTimeline(timelineData);
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
window.addEventListener('scroll', debounce(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-green-600', 'border-green-600');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-green-600', 'border-green-600');
        }
    });
}, 100));

// Utility function (Debounce)
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

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