let selectedMonths = 3;

document.addEventListener('DOMContentLoaded', function() {
  const confirmButton = document.getElementById('confirm-button');
  const monthButtons = document.querySelectorAll('.month-btn');
  const calendarContainer = document.getElementById('calendar');
  const startDateInput = document.getElementById('start-date');

  const historyPanel = document.getElementById('history-panel');
  const toggleHistoryButton = document.getElementById('toggle-history');
  const historyList = document.getElementById('history-list'); 

  const savedHistory = JSON.parse(localStorage.getItem('dateHistory')) || [];
    savedHistory.forEach(date => addToHistory(date));
    
  startDateInput.valueAsDate = new Date();
  confirmButton.addEventListener('click', function() {

    const startDate = startDateInput.value;
    if (startDate) {
        updateCalendar(startDate);
        updateHistory(startDate); 
    } else {
        alert('Пожалуйста, выберите дату.');
    }
});

document.getElementById('clear-history').addEventListener('click', function() {
  localStorage.removeItem('dateHistory');
  savedHistory.length = 0; 
  renderHistory();
});

monthButtons.forEach(button => {
  button.addEventListener('click', function() {
      selectedMonths = parseInt(this.getAttribute('data-months'));
      const startDate = startDateInput.value;
      if (startDate) {
          updateCalendar(startDate);
          monthButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
      }
  });
});

  toggleHistoryButton.addEventListener('click', function() {
    if (historyPanel.classList.contains('show')) {
        historyPanel.classList.remove('show');
        document.body.classList.remove('show-history');
        toggleHistoryButton.classList.remove('hide-button');
        toggleHistoryButton.innerHTML = '&#9776;'; 
    } else {
        historyPanel.classList.add('show');
        document.body.classList.add('show-history');
        toggleHistoryButton.innerHTML = '&#8592;'; 
        toggleHistoryButton.classList.add('hide-button');
    }
});

function updateHistory(newDate) {
  const existingIndex = savedHistory.indexOf(newDate);
  if (existingIndex > -1) {
      savedHistory.splice(existingIndex, 1); 
  }
  savedHistory.push(newDate); 
  localStorage.setItem('dateHistory', JSON.stringify(savedHistory)); 
  renderHistory(); 
}

function renderHistory() {
  historyList.innerHTML = ''; 
  savedHistory.forEach(date => addToHistory(date)); 
}
function addToHistory(date) {
  const listItem = document.createElement('li');
  listItem.textContent = date;
  listItem.addEventListener('click', function() {
      startDateInput.value = date;
      updateCalendar(date);

      historyPanel.classList.remove('show');
      document.body.classList.remove('show-history');
      toggleHistoryButton.innerHTML = '&#9776;'; 
  });
  historyList.appendChild(listItem);
}

  function updateCalendar(startDate) {
    calendarContainer.innerHTML = ''; 
    let date = new Date(startDate);
    let days = 28 * selectedMonths;

    for (let d = 0; d < days; d += 28) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        monthDiv.innerHTML = `<h4>${getMonthTitle(date)}</h4>`;

        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'weekdays';
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        let startDay = date.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        for (let i = 0; i < 7; i++) {
            const daySpan = document.createElement('span');
            if ((startDay + i) % 7 === 5 || (startDay + i) % 7 === 6) { 
                daySpan.className = 'weekend';
            }
            daySpan.textContent = weekdays[(startDay + i) % 7];
            weekdaysDiv.appendChild(daySpan);
        }
        monthDiv.appendChild(weekdaysDiv);

        for (let w = 0; w < 4; w++) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'week';
            for (let day = 0; day < 7; day++) {
                if (d + w * 7 + day < days) {
                    const daySpan = document.createElement('span');
                    if (date.getDay() === 0 || date.getDay() === 6) { 
                        daySpan.className = 'weekend';
                    }
                    daySpan.textContent = `${date.getDate()} `;
                    weekDiv.appendChild(daySpan);
                    date.setDate(date.getDate() + 1);
                }
            }
            monthDiv.appendChild(weekDiv);
        }

        calendarContainer.appendChild(monthDiv);
    }
}

function getMonthTitle(date) {
    let month = date.toLocaleDateString('ru', { month: 'long' });
    let year = date.getFullYear();
    let nextMonthDate = new Date(date);
    nextMonthDate.setDate(date.getDate() + 27);
    let nextMonth = nextMonthDate.toLocaleDateString('ru', { month: 'long' });
    let nextYear = nextMonthDate.getFullYear();

    if (month === nextMonth && year === nextYear) {
        return `${month} ${year}`;
    } else {
        return `${month} ${year} - ${nextMonth} ${nextYear}`;
    }
}


});
