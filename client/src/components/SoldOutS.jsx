import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { styled } from '@mui/system';


const SoldOutSoon = ({onPhoneClick}) => {
    const [SoldOutSoon, setSoldOutSoon] = useState([]);
    const imageBaseUrl = "http://localhost:4000/images/"; 
    const PriceTypography = styled(Typography)`
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/getSoldOutSoonPhones');
                const data = await res.json();  
                setSoldOutSoon(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
          <Typography variant="h5" align="center" gutterBottom>
            Sold Out Soon
          </Typography>
          <Grid container spacing={4}>
            {SoldOutSoon.map((phone) => (
              <Grid item key={phone._id} xs={12} sm={6} md={4}>
                <Card onClick={() => onPhoneClick(phone)}>
                  <CardMedia
                    component="img"
                    style={{width: '100%', height: 'auto'}}
                    image={imageBaseUrl + phone.image}
                    alt={phone.title}
                  />
                  <CardContent>
                    <PriceTypography variant="body2" color="text.secondary">
                      Price: ${phone.price}
                    </PriceTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      );
};

export default SoldOutSoon;


