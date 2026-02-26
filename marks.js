const marksForm = document.getElementById('marksForm');

if (marksForm) {
  marksForm.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      roll_no: document.getElementById('roll_no').value,
      physics: document.getElementById('physics').value,
      chemistry: document.getElementById('chemistry').value,
      maths: document.getElementById('maths').value
    };

    const res = await fetch('http://localhost:5000/add-marks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    alert(await res.text());
    marksForm.reset();
  });
}
const marksTableBody = document.querySelector('#marksTable tbody');

async function loadMarks() {
  const res = await fetch('http://localhost:5000/marks');
  const data = await res.json();

  marksTableBody.innerHTML = '';

  data.forEach(row => {
    marksTableBody.innerHTML += `
      <tr>
        <td>${row.roll_no}</td>
        <td>${row.name}</td>
        <td>${row.physics}</td>
        <td>${row.chemistry}</td>
        <td>${row.maths}</td>
      </tr>
    `;
  });
}

loadMarks();
