// --- 0. Sidebar Toggle Logic (فتح وإغلاق القائمة الجانبية يدوياً) ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// --- 1. Dark Mode Logic ---
const themeBtn = document.getElementById('theme-btn');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> الوضع الفاتح';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> الوضع الليلي';
    }
}

// --- 2. Navigation Logic (وعند الضغط على أي رابط يتم غلق القائمة تلقائياً على الموبايل) ---
const navLinks = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(item => item.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active-page'));
        
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active-page');

        // غلق القائمة تلقائياً على الشاشات الصغيرة عند التنقل بين الأقسام
        if (window.innerWidth <= 992) {
            toggleSidebar();
        }
    });
});

// --- 3. Religion Mode Toggle (Islam / Christianity) ---
const religionModeSelect = document.getElementById('religion-mode');
const islamicWorshipContent = document.getElementById('islamic-worship-content');
const christianWorshipContent = document.getElementById('christian-worship-content');

const savedReligion = localStorage.getItem('religionMode') || 'islam';
religionModeSelect.value = savedReligion;
updateWorshipView(savedReligion);

religionModeSelect.addEventListener('change', (e) => {
    const mode = e.target.value;
    localStorage.setItem('religionMode', mode);
    updateWorshipView(mode);
});

function updateWorshipView(mode) {
    if (mode === 'islam') {
        islamicWorshipContent.style.display = 'block';
        christianWorshipContent.style.display = 'none';
    } else {
        islamicWorshipContent.style.display = 'none';
        christianWorshipContent.style.display = 'block';
    }
}

// --- 4. Notifications & Background Alarms (منبه الويب الحقيقي) ---
const enableNotificationsBtn = document.getElementById('enable-notifications-btn');

enableNotificationsBtn.addEventListener('click', () => {
    if (!('Notification' in window)) {
        alert('متصفحك لا يدعم إشعارات سطح المكتب.');
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            alert('تم تفعيل إشعارات المنبه بنجاح! ستتلقين تذكيراً بالعبادات حتى لو كنتِ خارج التطبيق 🔔');
        } else {
            alert('تم رفض إذن الإشعارات. يرجى تفعيلها من إعدادات المتصفح.');
        }
    });
});

// مراقبة التوقيت وإطلاق التنبيهات في الخلفية
setInterval(() => {
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeString = `${currentHours}:${currentMinutes}`;

    const alarmInputs = [
        { id: 'alarm-fajr', name: 'صلاة الفجر 🌙' },
        { id: 'alarm-dhuhr', name: 'صلاة الظهر ☀️' },
        { id: 'alarm-asr', name: 'صلاة العصر 🌤️' },
        { id: 'alarm-maghrib', name: 'صلاة المغرب 🌅' },
        { id: 'alarm-isha', name: 'صلاة العشاء 🌙' },
        { id: 'alarm-quran', name: 'ورد القرآن الكريم 📖' },
        { id: 'alarm-adhkar', name: 'أذكار الصباح/المساء 📿' },
        { id: 'alarm-quiet', name: 'وقت صلاة الهدوء ⛪' },
        { id: 'alarm-thanks', name: 'صلاة الشكر 🕊️' },
        { id: 'alarm-bible', name: 'قراءة الإنجيل اليومي 📖' }
    ];

    alarmInputs.forEach(item => {
        const inputElement = document.getElementById(item.id);
        if (inputElement && inputElement.value === currentTimeString) {
            const lastTriggered = localStorage.getItem(`alert_${item.id}`);
            if (lastTriggered !== currentTimeString) {
                localStorage.setItem(`alert_${item.id}`, currentTimeString);
                new Notification('منبه الروتين الروحي ⏰', {
                    body: `حان الآن موعد: ${item.name}`,
                    icon: 'https://cdn-icons-png.flaticon.com/512/3236/3236940.png'
                });
            }
        }
    });
}, 10000);

// --- 5. Routine Checkboxes LocalStorage ---
const routineCheckboxes = document.querySelectorAll('.routine-chk');
routineCheckboxes.forEach((chk, index) => {
    const savedState = localStorage.getItem(`routine_${index}`);
    if (savedState === 'true') chk.checked = true;

    chk.addEventListener('change', () => {
        localStorage.setItem(`routine_${index}`, chk.checked);
    });
});

