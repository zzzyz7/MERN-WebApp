import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import './EditProfile.css';

function ChangePasswordContent({ }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState(''); 
    const [currentUserId, setCurrentUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const isStrongPassword = (password) => {
        const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
        return regex.test(password);
    };

    useEffect(() => {
        console.log(localStorage);
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        console.log('Token:', storedToken); 
      }, [token]);

    useEffect(() => {
    if (token) {
        let decodedToken = jwt_decode(token);
        setCurrentUserId(decodedToken.userId); 
    }}, [token]);

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (!isStrongPassword(newPassword)) {
            setError("Your password must have a minimum of 8 characters including a capital letter, a lower-case letter, a number and a symbol.");
            return;
        }

        console.log(currentUserId);
        try {
            const response = await fetch('http://localhost:4000/api/changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    currentPassword,
                    newPassword,
                }),
            });
            // Handle successful password change
            if (response.ok) {
                alert("Password updated successfully!");
              }
            else {
              alert("Incorrect password format. Please try again.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="buttonContainer">
            <TextField label = "Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <TextField label = "New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button variant="contained" onClick={handleChangePassword}>
                Confirm
            </Button>
        </div>
    );
}

export default ChangePasswordContent;
