import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardContent } from '@mui/material';


function SendPasswordEmail() { 
    const navigate = useNavigate(); 
    const handleButtonClick = () => {
        navigate("/login");
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
                The Email has been sent Successfully!
            </Typography>
            <Divider sx = {{mb: 3}}/>
            <Box component="form" onSubmit={handleButtonClick} noValidate sx = {{ mt: 1 }}>
                    <Button 
                        type = "submit" 
                        value = "Login" 
                        fullWidth variant="contained" 
                        color = "primary"
                        sx={{ mt: 3, mb: 2 }}> Sign In
                    </Button>
                <Typography variant = "caption" display = "block" align = "center">
                    <a href="http://localhost:3000/signup">Back to sign up</a>
                </Typography>
            </Box>
            </CardContent>
            </Card>
        </Container>
    </div>
)
};


export default SendPasswordEmail;