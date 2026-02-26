const form = document.getElementById('attendanceForm');
const rollSelect = document.getElementById('roll_no');

// Load all students into dropdown
async function loadStudents() {
  const res = await fetch('http://localhost:5000/students');
  const students = await res.json();
  students.forEach(s => {
    const option = document.createElement('option');
    option.value = s.roll_no;
    option.textContent = `${s.roll_no} - ${s.name}`;
    rollSelect.appendChild(option);
  });
}

loadStudents();

// Submit attendance
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    roll_no: rollSelect.value,
    date: document.getElementById('date').value,
    status: document.querySelector('input[name="status"]:checked').value
  };

  const res = await fetch('http://localhost:5000/attendance', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  alert(await res.text());
  form.reset();
});
