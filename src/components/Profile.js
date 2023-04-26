import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../services/user.service";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await dispatch(updateProfile(firstName, lastName, status));
      const token = JSON.parse(localStorage.getItem("user")).token;
      const newUser = { ...updatedUser, token };
      localStorage.setItem("user", JSON.stringify(newUser));
      setEditing(false);
      window.location.reload()
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setFirstName(currentUser?.firstName);
    setLastName(currentUser?.lastName);
    setStatus(currentUser?.status);
  }, [currentUser]);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Profile</h3>
      </header>
      {!editing && (
        <div>
          <p><strong>First Name:</strong> {currentUser.firstname}</p>
          <p><strong>Last Name:</strong> {currentUser.lastname}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Status: </strong>{currentUser.status}</p>
          <button onClick={() => setEditing(true)}>Update Profile</button>
        </div>
      )}
      {editing && (
        <form onSubmit={handleUpdate}>
          {error && <div>{error}</div>}
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="working">Working</option>
              <option value="online">Online</option>
            </select>
          </div>
          <button type="submit">Save Changes</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;

