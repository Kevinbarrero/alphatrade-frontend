import React, { useEffect, useState } from "react";
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
    <div className="container" id="profile-container">
      <div className="row flex-sm-nowrap align-items-center">
        <div className="col-6 login-image-block">
          <img
              src="../images/profile_info.png"
              alt="login-img"
              className="login-img-card"
          />
        </div>
        <div className="col-6 login-form-block">
          <div className="card card-container">
            <p id="welcome">Profile</p>
      {!editing && (
        <div>
          <p><strong>First Name:</strong> {currentUser.firstname}</p>
          <p><strong>Last Name:</strong> {currentUser.lastname}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Status: </strong>{currentUser.status}</p>
          <button onClick={() => setEditing(true)} className="btn btn-primary btn-block btn-gradient">Update Profile</button>
        </div>
      )}
      {editing && (
        <form onSubmit={handleUpdate} className="profile-update-form">
          {error && <div>{error}</div>}
          <div>
            <div className="form-group">
            <input
              type="text"
              id="name-input"
              className="form-control"
              placeholder="Firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
            <div className="form-group">
            <input
              type="text"
              id="name-input"
              className="form-control"
              placeholder="Lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="dropdown" id="status-dropdown">
            <label htmlFor="status" className="dropdown-value">Status:</label>
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
            <div className="profile-update-buttons">
          <button type="submit" className="btn btn-primary btn-block btn-gradient" id="profile-update-submit">Save Changes</button>
          <button onClick={() => setEditing(false)} className="btn btn-primary btn-block btn-gradient-2">Cancel</button>
            </div>
          </div>
        </form>

      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

