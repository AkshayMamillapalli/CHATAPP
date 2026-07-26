import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";
import shushing from "../assets/shushing.webp";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get("/api/admin/users", config);

      setUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load users");
    }
  };

  const deleteUser = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/admin/users/${id}`, config);

    setUsers(users.filter((user) => user._id !== id));

    toast.success("User deleted successfully");
  } catch (error) {
    toast.error("Failed to delete user");
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase()) ||
  user.email.toLowerCase().includes(search.toLowerCase())
);

const handleLogout = () => {
  localStorage.removeItem("userInfo");
  toast.success("Logged out successfully");
  navigate("/");
};

  return (
    <div className="admin-container">
        <div className="admin-logo">
            <img src={shushing} alt="Logo" className="admin-logo-img" />
            <h2 className="admin-logo-title">Usshhh!</h2>
        </div>
        <div className="admin-header">
            <div>
                <h1>Admin Dashboard</h1>
                <p className="admin-name">
                Welcome, <strong>{userInfo.name}</strong>
                </p>
        </div>

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>
        <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
/>
      {loading ? (
        <h3 className="loading-text">Loading...</h3>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>

                <td>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;