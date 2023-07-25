import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import jwt_decode from "jwt-decode";
import './EditProfile.css';

const EditProfile = ({  }) => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [token, setToken] = useState(''); 
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        console.log(localStorage);
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        console.log('Token:', storedToken); 
      }, [token]);

    useEffect(() => {
    if (token) {
        let decodedToken = jwt_decode(token);
        console.log("edit:", decodedToken);
        setCurrentUserId(decodedToken.userId); 
    }}, [token]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/users/${currentUserId}`);
                const data = await response.json();
                setFirstName(`${data.firstname}`);
                setLastName(`${data.lastname}`);
                setEmail(`${data.email}`);
            } catch (error) {
                console.error('Error fetching User:', error);
            }
        }; fetchUser();},[currentUserId]);
  
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const checkPassword = async (currentUserId, password) => {
        try {
            const response = await fetch('http://localhost:4000/api/checkPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentUserId, password }),
            });
    
            if (response.ok) {
                const result = await response.json();
                return result.passwordIsValid;
            } else {
                throw new Error('Password check failed');
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };
  
    const handleUpdate = async () => {
      // Check the password with the server first
      const passwordCorrect = await checkPassword(currentUserId, password);
      //console.log("password check successful");
      if (passwordCorrect) {
        // then update the profile
        console.log("password check successful");
        const response = await fetch('http://localhost:4000/api/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentUserId: currentUserId,
            firstname: firstName,
            lastname: lastName, 
            email: email
          }),
        });
        if (response.ok) {
          alert("Profile updated successfully!");
        }
      } else {
        alert("Incorrect password. Please try again.");
      }
      handleCloseDialog();
    };
  
    return (
        <div className="buttonContainer">
            <TextField  value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <TextField  value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Update Profile
                </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Password</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleUpdate}>Confirm</Button>
            </DialogActions>
            </Dialog>
        </div>
    );
  };
  
  export default EditProfile;
