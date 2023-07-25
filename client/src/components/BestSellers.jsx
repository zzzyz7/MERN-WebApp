import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { styled } from '@mui/system';

const BestSellers = ({onPhoneClick}) => {
  const [BestSellers, setBestSellers] = useState([]);
  const imageBaseUrl = "http://localhost:4000/images/";
  const RatingTypography = styled(Typography)`
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;`; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/bestSellersPhones");
        const data = await res.json();
        setBestSellers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Best Sellers
      </Typography>
      <Grid container spacing={4}>
        {BestSellers.map((phone) => (
          <Grid item key={phone._id} xs={12} sm={6} md={4}>
            <Card onClick={() => onPhoneClick(phone)}>
              <CardMedia
                component="img"
                style={{width: '100%', height: 'auto'}}
                image={imageBaseUrl + phone.image}
                alt={phone.title}
              />
              <CardContent>
                <RatingTypography variant="body2" color="text.secondary">
                  Average rating: {phone.avgRating}
                </RatingTypography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BestSellers;