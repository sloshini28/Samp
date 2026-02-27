// Add Student (for add.html)
const addForm = document.getElementById('addForm');
if (addForm) {
  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value,
      roll_no: document.getElementById('roll_no').value,
      course: document.getElementById('course').value,
      email: document.getElementById('email').value
    };
    const res = await fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    alert(await res.text());
    addForm.reset();
  });
}

// View Students + Delete & Update (for view.html)
const studentsTable = document.getElementById('students');
if (studentsTable) {
  async function loadStudents() {
    const res = await fetch('http://localhost:5000/students');
    const students = await res.json();
    
    studentsTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>Roll</th><th>Course</th><th>Email</th><th>Actions</th></tr>";
    
    students.forEach(s => {
      studentsTable.innerHTML += `<tr>
        <td>${s.id}</td>
        <td><input type="text" id="name${s.id}" value="${s.name}"></td>
        <td><input type="text" id="roll${s.id}" value="${s.roll_no}"></td>
        <td><input type="text" id="course${s.id}" value="${s.course}"></td>
        <td><input type="email" id="email${s.id}" value="${s.email}"></td>
        <td class="actions">
          <button class="update-button" onclick="updateStudent(${s.id})">Update</button>
          <button class="delete-button" onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      </tr>`;
    });
  }

  loadStudents();

  // Delete Student
  window.deleteStudent = async (id) => {
    if(confirm("Are you sure you want to delete this student?")) {
      const res = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE'
      });
      alert(await res.text());
      loadStudents();
    }
  };

  // Update Student
  window.updateStudent = async (id) => {
    const data = {
      name: document.getElementById(`name${id}`).value,
      roll_no: document.getElementById(`roll${id}`).value,
      course: document.getElementById(`course${id}`).value,
      email: document.getElementById(`email${id}`).value
    };
    const res = await fetch(`http://localhost:5000/update/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    alert(await res.text());
    loadStudents();
  };
}
