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
            Strategies
        </h3>
      </header>
    </div>
  );
};

export default Profile;
