import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/users', {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (id, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: value } : u))
    );
  };

  const handleSubscriptionChange = (id, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, subscriptionStatus: value } : u))
    );
  };

  const handleUpdate = async (user) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/admin/users/${user.id}`,
        {
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
        },
        { withCredentials: true }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Manage Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="border p-2 mb-2 flex space-x-2 items-center">
            <span className="flex-1">{user.username}</span>
            <select
              className="border p-1"
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="subscriber">subscriber</option>
              <option value="admin">admin</option>
            </select>
            <select
              className="border p-1"
              value={user.subscriptionStatus || 'inactive'}
              onChange={(e) =>
                handleSubscriptionChange(user.id, e.target.value)
              }
            >
              <option value="inactive">inactive</option>
              <option value="active">active</option>
            </select>
            <button
              className="bg-blue-500 text-white px-2 py-1"
              onClick={() => handleUpdate(user)}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminUsers, 'admin');

