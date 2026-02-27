const studentSelect = document.getElementById("studentSelect");
const attendanceTable = document.getElementById("attendanceTable");

// 🧠 Step 1: Load all students into dropdown
async function loadStudents() {
  const res = await fetch("http://localhost:5000/students");
  const students = await res.json();

  studentSelect.innerHTML = "<option value=''>-- Select Student --</option>";
  students.forEach(s => {
    studentSelect.innerHTML += `<option value="${s.roll_no}">${s.name} (${s.roll_no})</option>`;
  });
}

// 🗓️ Step 2: When student selected → Fetch their attendance
studentSelect.addEventListener("change", async () => {
  const roll_no = studentSelect.value;
  if (!roll_no) {
    attendanceTable.innerHTML = "";
    return;
  }

  const res = await fetch(`http://localhost:5000/attendance/${roll_no}`);
  const records = await res.json();

  if (!records || records.length === 0) {
    attendanceTable.innerHTML = "<tr><td colspan='2'>No attendance records found.</td></tr>";
    return;
  }

  attendanceTable.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Status</th>
    </tr>
  `;

  records.forEach(r => {
    const date = new Date(r.date).toLocaleDateString();
    const statusColor = r.status.toLowerCase() === "present" ? "green" : "red";
    attendanceTable.innerHTML += `
      <tr>
        <td>${date}</td>
        <td style="color: ${statusColor}; font-weight: bold;">${r.status}</td>
      </tr>
    `;
  });
});

// 🚀 Step 3: Initialize dropdown
loadStudents();
