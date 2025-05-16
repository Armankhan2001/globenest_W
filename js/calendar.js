/**
 * Globe Nest Solutions
 * Visa Consultation Booking Calendar
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize the booking calendar if it exists on the page
    const bookingCalendar = document.getElementById('bookingCalendar');
    if (bookingCalendar) {
        initializeBookingCalendar();
    }
    
    function initializeBookingCalendar() {
        // Current date
        const currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        // Calendar elements
        const calendarMonthYear = document.getElementById('calendarMonthYear');
        const calendarDays = document.getElementById('calendarDays');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        const timeSlotContainer = document.getElementById('timeSlots');
        const selectedDateEl = document.getElementById('selectedDate');
        const noTimeSlotsMsg = document.getElementById('noTimeSlots');
        const timeSlotGrid = document.getElementById('timeSlotGrid');
        const bookingDetails = document.getElementById('bookingDetails');
        const calendarLoader = document.getElementById('calendarLoader');
        
        // Consultation type elements
        const consultationOptions = document.querySelectorAll('.consultation-option');
        
        // Booking form elements
        const bookingForm = document.getElementById('bookingForm');
        const selectedDateInput = document.getElementById('selectedDateInput');
        const selectedTimeInput = document.getElementById('selectedTimeInput');
        const selectedConsultationInput = document.getElementById('selectedConsultationType');
        
        // Summary elements
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryType = document.getElementById('summaryType');
        const summaryConsultant = document.getElementById('summaryConsultant');
        const summaryPrice = document.getElementById('summaryPrice');
        
        // Month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        // Day names
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Available consultants
        const consultants = [
            { id: 1, name: "Sarah Johnson", specialization: "Student Visas" },
            { id: 2, name: "David Lee", specialization: "Work Visas" },
            { id: 3, name: "Maria Garcia", specialization: "Tourist Visas" },
            { id: 4, name: "Ahmed Patel", specialization: "Business Visas" }
        ];
        
        // Mock data for available time slots (in a real app, this would come from an API)
        const mockAvailableSlots = {};
        
        // Generate some available days and time slots for next 60 days
        for (let i = 1; i < 60; i++) {
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + i);
            
            // Skip weekends
            if (futureDate.getDay() === 0 || futureDate.getDay() === 6) {
                continue;
            }
            
            const dateString = formatDate(futureDate);
            
            // Generate random time slots for each date
            const slots = [];
            const numSlots = Math.floor(Math.random() * 6) + 2; // 2-8 slots
            
            const availableTimes = [
                "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
            ];
            
            // Randomly select times
            const selectedTimes = [];
            while (selectedTimes.length < numSlots && selectedTimes.length < availableTimes.length) {
                const randomIndex = Math.floor(Math.random() * availableTimes.length);
                const time = availableTimes[randomIndex];
                
                if (!selectedTimes.includes(time)) {
                    selectedTimes.push(time);
                    
                    // Assign a random consultant to each slot
                    const randomConsultant = consultants[Math.floor(Math.random() * consultants.length)];
                    
                    slots.push({
                        time: time,
                        consultant: randomConsultant.name,
                        consultantId: randomConsultant.id,
                        booked: false
                    });
                }
            }
            
            // Sort by time
            slots.sort((a, b) => {
                return convertTo24Hour(a.time) - convertTo24Hour(b.time);
            });
            
            mockAvailableSlots[dateString] = slots;
        }
        
        // Helper to convert time to 24-hour format for sorting
        function convertTo24Hour(time12h) {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');
            
            if (hours === '12') {
                hours = '00';
            }
            
            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }
            
            return parseInt(hours, 10);
        }
        
        // Format date as YYYY-MM-DD
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        // Format date for display (Month DD, YYYY)
        function formatDisplayDate(dateString) {
            const parts = dateString.split('-');
            const year = parts[0];
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            
            const date = new Date(year, month, day);
            return `${monthNames[month]} ${day}, ${year}`;
        }
        
        // Initial render
        renderCalendar();
        
        // Event listeners
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        // Handle consultation type selection
        consultationOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                consultationOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Update the hidden input
                const consultationType = this.getAttribute('data-type');
                const consultationPrice = this.getAttribute('data-price');
                selectedConsultationInput.value = consultationType;
                
                // Update summary
                summaryType.textContent = consultationType;
                summaryPrice.textContent = consultationPrice;
                
                // Check if we can enable the book button
                checkFormCompleteness();
            });
        });
        
        // Handle booking form submission
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = bookingForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                
                // Simulate booking process (in real app, this would be an API call)
                setTimeout(() => {
                    // Show success message
                    showToast('Your consultation has been booked successfully! A confirmation email has been sent.');
                    
                    // Reset form
                    bookingForm.reset();
                    
                    // Reset UI
                    consultationOptions.forEach(opt => opt.classList.remove('active'));
                    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('active'));
                    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('active'));
                    
                    // Hide booking details
                    bookingDetails.classList.remove('show');
                    
                    // Hide time slots
                    timeSlotContainer.style.display = 'none';
                    
                    // Reset submit button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Reset calendar
                    renderCalendar();
                    
                    // Add to Google Calendar option
                    const bookingDate = selectedDateInput.value;
                    const bookingTime = selectedTimeInput.value;
                    const consultationType = selectedConsultationInput.value;
                    
                    // Create a Google Calendar event URL
                    const eventTitle = `Visa Consultation - ${consultationType}`;
                    const eventStart = new Date(`${bookingDate}T${convertTimeToISO(bookingTime)}`);
                    const eventEnd = new Date(eventStart);
                    eventEnd.setHours(eventStart.getHours() + 1); // 1-hour consultation
                    
                    const gcalUrl = createGoogleCalendarUrl(
                        eventTitle,
                        eventStart,
                        eventEnd,
                        'Globe Nest Solutions Office',
                        'Your visa consultation appointment with Globe Nest Solutions'
                    );
                    
                    // Create the "Add to Calendar" button
                    const addToCalendarBtn = document.createElement('a');
                    addToCalendarBtn.href = gcalUrl;
                    addToCalendarBtn.target = '_blank';
                    addToCalendarBtn.className = 'add-to-calendar';
                    addToCalendarBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Add to Google Calendar';
                    
                    // Append to a container after the form
                    const calendarContainer = document.getElementById('addToCalendarContainer');
                    if (calendarContainer) {
                        calendarContainer.innerHTML = '';
                        calendarContainer.appendChild(addToCalendarBtn);
                    }
                    
                }, 1500);
            });
        }
        
        // Helper for creating Google Calendar URL
        function createGoogleCalendarUrl(title, start, end, location, description) {
            const startISO = start.toISOString().replace(/-|:|\.\d+/g, '');
            const endISO = end.toISOString().replace(/-|:|\.\d+/g, '');
            
            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startISO}/${endISO}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;
        }
        
        // Convert regular time to ISO format
        function convertTimeToISO(time) {
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':');
            
            hours = parseInt(hours);
            
            if (modifier === 'PM' && hours < 12) {
                hours += 12;
            }
            if (modifier === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${String(hours).padStart(2, '0')}:${minutes}:00`;
        }
        
        // Toast notification function
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                ${message}
                <button class="close-toast">&times;</button>
            `;
            
            document.body.appendChild(toast);
            
            // Trigger layout and add show class
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Close button event
            toast.querySelector('.close-toast').addEventListener('click', function() {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            });
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 5000);
        }
        
        // Check if form is complete to enable/disable Book button
        function checkFormCompleteness() {
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            
            if (selectedDateInput.value && 
                selectedTimeInput.value && 
                selectedConsultationInput.value) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }
        
        // Render the calendar
        function renderCalendar() {
            // Update month and year display
            calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Clear previous days
            calendarDays.innerHTML = '';
            
            // Add day headers
            dayNames.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                calendarDays.appendChild(dayHeader);
            });
            
            // Get first day of month and total days
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Add empty cells for days before the first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day disabled';
                calendarDays.appendChild(emptyDay);
            }
            
            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                // Create date string for checking available slots
                const dateString = formatDate(new Date(currentYear, currentMonth, day));
                
                // Check if this date is in the past
                const currentDateObj = new Date();
                currentDateObj.setHours(0, 0, 0, 0);
                const checkDate = new Date(currentYear, currentMonth, day);
                
                if (checkDate < currentDateObj) {
                    dayElement.classList.add('disabled');
                } else {
                    // Check if this date has available slots
                    if (mockAvailableSlots[dateString] && mockAvailableSlots[dateString].length > 0) {
                        dayElement.classList.add('has-slots');
                        
                        // Add click event to select this day
                        dayElement.addEventListener('click', function() {
                            // Remove active class from all days
                            document.querySelectorAll('.calendar-day').forEach(d => {
                                d.classList.remove('active');
                            });
                            
                            // Add active class to clicked day
                            this.classList.add('active');
                            
                            // Show time slots for this day
                            showTimeSlots(dateString);
                            
                            // Update selected date display and form input
                            selectedDateEl.textContent = formatDisplayDate(dateString);
                            selectedDateInput.value = dateString;
                            
                            // Update summary
                            summaryDate.textContent = formatDisplayDate(dateString);
                        });
                    } else {
                        dayElement.classList.add('disabled');
                    }
                }
                
                calendarDays.appendChild(dayElement);
            }
        }
        
        // Show time slots for selected date
        function showTimeSlots(dateString) {
            // Show loader
            calendarLoader.classList.add('show');
            
            // Clear previous slots
            timeSlotGrid.innerHTML = '';
            
            // Simulate API request delay
            setTimeout(() => {
                const slots = mockAvailableSlots[dateString];
                
                // Hide loader
                calendarLoader.classList.remove('show');
                
                // Show/hide slots container
                timeSlotContainer.style.display = 'block';
                
                if (!slots || slots.length === 0) {
                    noTimeSlotsMsg.style.display = 'block';
                    timeSlotGrid.style.display = 'none';
                    return;
                }
                
                noTimeSlotsMsg.style.display = 'none';
                timeSlotGrid.style.display = 'grid';
                
                // Add slots to grid
                slots.forEach(slot => {
                    const slotElement = document.createElement('div');
                    slotElement.className = `time-slot ${slot.booked ? 'booked' : ''}`;
                    slotElement.textContent = slot.time;
                    slotElement.setAttribute('data-consultant', slot.consultant);
                    slotElement.setAttribute('data-consultant-id', slot.consultantId);
                    
                    // Add click event if not booked
                    if (!slot.booked) {
                        slotElement.addEventListener('click', function() {
                            // Remove active class from all slots
                            document.querySelectorAll('.time-slot').forEach(s => {
                                s.classList.remove('active');
                            });
                            
                            // Add active class to clicked slot
                            this.classList.add('active');
                            
                            // Update form input
                            selectedTimeInput.value = slot.time;
                            
                            // Update summary
                            summaryTime.textContent = slot.time;
                            summaryConsultant.textContent = slot.consultant;
                            
                            // Show booking details
                            bookingDetails.classList.add('show');
                            
                            // Check if form is complete
                            checkFormCompleteness();
                        });
                    }
                    
                    timeSlotGrid.appendChild(slotElement);
                });
            }, 800); // Simulate network delay
        }
    }
});