// script.js

// Dummy data for doctors and appointments
const doctors = [
    { id: 1, name: "Dr. Smith", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"], bookedSlots: [] ,availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']  },
    { id: 2, name: "Dr. Jones", slots: ["09:00", "11:00", "12:00", "13:00", "16:00"], bookedSlots: [] },
    { id: 3, name: "Dr. Brown", slots: ["10:00", "11:00", "13:00", "15:00"], bookedSlots: [] }
];

const appointments = [];

// Populate available doctors and time slots
function loadDoctors() {
    const doctorSelect = document.getElementById('doctor');
    const doctorsCardsContainer = document.getElementById('doctorsCardsContainer');
    const timeSelect = document.getElementById('time');
    
    // Clear previous data
    doctorsCardsContainer.innerHTML = '';
    doctorSelect.innerHTML = '';
    timeSelect.innerHTML = '';

    doctors.forEach(doctor => {
        // Add doctor to select dropdown
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);

        // Create doctor card
        const card = document.createElement('div');
        card.className = 'doctor-card';
        
        const doctorName = document.createElement('h3');
        doctorName.textContent = doctor.name;
        
        const slotsDiv = document.createElement('div');
        slotsDiv.innerHTML = `<strong>Available Slots:</strong> ${doctor.slots.join(', ')}`;
        
        const bookedSlotsDiv = document.createElement('div');
        bookedSlotsDiv.innerHTML = `<strong>Booked Slots:</strong> ${doctor.bookedSlots.join(', ')}`;
        
        card.appendChild(doctorName);
        card.appendChild(slotsDiv);
        card.appendChild(bookedSlotsDiv);
        
        doctorsCardsContainer.appendChild(card);
    });

    // Update available time slots based on selected doctor
    doctorSelect.addEventListener('change', function() {
        const selectedDoctorId = this.value;
        const doctor = doctors.find(doc => doc.id == selectedDoctorId);

        timeSelect.innerHTML = '';

        if (doctor) {
            doctor.slots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                timeSelect.appendChild(option);
            });
        }
    });
}

// Book an appointment
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorId = document.getElementById('doctor').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const doctor = doctors.find(doc => doc.id == doctorId);

    if (doctor) {
        // Check if the time slot is available on the selected date
        const isBooked = appointments.some(app => app.doctorId == doctorId && app.date == date && app.time == time);

        if (isBooked) {
            alert(document.getElementById('bookingMessage').textContent = `Selected time slot is already booked on ${date}.`);
            return;
        }

        const appointmentId = appointments.length + 1;
        const appointment = {
            id: appointmentId,
            doctorId,
            name,
            email,
            date,
            time
        };

        appointments.push(appointment);
        doctor.bookedSlots.push(time);
    alert(document.getElementById('bookingMessage').textContent = `Appointment booked successfully! ID: ${appointmentId}`);
        document.getElementById('bookingForm').reset();
        loadDoctors();
    }
});

// View all appointments
document.getElementById('viewAppointmentsBtn').addEventListener('click', function() {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        const li = document.createElement('li');
        const doctorName = doctors.find(doc => doc.id == appointment.doctorId).name;
        li.textContent = `ID: ${appointment.id}, Doctor: ${doctorName}, Name: ${appointment.name}, Date: ${appointment.date}, Time: ${appointment.time}`;
        appointmentsList.appendChild(li);
    });
});

// Cancel an appointment
document.getElementById('cancelForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const appointmentId = document.getElementById('appointmentId').value;
    const index = appointments.findIndex(app => app.id == appointmentId);

    if (index !== -1) {
        const appointment = appointments[index];
        const doctor = doctors.find(doc => doc.id == appointment.doctorId);
        
        if (doctor) {
            const slotIndex = doctor.bookedSlots.indexOf(appointment.time);
            if (slotIndex !== -1) {
                doctor.bookedSlots.splice(slotIndex, 1);
            }
        }

        appointments.splice(index, 1);
        alert(document.getElementById('cancelMessage').textContent = `Appointment canceled successfully! ID: ${appointmentId}`);
        loadDoctors();
    } else {
        alert(document.getElementById('cancelMessage').textContent = `Appointment ID ${appointmentId} not found.`);
    }

    document.getElementById('cancelForm').reset();
});

// Load doctors on page load
window.onload = loadDoctors;
