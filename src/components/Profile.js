import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    console.log(currentUser)
    return <Navigate to="/login" />;
  }
 
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          Profile
        </h3>
      </header>
      <p>
        <strong>Firstname:</strong> {currentUser.firstname}
      </p>
      <p>
        <strong>Lastname:</strong> {currentUser.lastname}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
    </div>
  );
};

export default Profile;
