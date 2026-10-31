
// ================= DAYBLOOM HABIT TRACKER =================
// LocalStorage key
const STORAGE_KEY = "daybloom-habit-data-v1";
// Default habits
const defaultHabits = [
  {
    id: "dsa",
    name: "Study DSA",
    category: "Learning",
    detail: "Practice problems · 45 min",
    color: "sage",
    icon: "⌘"
  },
  {
    id: "ml",
    name: "Learn Machine Learning",
    category: "Career",
    detail: "Scikit-learn · 30 min",
    color: "peach",
    icon: "✎"
  },
  {
    id: "books",
    name: "Read Books",
    category: "Personal",
    detail: "A few pages · 20 min",
    color: "lilac",
    icon: "▤"
  }
];
// Convert date into YYYY-MM-DD
function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// Load saved data
function loadData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );
    if (
      saved &&
      Array.isArray(saved.habits) &&
      saved.logs
    ) {
      return {
        habits: saved.habits,
        logs: saved.logs,
        benchmark: Number.isInteger(saved.benchmark)
          ? saved.benchmark
          : 80
      };
    }
  } catch (error) {
    console.warn("Could not load saved data:", error);
  }
  return {
    habits: defaultHabits,
    logs: {},
    benchmark: 80
  };
}
// Main data
let data = loadData();
let weeklyChart = null;
// Save data
function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}
// Check whether a habit is completed on a date
function isHabitDone(dateKey, habitId) {
  return Boolean(
    data.logs[dateKey] &&
    data.logs[dateKey][habitId]
  );
}
// Count completed habits for a particular date
function completedOnDate(dateKey) {
  let completed = 0;
  for (const habit of data.habits) {
    if (isHabitDone(dateKey, habit.id)) {
      completed++;
    }
  }
  return completed;
}
// Get current month information
function getMonthInformation() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();
  return {
    year: year,
    month: month,
    daysInMonth: daysInMonth,
    daysCounted: now.getDate()
  };
}
// Calculate monthly progress
function getMonthlyStats() {
  const monthInfo = getMonthInformation();
  let completed = 0;
  for (
    let day = 1;
    day <= monthInfo.daysCounted;
    day++
  ) {
    const date = new Date(
      monthInfo.year,
      monthInfo.month,
      day
    );
    completed += completedOnDate(
      localDateKey(date)
    );
  }
  const possible =
    monthInfo.daysCounted * data.habits.length;
  let percentage = 0;
  if (possible > 0) {
    percentage = Math.round(
      (completed / possible) * 100
    );
  }
  return {
    completed: completed,
    possible: possible,
    percentage: percentage
  };
}
// Calculate individual habit progress
function getHabitMonthlyPercentage(habitId) {
  const monthInfo = getMonthInformation();
  let completedDays = 0;
  for (
    let day = 1;
    day <= monthInfo.daysCounted;
    day++
  ) {
    const date = new Date(
      monthInfo.year,
      monthInfo.month,
      day
    );
    if (
      isHabitDone(
        localDateKey(date),
        habitId
      )
    ) {
      completedDays++;
    }
  }
  if (monthInfo.daysCounted === 0) {
    return 0;
  }
  return Math.round(
    (completedDays / monthInfo.daysCounted) * 100
  );
}

