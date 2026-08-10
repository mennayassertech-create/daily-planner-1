// --- التحكم في القائمة الجانبية (Sidebar) والتنقل بين الأقسام ---
const navLinks = document.querySelectorAll('.nav-links li');
const pageSections = document.querySelectorAll('.page-section');

navLinks.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        pageSections.forEach(s => s.classList.remove('active-page'));
        
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if(targetSection) targetSection.classList.add('active-page');

        // إغلاق القائمة الجانبية تلقائياً في الجوال عند الاختيار
        if(window.innerWidth <= 768) {
            toggleSidebar();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// --- التحكم في القائمة الجانبية (Sidebar) فتحاً وغلقاً ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}



// --- الوضع الليلي / النهاري ---
const themeBtn = document.getElementById('theme-btn');
const htmlTag = document.documentElement;

const savedTheme = localStorage.getItem('planner_theme') || 'light';
htmlTag.setAttribute('data-theme', savedTheme);
if(themeBtn) updateThemeButton(savedTheme);

if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        let currentTheme = htmlTag.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlTag.setAttribute('data-theme', newTheme);
        localStorage.setItem('planner_theme', newTheme);
        updateThemeButton(newTheme);
    });
}

function updateThemeButton(theme) {
    if(theme === 'dark') {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> الوضع النهاري';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> الوضع الليلي';
    }
}

// --- النظام الديني (إسلامي / مسيحي) ---
const religionModeSelect = document.getElementById('religion-mode');
const islamicBlock = document.getElementById('islamic-worship-content');
const christianBlock = document.getElementById('christian-worship-content');

const savedReligion = localStorage.getItem('planner_religion') || 'islam';
if(religionModeSelect) {
    religionModeSelect.value = savedReligion;
    updateReligionView(savedReligion);

    religionModeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        localStorage.setItem('planner_religion', val);
        updateReligionView(val);
    });
}

function updateReligionView(mode) {
    if(islamicBlock && christianBlock) {
        if(mode === 'islam') {
            islamicBlock.style.display = 'block';
            christianBlock.style.display = 'none';
        } else {
            islamicBlock.style.display = 'none';
            christianBlock.style.display = 'block';
        }
    }
}

// --- المهام اليومية (Tasks) ---
let tasks = JSON.parse(localStorage.getItem('planner_tasks')) || [];
const taskModal = document.getElementById('taskModal');
const openTaskModalBtn = document.getElementById('open-task-modal');
const closeTaskModalBtn = document.getElementById('close-task-modal');
const taskForm = document.getElementById('task-form');

if(openTaskModalBtn) openTaskModalBtn.addEventListener('click', () => taskModal.style.display = 'flex');
if(closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', () => taskModal.style.display = 'none');

if(taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title-input').value;
        const desc = document.getElementById('task-desc-input').value;
        
        tasks.push({ id: Date.now(), title, desc, completed: false });
        saveAndRenderTasks();
        
        document.getElementById('task-title-input').value = '';
        document.getElementById('task-desc-input').value = '';
        taskModal.style.display = 'none';
    });
}

