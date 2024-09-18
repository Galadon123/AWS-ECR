import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch users using the Ingress-hosted backend
  const fetchUsers = async () => {
    try {
      // Use 'http://backend-local' as per Ingress rules
      const res = await axios.get('http://backend-local/users');
      setUsers(res.data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    try {
      // Use 'http://backend-local/users' for adding users
      await axios.post('http://backend-local/users', { name, email });
      fetchUsers();
      setName('');
      setEmail('');
    } catch (error) {
      console.log('Error adding user:', error);
    }
  };

  const updateUser = async (id) => {
    try {
      // Use 'http://backend-local/users/{id}' for updating users
      await axios.put(`http://backend-local/users/${id}`, { name, email });
      fetchUsers();
      setEditId(null);
      setName('');
      setEmail('');
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      // Use 'http://backend-local/users/{id}' for deleting users
      await axios.delete(`http://backend-local/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={editId ? () => updateUser(editId) : addUser}>
          {editId ? 'Update User' : 'Add User'}
        </button>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => { setEditId(user.id); setName(user.name); setEmail(user.email); }}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