// Calculate current streak
function calculateStreak() {
  if (data.habits.length === 0) {
    return 0;
  }
  const cursor = new Date();
  const todayKey = localDateKey(cursor);
  // If today is incomplete, start checking from yesterday.
  if (
    completedOnDate(todayKey) !== data.habits.length
  ) {
    cursor.setDate(
      cursor.getDate() - 1
    );
  }
  let streak = 0;
  while (
    completedOnDate(localDateKey(cursor)) ===
    data.habits.length
  ) {
    streak++;
    cursor.setDate(
      cursor.getDate() - 1
    );
  }
  return streak;
}
// Update text in HTML
function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}
// Update statistics
function updateStatistics() {
  const stats = getMonthlyStats();
  setText(
    "monthlyProgress",
    `${stats.percentage}%`
  );
  setText(
    "completedCount",
    `${stats.completed} / ${stats.possible}`
  );
  setText(
    "currentStreak",
    `${calculateStreak()} days`
  );
  setText(
    "benchmarkValue",
    `${data.benchmark}%`
  );
  const progressBar = document.getElementById(
    "monthlyProgressBar"
  );
  if (progressBar) {
    progressBar.style.width =
      `${stats.percentage}%`;
  }
  const goalText = document.getElementById(
    "monthlyGoalText"
  );
  if (goalText) {
    if (stats.percentage >= data.benchmark) {
      goalText.textContent =
        "You reached your monthly goal!";
    } else {
      const difference =
        data.benchmark - stats.percentage;
      goalText.textContent =
        `${difference}% away from your goal`;
    }
  }
}
// Protect HTML from user-entered special characters
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    function (character) {
      const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };
      return replacements[character];
    }
  );
}
// Create one habit card
function createHabitCard(habit) {
  const todayKey = localDateKey();
  const isDone = isHabitDone(
    todayKey,
    habit.id
  );
  const percentage =
    getHabitMonthlyPercentage(habit.id);
  const colors = {
    sage: {
      icon: "bg-[#E9EFE4]",
      tag: "bg-[#F0F4ED] text-[#6E896F]",
      bar: "bg-[#7D9B7D]"
    },
    peach: {
      icon: "bg-[#F5E9E1]",
      tag: "bg-[#F8EEE8] text-[#B17E61]",
      bar: "bg-[#D8A98D]"
    },
    lilac: {
      icon: "bg-[#F2EDF7]",
      tag: "bg-[#F2EDF7] text-[#8875A5]",
      bar: "bg-[#A99AC2]"
    },
    butter: {
      icon: "bg-[#F7F0D8]",
      tag: "bg-[#F7F0D8] text-[#A58D4A]",
      bar: "bg-[#D8C47C]"
    }
  };
  const color = colors[habit.color] || colors.sage;
  return `
    <article class="habit-row flex items-center gap-3 rounded-[22px] border border-[#E9EAE2] bg-white p-4 sm:gap-4 sm:p-5">
      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-[17px] ${color.icon} text-[22px]">
        ${escapeHTML(habit.icon || "✿")}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-sm font-bold text-ink">
            ${escapeHTML(habit.name)}
          </h3>
          <span class="rounded-full ${color.tag} px-2 py-1 text-[9px] font-bold">
            ${escapeHTML(habit.category || "Personal")}
          </span>
        </div>
        <p class="mt-1 text-[11px] text-[#9AA49A]">
          ${escapeHTML(habit.detail || "Daily habit")}
        </p>
        <div class="mt-3 flex items-center gap-2">
          <div class="h-1 w-20 overflow-hidden rounded-full bg-[#EEF0E9] sm:w-24">
            <div
              class="h-full rounded-full ${color.bar}"
              style="width:${percentage}%"
            ></div>
          </div>
          <span class="text-[10px] text-[#89968A]">
            ${percentage}% this month
          </span>
        </div>
      </div>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          class="habit-checkbox"
          type="checkbox"
          data-habit-id="${escapeHTML(habit.id)}"
          ${isDone ? "checked" : ""}
          aria-label="Mark ${escapeHTML(habit.name)} complete"
        >
        <span class="hidden text-[10px] font-semibold ${isDone ? "text-[#66866D]" : "text-[#9AA49A]"} sm:inline">
          ${isDone ? "Done" : "Mark done"}
        </span>
      </label>
      <button
        type="button"
        class="ml-1 text-xl leading-none text-[#A0AAA0] hover:text-[#496B52]"
        data-delete-habit="${escapeHTML(habit.id)}"
        title="Delete habit"
      >
        ×
      </button>
    </article>
  `;
}
// Render all habits
function renderHabits() {
  const habitList = document.getElementById(
    "habitList"
  );
  if (!habitList) {
    return;
  }
  if (data.habits.length === 0) {
    habitList.innerHTML = `
      <div class="rounded-[22px] border border-dashed border-[#D9E1D5] bg-white p-8 text-center">
        <p class="display text-xl text-ink">
          Your garden is waiting.
        </p>
        <p class="mt-2 text-xs text-[#9AA49A]">
          Add your first habit to get started.
        </p>
      </div>
    `;
    return;
  }
  let cards = "";
  for (const habit of data.habits) {
    cards += createHabitCard(habit);
  }
  habitList.innerHTML = cards;
}
// Render calendar
function renderCalendar() {
  const calendarGrid = document.getElementById(
    "calendarGrid"
  );
  const calendarMonth = document.getElementById(
    "calendarMonth"
  );
  if (!calendarGrid) {
    return;
  }
  const monthInfo = getMonthInformation();
  const firstDay = new Date(
    monthInfo.year,
    monthInfo.month,
    1
  ).getDay();
  const todayKey = localDateKey();
  if (calendarMonth) {
    calendarMonth.textContent = new Date(
      monthInfo.year,
      monthInfo.month,
      1
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }
  const weekdayNames = [
    "S", "M", "T", "W", "T", "F", "S"
  ];
  let calendarHTML = "";
  for (const weekday of weekdayNames) {
    calendarHTML += `
      <span class="py-2 text-[9px] font-bold uppercase text-[#AAB2A9]">
        ${weekday}
      </span>
    `;
  }
  // Empty spaces before the first day.
  for (
    let empty = 0;
    empty < firstDay;
    empty++
  ) {
    calendarHTML += `
      <span class="calendar-cell"></span>
    `;
  }
  // Actual calendar dates.
  for (
    let day = 1;
    day <= monthInfo.daysInMonth;
    day++
  ) {
    const date = new Date(
      monthInfo.year,
      monthInfo.month,
      day
    );
    const dateKey = localDateKey(date);
    const completed = completedOnDate(dateKey);
    const totalHabits = data.habits.length;
    let statusClass = "";
    if (
      totalHabits > 0 &&
      completed === totalHabits
    ) {
      statusClass = "done";
    } else if (completed > 0) {
      statusClass = "partial";
    }
    if (dateKey > todayKey) {
      statusClass += " future";
    }
    const todayClass =
      dateKey === todayKey ? "today" : "";
    calendarHTML += `
      <span
        class="calendar-cell ${statusClass} ${todayClass}"
        title="${completed} of ${totalHabits} habits completed"
      >
        ${day}
      </span>
    `;
  }
  calendarGrid.innerHTML = calendarHTML;
}
// Render weekly bar chart
function renderWeeklyChart() {
  const canvas = document.getElementById(
    "weeklyChart"
  );
  if (!canvas || typeof Chart === "undefined") {
    return;
  }
  const labels = [];
  const values = [];
  for (
    let offset = 6;
    offset >= 0;
    offset--
  ) {
    const date = new Date();
    date.setDate(
      date.getDate() - offset
    );
    const dateKey = localDateKey(date);
    const completed = completedOnDate(dateKey);
    let percentage = 0;
    if (data.habits.length > 0) {
      percentage = Math.round(
        (completed / data.habits.length) * 100
      );
    }
    labels.push(
      date.toLocaleDateString("en-US", {
        weekday: "short"
      })
    );
    values.push(percentage);
  }
  // Destroy previous chart before creating a new one.
  if (weeklyChart) {
    weeklyChart.destroy();
  }
  weeklyChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Daily completion",
        data: values,
        backgroundColor: values.map(
          function (value, index) {
            if (index === values.length - 1) {
              return "#66866D";
            }
            return "#A7BBA3";
          }
        ),
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 25
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.raw}% completed`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            color: "#9AA49A"
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: function (value) {
              return `${value}%`;
            },
            color: "#A0AAA0"
          },
          grid: {
            color: "#EEF0E9"
          },
          border: {
            display: false
          }
        }
      }
    }
  });
}
// Render the entire dashboard
function renderAll() {
  renderHabits();
  updateStatistics();
  renderCalendar();
  renderWeeklyChart();
}
// Add a new habit
function addHabit() {
  const habitName = prompt(
    "What habit would you like to add?"
  );
  if (
    habitName === null ||
    habitName.trim() === ""
  ) {
    return;
  }
  const newHabit = {
    id: `habit-${Date.now()}`,
    name: habitName.trim(),
    category: "Personal",
    detail: "Daily habit",
    color: "butter",
    icon: "✿"
  };
  data.habits.push(newHabit);
  saveData();
  renderAll();
}
// Delete a habit
function deleteHabit(habitId) {
  const habit = data.habits.find(
    function (item) {
      return item.id === habitId;
    }
  );
  if (!habit) {
    return;
  }
  const shouldDelete = confirm(
    `Delete "${habit.name}"? Its saved check-ins will also be removed.`
  );
  if (!shouldDelete) {
    return;
  }
  data.habits = data.habits.filter(
    function (item) {
      return item.id !== habitId;
    }
  );
  // Remove this habit's previous check-ins.
  for (const dateKey of Object.keys(data.logs)) {
    delete data.logs[dateKey][habitId];
  }
  saveData();
  renderAll();
}
// Change monthly benchmark
function changeBenchmark() {
  const answer = prompt(
    "Set your monthly target percentage (0–100):",
    String(data.benchmark)
  );
  if (answer === null) {
    return;
  }
  const newValue = Number(answer);
  if (
    !Number.isInteger(newValue) ||
    newValue < 0 ||
    newValue > 100
  ) {
    alert(
      "Please enter a whole number between 0 and 100."
    );
    return;
  }
  data.benchmark = newValue;
  saveData();
  updateStatistics();
}
// Listen for checkbox changes.
document.addEventListener("change", function (event) {
  if (!event.target.matches(".habit-checkbox")) {
    return;
  }
  const habitId = event.target.dataset.habitId;
  const dateKey = localDateKey();
  if (!data.logs[dateKey]) {
    data.logs[dateKey] = {};
  }
  if (event.target.checked) {
    data.logs[dateKey][habitId] = true;
  } else {
    delete data.logs[dateKey][habitId];
  }
  saveData();
  renderAll();
});
// Listen for button clicks.
document.addEventListener("click", function (event) {
  const addButton = event.target.closest(
    "[data-add-habit]"
  );
  if (addButton) {
    addHabit();
    return;
  }
  const deleteButton = event.target.closest(
    "[data-delete-habit]"
  );
  if (deleteButton) {
    deleteHabit(
      deleteButton.dataset.deleteHabit
    );
    return;
  }
  const benchmarkButton = event.target.closest(
    "[data-change-benchmark]"
  );
  if (benchmarkButton) {
    changeBenchmark();
  }
});
// Navigation active state
function setupNavigation() {
  const links = document.querySelectorAll(
    ".sidebar-link"
  );
  for (const link of links) {
    link.addEventListener("click", function () {
      for (const item of links) {
        item.classList.remove("active");
      }
      link.classList.add("active");
    });
  }
}

// Start the app
function startDaybloom() {
  const dateElement = document.getElementById(
    "todayDate"
  );
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }
  setupNavigation();
  renderAll();
}
// Run JavaScript
startDaybloom();
