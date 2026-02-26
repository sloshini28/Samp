const performanceTable = document.getElementById("performanceTable");

async function loadPerformance() {
  const res = await fetch("http://localhost:5000/performance");
  const data = await res.json();

  if (data.length === 0) {
    performanceTable.innerHTML = "<tr><td colspan='4'>No data available</td></tr>";
    return;
  }

  performanceTable.innerHTML = `
    <tr>
      <th>Roll No</th>
      <th>Name</th>
      <th>Attendance (%)</th>
      <th>Marks (%)</th>
    </tr>
  `;

  data.forEach(d => {
    performanceTable.innerHTML += `
      <tr>
        <td>${d.roll_no}</td>
        <td>${d.name}</td>
        <td>${d.attendance_percentage || 0}%</td>
        <td>${d.marks_percentage || 0}%</td>
      </tr>
    `;
  });
}

loadPerformance();