function saveAndRenderTasks() {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

function renderTasks() {
    const grid = document.getElementById('tasks-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    if(tasks.length === 0) {
        grid.innerHTML = '<p style="color:#888; padding:10px;">لا توجد مهام مضافة حالياً. ابدئي بإضافة مهمة جديدة!</p>';
        return;
    }
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.borderRight = task.completed ? '4px solid #10b981' : '4px solid var(--primary-color)';
        card.style.marginBottom = '10px';
        card.innerHTML = `
            <h3 style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.title}</h3>
            <p style="font-size:0.85rem; color:#888; margin-bottom:12px;">${task.desc || 'بدون تفاصيل'}</p>
            <div style="display:flex; gap:8px;">
                <button onclick="toggleTask(${task.id})" class="add-btn" style="padding:5px 10px; font-size:0.8rem; background:${task.completed ? '#64748b' : '#10b981'}">${task.completed ? 'إلغاء الإنجاز' : 'تم الإنجاز'}</button>
                <button onclick="deleteTask(${task.id})" class="delete-btn" style="padding:5px 10px; font-size:0.8rem;">حذف</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRenderTasks();
};

window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRenderTasks();
 };

// --- حفظ واسترجاع مربعات الاختيار للروتين والعبادات ---
const checkboxes = document.querySelectorAll('.routine-chk');
checkboxes.forEach((chk, index) => {
    const savedState = localStorage.getItem('routine_chk_' + index);
    if(savedState === 'true') chk.checked = true;

    chk.addEventListener('change', () => {
        localStorage.setItem('routine_chk_' + index, chk.checked);
        updateStats();
    });
});

// --- الإحصائيات وشارات الإنجاز ---
function updateStats() {
    const completedTasks = tasks.filter(t => t.completed).length;
    let completedCheckboxes = 0;
    checkboxes.forEach(chk => { if(chk.checked) completedCheckboxes++; });

    const totalDone = completedTasks + completedCheckboxes;
    
    const tasksCountEl = document.getElementById('completed-tasks-count');
    if(tasksCountEl) tasksCountEl.innerText = totalDone;

    let streakDays = parseInt(localStorage.getItem('planner_streak') || '1');
    const streakDaysEl = document.getElementById('home-streak-days');
    if(streakDaysEl) streakDaysEl.innerText = streakDays + ' أيام';
    
    let badge = 'مبتدئة نشيطة 🌱';
    if(totalDone > 5) badge = 'مستمرة متألقة ⭐';
    if(totalDone > 15) badge = 'محترفة الإنتاجية 🏆';
    
    const badgeTitleEl = document.getElementById('home-badge-title');
    if(badgeTitleEl) badgeTitleEl.innerText = badge;
}

// --- التايمر التصاعدي ---
let timerInterval = null;
let secondsElapsed = 0;
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer-btn');
const pauseTimerBtn = document.getElementById('pause-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');

if(startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
        if(timerInterval) return;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerDisplay();
        }, 1000);
    });
}

if(pauseTimerBtn) {
    pauseTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });
}

if(resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        secondsElapsed = 0;
        updateTimerDisplay();
    });
}

function updateTimerDisplay() {
    if(!timerDisplay) return;
    const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    timerDisplay.innerText = `${hrs}:${mins}:${secs}`;
}

// --- متتبع الماء ---
let waterCount = parseInt(localStorage.getItem('planner_water') || '0');
const waterDisplay = document.getElementById('water-counter-display');
const addWaterBtn = document.getElementById('add-water-btn');
const resetWaterBtn = document.getElementById('reset-water-btn');

if(waterDisplay) waterDisplay.innerText = `${waterCount} / 8 أكواب`;

if(addWaterBtn) {
    addWaterBtn.addEventListener('click', () => {
        if(waterCount < 8) {
            waterCount++;
            localStorage.setItem('planner_water', waterCount);
            if(waterDisplay) waterDisplay.innerText = `${waterCount} / 8 أكواب`;
        }
    });
}

if(resetWaterBtn) {
    resetWaterBtn.addEventListener('click', () => {
        waterCount = 0;
        localStorage.setItem('planner_water', waterCount);
        if(waterDisplay) waterDisplay.innerText = `${waterCount} / 8 أكواب`;
    });
}

// --- الأفكار (Brain Dump) والامتنان والتقييم ---
const brainDumpInput = document.getElementById('brain-dump-input');
const saveBraindumpBtn = document.getElementById('save-braindump-btn');
if(brainDumpInput && saveBraindumpBtn) {
    brainDumpInput.value = localStorage.getItem('planner_braindump') || '';
    saveBraindumpBtn.addEventListener('click', () => {
        localStorage.setItem('planner_braindump', brainDumpInput.value);
        alert('تم حفظ الأفكار بنجاح!');
    });
}

const gratitudeInput = document.getElementById('gratitude-input');
const saveGratitudeBtn = document.getElementById('save-gratitude-btn');
if(gratitudeInput && saveGratitudeBtn) {
    gratitudeInput.value = localStorage.getItem('planner_gratitude') || '';
    saveGratitudeBtn.addEventListener('click', () => {
        localStorage.setItem('planner_gratitude', gratitudeInput.value);
        alert('تم حفظ مذكرات الامتنان بنجاح!');
    });
}

const dailyReviewText = document.getElementById('daily-review-text');
const saveReviewBtn = document.getElementById('save-review-btn');
if(dailyReviewText && saveReviewBtn) {
    dailyReviewText.value = localStorage.getItem('planner_review') || '';
    saveReviewBtn.addEventListener('click', () => {
        localStorage.setItem('planner_review', dailyReviewText.value);
        alert('تم حفظ تقييم اليوم بنجاح!');
    });
}

// --- مؤشر المزاج وتحدي السعادة ---
const moodButtons = document.querySelectorAll('.mood-btn');
const currentMoodDisplay = document.getElementById('current-mood-display');
const savedMood = localStorage.getItem('planner_mood') || 'لم يُحدد بعد';
if(currentMoodDisplay) currentMoodDisplay.innerText = savedMood;

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        localStorage.setItem('planner_mood', mood);
        if(currentMoodDisplay) currentMoodDisplay.innerText = mood;
    });
});

const challenges = [
    "ابتعدي عن الشاشات لمدة نصف ساعة كاملة واقضِ وقتاً هادئاً.",
    "تواصلي مع صديقة مقربة أو فرد من العائلة واطمئني عليه.",
    "رتبي زاوية صغيرة من مكتبك أو غرفتك لإضفاء طاقة إيجابية.",
    "استمعي إلى مقطع صوتي تحفيزي أو تلاوة هادئة لمدة 10 دقائق."
];
const challengeText = document.getElementById('daily-challenge-text');
const newChallengeBtn = document.getElementById('new-challenge-btn');
if(newChallengeBtn && challengeText) {
    newChallengeBtn.addEventListener('click', () => {
        const randomCh = challenges[Math.floor(Math.random() * challenges.length)];
        challengeText.innerText = `"${randomCh}"`;
    });
}

// --- تتبع المصاريف والميزانية ---
let monthlyBudget = parseFloat(localStorage.getItem('planner_budget') || '0');
let expenses = JSON.parse(localStorage.getItem('planner_expenses')) || [];

const monthlyBudgetInput = document.getElementById('monthly-budget-input');
const saveBudgetBtn = document.getElementById('save-budget-btn');
const expenseForm = document.getElementById('expense-form');
const resetBudgetBtn = document.getElementById('reset-budget-btn');

if(monthlyBudgetInput && monthlyBudget > 0) {
    monthlyBudgetInput.value = monthlyBudget;
}

if(saveBudgetBtn) {
    saveBudgetBtn.addEventListener('click', () => {
        monthlyBudget = parseFloat(monthlyBudgetInput.value) || 0;
        localStorage.setItem('planner_budget', monthlyBudget);
        updateExpenseSummary();
        alert('تم حفظ الميزانية الشهرية بنجاح!');
    });
}

if(expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('expense-title').value;
        const amount = parseFloat(document.getElementById('expense-amount').value) || 0;
        
        expenses.push({ id: Date.now(), title, amount });
        saveAndRenderExpenses();
        
        document.getElementById('expense-title').value = '';
        document.getElementById('expense-amount').value = '';
    });
}

document.querySelectorAll('.quick-expense-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const amount = parseFloat(btn.getAttribute('data-amount'));
        expenses.push({ id: Date.now(), title, amount });
        saveAndRenderExpenses();
    });
});

if(resetBudgetBtn) {
    resetBudgetBtn.addEventListener('click', () => {
        if(confirm('هل أنتِ متأكدة من تصفير الميزانية والمصاريف؟')) {
            monthlyBudget = 0;
            expenses = [];
            localStorage.removeItem('planner_budget');
            localStorage.removeItem('planner_expenses');
            if(monthlyBudgetInput) monthlyBudgetInput.value = '';
            updateExpenseSummary();
        }
    });
}

function saveAndRenderExpenses() {
    localStorage.setItem('planner_expenses', JSON.stringify(expenses));
    updateExpenseSummary();
}

function updateExpenseSummary() {
    const totalExpensesEl = document.getElementById('total-expenses');
    const remainingEl = document.getElementById('remaining-budget');
    
    if(!totalExpensesEl || !remainingEl) return;

    let total = expenses.reduce((sum, item) => sum + item.amount, 0);
    totalExpensesEl.innerText = total + ' جنيه';
    
    if(monthlyBudget > 0) {
        let remaining = monthlyBudget - total;
        remainingEl.innerText = remaining + ' جنيه';
        remainingEl.style.color = remaining < 0 ? '#ef4444' : '#10b981';
    } else {
        remainingEl.innerText = 'غير محددة';
        remainingEl.style.color = '#10b981';
    }
}
updateExpenseSummary();

// --- التحفيز والمقولات ---
const quotes = [
    "عظمة بداياتك تكمن في استمرارك وثباتك، لا تتقاعس فكل خطوة تقربك لحلمك.",
    "لا توجد إعاقة تعيق الطموح، بل عقلية هي ما تقرر النجاح أو التوقف.",
    "اجعل كل يوم نسخة أفضل من يوم أمس.",
    "النجاح ليس تصادُفاً، بل هو ثمرة جهد واجتهاد مستمر."
];
const quoteText = document.getElementById('motivation-quote');
const changeQuoteBtn = document.getElementById('change-quote-btn');

if(changeQuoteBtn && quoteText) {
    changeQuoteBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.innerText = `"${quotes[randomIndex]}"`;
    });
}

// --- نظام تفعيل تنبيهات المنبه (Browser Notifications) ---
const enableNotificationsBtn = document.getElementById('enable-notifications-btn');
if(enableNotificationsBtn) {
    enableNotificationsBtn.addEventListener('click', () => {
        if (!("Notification" in window)) {
            alert("متصفحك لا يدعم الإشعارات.");
            return;
        }
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("تم تفعيل الإشعارات بنجاح!");
            } else {
                alert("تم رفض إذن الإشعارات.");
            }
        });
    });
}

let lastAlertMinute = null;
setInterval(() => {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    if(lastAlertMinute !== currentTimeStr) {
        const timeInputs = document.querySelectorAll('input[type="time"]');
        let notificationSent = false;

        timeInputs.forEach(input => {
            if(input.value === currentTimeStr) {
                if (Notification.permission === "granted") {
                    new Notification("تنبيه من Daily Planner ⏰", {
                        body: `حان الآن موعد: ${input.id.replace('alarm-', '').replace('-', ' ')}`,
                        icon: "https://cdn-icons-png.flaticon.com/512/3236/3236946.png"
                    });
                    notificationSent = true;
                }
            }
        });

        if(notificationSent) {
            lastAlertMinute = currentTimeStr;
        }
    }
}, 10000);

// تهيئة أولية
renderTasks();
updateStats();