// --- 6. Tasks Management & Achievement Notes ---
const taskModal = document.getElementById('task-modal');
const openTaskModalBtn = document.getElementById('open-task-modal');
const closeTaskModalBtn = document.getElementById('close-task-modal');
const taskForm = document.getElementById('task-form');
const tasksGrid = document.getElementById('tasks-grid');

const achievementModal = document.getElementById('achievement-modal');
const closeAchievementModalBtn = document.getElementById('close-achievement-modal');
const achievementForm = document.getElementById('achievement-form');
const achievementNotesInput = document.getElementById('achievement-notes-input');
const achievementTaskTitle = document.getElementById('achievement-task-title');
let currentActiveTaskId = null;

openTaskModalBtn.addEventListener('click', () => taskModal.style.display = 'flex');
closeTaskModalBtn.addEventListener('click', () => taskModal.style.display = 'none');
closeAchievementModalBtn.addEventListener('click', () => achievementModal.style.display = 'none');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskDate = document.getElementById('task-date').value;
    const todayDate = new Date().toISOString().split('T')[0];

    if (taskDate < todayDate) {
        alert('عذراً، لا يمكن اختيار تاريخ في الماضي!');
        return;
    }

    const newTask = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        date: taskDate,
        achievement: 'لم يتم تسجيل الملاحظات بعد',
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskModal.style.display = 'none';
    taskForm.reset();
    loadTasks();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksGrid.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksGrid.innerHTML = '<p class="empty-msg" style="grid-column: 1/-1; text-align:center; color:#888;">لا توجد مهام مضافة اليوم.</p>';
        updateDashboardStats();
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div>
                <h3 class="${task.completed ? 'task-done' : ''}">${task.title}</h3>
                <p><i class="fa-solid fa-calendar"></i> الميعاد: ${task.date}</p>
                <p style="margin-top:8px; background:var(--bg-color); padding:8px; border-radius:6px; font-size:0.9rem;"><strong>الملاحظات:</strong> ${task.achievement}</p>
            </div>
            <div class="card-actions">
                <button onclick="toggleTask(${task.id})" class="edit-btn"><i class="fa-solid fa-check"></i> ${task.completed ? 'إلغاء الإنجاز' : 'تم الإنجاز'}</button>
                <button onclick="openAchievementModal(${task.id}, '${task.title}')" class="note-btn"><i class="fa-solid fa-pen-to-square"></i> تسجيل الملاحظات</button>
                <button onclick="deleteTask(${task.id})" class="delete-btn"><i class="fa-solid fa-trash"></i> حذف</button>
            </div>
        `;
        tasksGrid.appendChild(card);
    });
    updateDashboardStats();
}

function toggleTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function openAchievementModal(id, title) {
    currentActiveTaskId = id;
    achievementTaskTitle.innerText = `المهمة: ${title}`;
    achievementNotesInput.value = '';
    achievementModal.style.display = 'flex';
}

achievementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const notes = achievementNotesInput.value;
    if (!notes.trim()) return;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(t => t.id === currentActiveTaskId ? {...t, achievement: notes, completed: true} : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    achievementModal.style.display = 'none';
    loadTasks();
    alert('تم حفظ ملاحظات الإنجاز بنجاح ✨');
});

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// --- 7. Focus Stopwatch ---
let stopwatchInterval;
let secondsElapsed = 0;
const timerDisplay = document.getElementById('timer-display');

function updateStopwatchDisplay() {
    const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    timerDisplay.innerText = `${hrs}:${mins}:${secs}`;
}

document.getElementById('start-timer-btn').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = setInterval(() => {
        secondsElapsed++;
        updateStopwatchDisplay();
    }, 1000);
});

document.getElementById('pause-timer-btn').addEventListener('click', () => clearInterval(stopwatchInterval));
document.getElementById('reset-timer-btn').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    secondsElapsed = 0;
    updateStopwatchDisplay();
});

// --- 8. Extras Features (Brain Dump, Water Counter, Challenges) ---
const saveBrainDumpBtn = document.getElementById('save-braindump-btn');
const brainDumpInput = document.getElementById('brain-dump-input');
const savedBrainDump = localStorage.getItem('brainDump');
if (savedBrainDump) brainDumpInput.value = savedBrainDump;

saveBrainDumpBtn.addEventListener('click', () => {
    localStorage.setItem('brainDump', brainDumpInput.value);
    alert('تم حفظ أفكارك بنجاح لتصفية ذهنك ✨');
});

let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
const waterCounterDisplay = document.getElementById('water-counter-display');
updateWaterDisplay();

document.getElementById('add-water-btn').addEventListener('click', () => {
    if (waterCount < 8) {
        waterCount++;
        localStorage.setItem('waterCount', waterCount);
        updateWaterDisplay();
    } else {
        alert('رائع جداً! لقد أكملتِ الهدف اليومي من الماء 💧');
    }
});

document.getElementById('reset-water-btn').addEventListener('click', () => {
    waterCount = 0;
    localStorage.setItem('waterCount', waterCount);
    updateWaterDisplay();
});

function updateWaterDisplay() {
    waterCounterDisplay.innerText = `${waterCount} / 8 أكواب`;
}

const challenges = [
    "ابتعدي عن الشاشات لمدة نصف ساعة كاملة واقضِ وقتاً هادئاً.",
    "قومي بترتيب وتغيير مكان شيء واحد في غرفتك لإنعاش الطاقة.",
    "كتبي 3 نعم تشكرين الله عليها اليوم بقلب صادق.",
    "تواصلي مع شخص عزيز وطمنينا عليه بكلمة طيبة.",
    "امشي لمدة 15 دقيقة في الهواء الطلق لتصفية ذهنك."
];

document.getElementById('new-challenge-btn').addEventListener('click', () => {
    const randomCh = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById('daily-challenge-text').innerText = `"${randomCh}"`;
});

// --- 9. Advanced Features (Mood, Gratitude, Budget & Expenses) ---
const moodBtns = document.querySelectorAll('.mood-btn');
const currentMoodDisplay = document.getElementById('current-mood-display');
const savedMood = localStorage.getItem('dailyMood');
if (savedMood) currentMoodDisplay.innerText = savedMood;

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        localStorage.setItem('dailyMood', mood);
        currentMoodDisplay.innerText = mood;
        alert(`تم تسجيل مزاجك: ${mood} ✨`);
    });
});

const saveGratitudeBtn = document.getElementById('save-gratitude-btn');
const gratitudeInput = document.getElementById('gratitude-input');
const savedGratitude = localStorage.getItem('gratitudeNotes');
if (savedGratitude) gratitudeInput.value = savedGratitude;

saveGratitudeBtn.addEventListener('click', () => {
    localStorage.setItem('gratitudeNotes', gratitudeInput.value);
    alert('تم حفظ مذكرات الامتنان بنجاح 🤍');
});

const expenseForm = document.getElementById('expense-form');
const totalExpensesDisplay = document.getElementById('total-expenses');
const remainingBudgetDisplay = document.getElementById('remaining-budget');
const monthlyBudgetInput = document.getElementById('monthly-budget-input');
const saveBudgetBtn = document.getElementById('save-budget-btn');
const resetBudgetBtn = document.getElementById('reset-budget-btn');

let expenses = JSON.parse(localStorage.getItem('expensesList')) || [];
let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;

if (monthlyBudget > 0) {
    monthlyBudgetInput.value = monthlyBudget;
}
updateExpensesUI();

saveBudgetBtn.addEventListener('click', () => {
    const val = parseFloat(monthlyBudgetInput.value);
    if (isNaN(val) || val <= 0) {
        alert('يرجى إدخال مبلغ صحيح للميزانية الشهرية.');
        return;
    }
    monthlyBudget = val;
    localStorage.setItem('monthlyBudget', monthlyBudget);
    updateExpensesUI();
    alert('تم حفظ الميزانية الشهرية بنجاح 🎯');
});

resetBudgetBtn.addEventListener('click', () => {
    if (confirm('هل أنتِ متأكدة من تصفير وحذف جميع المصاريف والميزانية المسجلة؟')) {
        localStorage.removeItem('expensesList');
        localStorage.removeItem('monthlyBudget');
        expenses = [];
        monthlyBudget = 0;
        monthlyBudgetInput.value = '';
        updateExpensesUI();
        alert('تم تصفير الميزانية والمصاريف بنجاح 🔄');
    }
});

const quickExpenseBtns = document.querySelectorAll('.quick-expense-btn');
quickExpenseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const amount = parseFloat(btn.getAttribute('data-amount'));

        expenses.push({ title, amount });
        localStorage.setItem('expensesList', JSON.stringify(expenses));
        updateExpensesUI();
        alert(`تم إضافة (${title}) بقيمة ${amount} جنيه بنجاح 💳`);
    });
});

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    expenses.push({ title, amount });
    localStorage.setItem('expensesList', JSON.stringify(expenses));
    updateExpensesUI();
    expenseForm.reset();
    alert('تم تسجيل المصروف بنجاح 💳');
});

function updateExpensesUI() {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    totalExpensesDisplay.innerText = `${total} جنيه`;

    if (monthlyBudget > 0) {
        const remaining = monthlyBudget - total;
        remainingBudgetDisplay.innerText = `${remaining} جنيه`;
        
        if (remaining < 0) {
            remainingBudgetDisplay.style.color = '#ef4444';
            remainingBudgetDisplay.innerText += ' (تجاوزتِ الميزانية! ⚠️)';
        } else {
            remainingBudgetDisplay.style.color = '#10b981';
        }
    } else {
        remainingBudgetDisplay.innerText = 'غير محددة';
    }
}

// --- 10. Motivation Quotes, Badges & Streak ---
const quotes = [
    "“عظمة بداياتك تكمن في استمرارك وثباتك، لا تتقاعس فكل خطوة تقربك لحلمك.”",
    "“لا تقارن نفسك بأحد، سر بخطواتك الثابتة نحو أهدافك وسترى النتيجة تذهلك.”",
    "“كل دقيقة تقضيها في السعي والتركيز هي استثمار حقيقي في مستقبلك.”",
    "“اعمل بصمت، واجعل إنجازاتك ونجاحك هما من يتحدثان عنك.”",
    "“النجاح ليس تصادُفاً، بل هو ثمرة التعب، الصبر، والاستمرار كل يوم.”"
];

document.getElementById('change-quote-btn').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('motivation-quote').innerText = quotes[randomIndex];
});

const logStudyBtn = document.getElementById('log-study-btn');
const resetStreakBtn = document.getElementById('reset-streak-btn');

logStudyBtn.addEventListener('click', () => {
    let streakData = JSON.parse(localStorage.getItem('streak')) || { days: 0, lastDate: '' };
    const today = new Date().toISOString().split('T')[0];

    if (streakData.lastDate === today) {
        alert('لقد قمتِ بتسجيل إنجاز اليوم بالفعل، استمري هكذا دائماً! 🔥');
    } else {
        streakData.days += 1;
        streakData.lastDate = today;
        localStorage.setItem('streak', JSON.stringify(streakData));
        loadStreak();
        alert('عاش جداً! تم زيادة الـ Streak بنجاح 🔥');
    }
});

resetStreakBtn.addEventListener('click', () => {
    if (confirm('هل أنتِ متأكدة من تصفير الـ Streak؟')) {
        localStorage.removeItem('streak');
        loadStreak();
        alert('تم تصفير الـ Streak بنجاح.');
    }
});

function loadStreak() {
    const streakData = JSON.parse(localStorage.getItem('streak')) || { days: 0 };
    document.getElementById('streak-days').innerText = `${streakData.days} أيام`;
    document.getElementById('home-streak-days').innerText = `${streakData.days} أيام`;

    let badge = "مبتدئة نشيطة 🌱";
    if (streakData.days >= 3) badge = "منتظمة مجتهدة ⭐";
    if (streakData.days >= 7) badge = "ملكة التنظيم والإنجاز 👑";
    if (streakData.days >= 15) badge = "أسطورة الإنتاجية والتركيز 🏆";

    document.getElementById('home-badge-title').innerText = badge;
    document.getElementById('badge-display-title').innerText = badge;
}

const saveReviewBtn = document.getElementById('save-review-btn');
const dailyReviewText = document.getElementById('daily-review-text');

saveReviewBtn.addEventListener('click', () => {
    .trim() === ''
    const review = dailyReviewText.value;
    if (review.trim() === '') {
        alert('يرجى كتابة تقييمك أولاً!');
        return;
    }
    localStorage.setItem('dailyReview', review);
    alert('تم حفظ تقييم اليوم بنجاح ✨');
});

const savedReview = localStorage.getItem('dailyReview');
if (savedReview) dailyReviewText.value = savedReview;

function updateDashboardStats() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    document.getElementById('completed-tasks-count').innerText = completedTasks;
}

// Initial Load
loadTasks();
loadStreak();
updateStopwatchDisplay();