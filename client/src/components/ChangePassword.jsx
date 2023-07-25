import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardContent } from '@mui/material';

export default function ChangePassword() {
  const [token, setToken] = useState(''); // We'll set this from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set the token from the URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token');
    setToken(urlToken);
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword === '' || confirmPassword === '') {
        setMessage('Password cannot be empty!');
        return;
    }

    if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token, // use the state variable here
          newPassword
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || "An error occurred");
      }
      else{
        navigate('/send-password-email');
      }
    }   catch (error) {
        setError(error.message);
    }
  };

  return (
    <div className="content">
      <Container component="main" maxWidth="xs">
        <Card>
          <CardContent style={{ padding: "30px" }}>
            <Typography 
              variant="h4"
              align="center"
              sx={{ mb: 3 }}
            >
              Reset Password
            </Typography>
            <Typography 
              align="center"
              sx={{ mb: 3 }}
            >
              Please enter your new password below.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="New password" 
                required
              />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password" 
                required
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
            {message && <p>{message}</p>}
          </CardContent>
        </Card>
      </Container>
    </div>
  );

//   return (
//     <form onSubmit={handleSubmit}>
//       <h1>Reset Password</h1>
//       <input 
//         type="password" 
//         value={newPassword} 
//         onChange={e => setNewPassword(e.target.value)} 
//         placeholder="New password" 
//         required
//       />
//       <button type="submit">Submit</button>
//       {message && <p>{message}</p>}
//     </form>
//   );
}