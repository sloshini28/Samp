const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ➕ Add Student
app.post('/add', (req, res) => {
  const { name, roll_no, course, email } = req.body;
  const sql = "INSERT INTO students (name, roll_no, course, email) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, roll_no, course, email], (err) => {
    if (err) return res.status(500).send(err);
    res.send("✅ Student Added Successfully!");
  });
});

// 📋 Get All Students
app.get('/students', (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 🗑️ Delete Student
app.delete('/delete/:id', (req, res) => {
  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("✅ Student Deleted!");
  });
});

// 🖋️ Update Student
app.put('/update/:id', (req, res) => {
  const { name, roll_no, course, email } = req.body;
  const sql = "UPDATE students SET name=?, roll_no=?, course=?, email=? WHERE id=?";
  db.query(sql, [name, roll_no, course, email, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("✅ Student Updated!");
  });
});

// ➕ Add Marks
app.post('/add-marks', (req, res) => {
  const { roll_no, physics, chemistry, maths } = req.body;
  const sql = "INSERT INTO marks (roll_no, physics, chemistry, maths) VALUES (?, ?,?, ?)";
  db.query(sql, [roll_no, physics, chemistry, maths], (err) => {
    if (err) return res.status(500).send(err);
    res.send("✅ Marks Added Successfully!");
  });
});

// 📊 Get all marks with student name
app.get('/marks', (req, res) => {
  const sql = `
    SELECT m.roll_no, s.name, m.physics, m.chemistry, m.maths
    FROM marks m
    JOIN students s ON m.roll_no = s.roll_no
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 🕒 Mark Attendance
app.post('/attendance', (req, res) => {
  const { roll_no, date, status } = req.body;
  const sql = "INSERT INTO attendance (roll_no, date, status) VALUES (?, ?, ?)";
  db.query(sql, [roll_no, date, status], (err) => {
    if (err) return res.status(500).send(err);
    res.send("✅ Attendance Marked Successfully!");
  });
});
// 📅 Get Attendance for a Student
app.get('/attendance/:roll_no', (req, res) => {
  const rollNo = req.params.roll_no;
  const sql = `
    SELECT s.name, a.date, a.status 
    FROM attendance a 
    JOIN students s ON a.roll_no = s.roll_no 
    WHERE a.roll_no = ? 
    ORDER BY a.date DESC
  `;

  db.query(sql, [rollNo], (err, rows) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).send(err);
    }
    res.json(rows);
  });
});

// 📊 View Performance Summary
app.get('/performance', (req, res) => {
  const sql = `
    SELECT 
      s.roll_no, 
      s.name,
      -- Attendance Percentage
      ROUND(
        (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.status)) * 100, 
        2
      ) AS attendance_percentage,
      -- Marks Percentage (Average of 3 subjects)
      ROUND(AVG((m.physics + m.chemistry + m.maths) / 3), 2) AS marks_percentage
    FROM students s
    LEFT JOIN attendance a ON s.roll_no = a.roll_no
    LEFT JOIN marks m ON s.roll_no = m.roll_no
    GROUP BY s.roll_no, s.name
    ORDER BY s.roll_no;
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching performance:", err);
      return res.status(500).send(err);
    }
    res.json(rows);
  });
});

// 🧑‍🏫 Register Teacher
app.post('/register', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("⚠️ Please provide both name and password!");
  }

  const sql = "INSERT INTO teachers (name, password) VALUES (?, ?)";
  db.query(sql, [name, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send("❌ Teacher already exists!");
      }
      return res.status(500).send("🚨 Database Error!");
    }
    res.send("✅ Registration Successful!");
  });
});

// 🔐 Teacher Login
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("⚠️ Please provide both name and password!");
  }

  const sql = "SELECT * FROM teachers WHERE name = ? AND password = ?";
  db.query(sql, [name, password], (err, results) => {
    if (err) return res.status(500).send("🚨 Database Error!");
    if (results.length === 0) return res.status(401).send("❌ Invalid credentials!");
    res.send("✅ Login Successful!");
  });
});


app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
