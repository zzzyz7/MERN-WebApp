import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { CardContent } from '@mui/material';

export default function ResetPassword(){

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/reset-password-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const responseData = await response.json();
        console.log(responseData);
            if (response.ok) {
                navigate("/send-password-email");
            } else {
                //error handler
                setError(responseData.message || "An error occurred");
            }
        setMessage(responseData.message);
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    };
       
    return (
        <div className="content">
            <Container component="main" maxWidth="xs">
                <Card>
                <CardContent style = {{padding: "30px"}}>
                <Typography variant = "h4" 
                            display = "flex" 
                            alignItems = "center" 
                            justifyContent = "center"
                            sx = {{mb: 3}}>
                                Reset Password
                </Typography>
                <Typography display = "flex" align = "center" justifyContent = "center" sx = {{mb: 3}}>
                    Please enter your email address to request a password reset
                </Typography>
                <Divider sx = {{mb: 3}}/>
                <Box component="form" onSubmit={handleSubmit} noValidate sx = {{ mt: 1 }}>
                    <TextField
                    margin = "normal"
                    required
                    fullWidth
                    id = "email"
                    label = "Email Address"
                    name = "email"
                    autoComplete = "email"
                    value = {email}
                    autoFocus
                    onChange={e => setEmail(e.target.value)}
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Button 
                    type = "submit" 
                    value = "Login" 
                    fullWidth variant="contained" 
                    color = "primary"
                    sx={{ mt: 3, mb: 2 }}> Reset Password
                    </Button>
                    <Typography variant = "caption" display = "block" align = "center">
                        <a href="http://localhost:3000/login">Back to login</a>
                    </Typography>
                </Box>
                </CardContent>
                </Card>
            </Container>
        </div>
    )
};
