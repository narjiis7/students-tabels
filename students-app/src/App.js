import React, { useEffect, useState } from "react";
import "./App.css";
function App() {
  const API_URL = "https://68a04cea6e38a02c58184c4b.mockapi.io/users";
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [editId, setEditId] = useState(null);

  // READ: جلب الطلاب
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  // CREATE: إضافة طالب جديد
  const addStudent = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    const newStudent = await res.json();
    setStudents([...students, newStudent]);
    setName("");
    setAvatar("");
  };

  // DELETE: حذف طالب
  const deleteStudent = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setStudents(students.filter((student) => student.id !== id));
  };

  // UPDATE: تعديل طالب
  const startEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setAvatar(student.avatar);
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    const updatedStudent = await res.json();
    setStudents(
      students.map((s) => (s.id === editId ? updatedStudent : s))
    );
    setEditId(null);
    setName("");
    setAvatar("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Students Table (CRUD)</h1>

      <form onSubmit={editId ? updateStudent : addStudent} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          required
        />
        <button type="submit">{editId ? "Update Student" : "Add Student"}</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>
                <img src={student.avatar} alt={student.name} width="50" height="50" />
              </td>
              <td>{student.name}</td>
              <td>{new Date(student.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => startEdit(student)} className="edit">Edit</button>
                <button onClick={() => deleteStudent(student.id)} className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;