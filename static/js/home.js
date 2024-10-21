document.addEventListener('DOMContentLoaded', function() {
    const currentTimeElement = document.getElementById('current-time');
    const alarmMonthSelect = document.getElementById('alarm-month');
    const alarmDaySelect = document.getElementById('alarm-day');
    const alarmYearSelect = document.getElementById('alarm-year');
    const alarmHourInput = document.getElementById('alarm-hour');
    const alarmMinuteInput = document.getElementById('alarm-minute');
    const setAlarmButton = document.getElementById('set-alarm');
    const currentDateElement = document.getElementById('currentDate');
    let alarmTime = null;
    let speechSynthesis = window.speechSynthesis;
    let speechUtterance = null;

    function updateCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        currentDateElement.textContent = formattedDate;
    }
    
    updateCurrentDate();
    
    function updateCurrentTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString();
        
        if (alarmTime && now >= alarmTime) {
            loopDailyText();
            alarmTime = null;
        }
    }

    setInterval(updateCurrentTime, 1000);

    // Populate month select
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        if (index === currentMonth) {
            option.selected = true;
        }
        alarmMonthSelect.appendChild(option);
    });

    // Populate year select (current year + next 10 years)
    const currentYear = currentDate.getFullYear();
    for (let year = currentYear; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        alarmYearSelect.appendChild(option);
    }

    // Set current day
    const currentDay = currentDate.getDate();

    // Update days based on selected month and year
    function updateDays() {
        const year = parseInt(alarmYearSelect.value);
        const month = parseInt(alarmMonthSelect.value);
        const daysInMonth = new Date(year, month, 0).getDate();

        alarmDaySelect.innerHTML = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            alarmDaySelect.appendChild(option);
        }
    }

    alarmMonthSelect.addEventListener('change', updateDays);
    alarmYearSelect.addEventListener('change', updateDays);

    // Initial population of days and select current day
    updateDays();
    alarmDaySelect.value = currentDay;

    setAlarmButton.addEventListener('click', function() {
        const year = parseInt(alarmYearSelect.value);
        const month = parseInt(alarmMonthSelect.value) - 1; // JavaScript months are 0-indexed
        const day = parseInt(alarmDaySelect.value);
        const hour = parseInt(alarmHourInput.value);
        const minute = parseInt(alarmMinuteInput.value);

        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
            alert('Please set a valid date and time for the alarm');
            return;
        }

        alarmTime = new Date(year, month, day, hour, minute, 0);
        const now = new Date();
        if (alarmTime < now) {
            alert('Please set a future time for the alarm');
            return;
        }

        alert(`Alarm set for ${alarmTime.toLocaleString()}`);
    });

    function playDailyText() {
        const dailyTextElement = document.getElementById('daily-text');
        const text = dailyTextElement.textContent;
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        speechUtterance = new SpeechSynthesisUtterance(text);
        speechUtterance.volume = 1; // Set volume to maximum
        speechSynthesis.speak(speechUtterance);
    }

    function loopDailyText() {
        playDailyText();
        speechUtterance.onend = loopDailyText;
        document.getElementById('stop-alarm').style.display = 'block';
    }

    function stopAlarm() {
        speechSynthesis.cancel();
        document.getElementById('stop-alarm').style.display = 'none';
        alarmTime = null;
    }

    document.getElementById('stop-alarm').addEventListener('click', stopAlarm);
});

// Language selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageButton = document.getElementById('language-select-button');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');

    languageButton.addEventListener('click', function() {
        languageMenu.classList.toggle('hidden');
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            changeLanguage(selectedLang);
            languageMenu.classList.add('hidden');
        });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!languageButton.contains(event.target) && !languageMenu.contains(event.target)) {
            languageMenu.classList.add('hidden');
        }
    });
});

function changeLanguage(lang) {
    // TODO: Implement language change logic
    console.log('Changing language to:', lang);
    // Here you would typically update the UI elements and fetch new content
    // For now, we'll just reload the page
    window.location.reload();
}