import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import { Card, CardContent, Typography } from '@mui/material';


const ManageListingsContent = () => {
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState(''); 
    const [image, setImage] = useState(''); 
    const [stock, setStock] = useState(''); 
    const [price, setPrice] = useState(''); 
    const [currentUserId, setCurrentUserId] = useState('');
    const [token, setToken] = useState('');
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);

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
        if (currentUserId) {
          fetch(`http://localhost:4000/api/user/${currentUserId}/listings`)
            .then(response => response.json())
            .then(data => setListings(data))
            .catch(error => console.error('Error:', error));
        }
      }, [currentUserId]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        switch (id) {
            case "title":
                setTitle(value);
                break;
            case "brand":
                setBrand(value);
                break;
            case "image":
                setImage(value);
                break;
            case "stock":
                setStock(value);
                break;
            case "price":
                setPrice(value);
                break;
            default:
                break;
        }
    };

    const handleAddListing = async (event) => {
        if (title.trim() === '' || brand.trim() === '' || image.trim() === '' || isNaN(stock) || stock < 0 || isNaN(price) || price < 0){
            alert("Invalid input, Title is required, Brand is required, Image should be the picture like apple.jpg, Stock and Price must be a non-negative number,");
        }
        event.preventDefault();
        try { 
        const response = await fetch('http://localhost:4000/api/upload-phones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title, brand, image, stock, seller:currentUserId, price}),
        });
        if (response.ok) {
            alert("Updated successfully!");
          }
        else {
          alert("Update fail!");
        }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRemoveListing = async (event) => {
     
    };


    return (
        <div className="buttonContainer">
            <TextField 
                id="title"
                label="Title"
                value={title}
                onChange={handleInputChange}
            />
            <TextField 
                id="brand"
                label="Brand"
                value={brand}
                onChange={handleInputChange}
            />
            <TextField 
                id="image"
                label="image"
                value={image}
                onChange={handleInputChange}
            />
            <TextField 
                id="stock"
                label="Stock"
                type="number"
                value={stock}
                onChange={handleInputChange}
            />
            <TextField 
                id="price"
                label="Price"
                type="number"
                value={price}
                onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" onClick={handleAddListing}>
                Add Listing
            </Button>
            <h2>Your Listings</h2>
            {listings.map(listing => (
                 <Card variant="outlined" style={{ marginBottom: '10px' }}>
                 <CardContent>
                   <Typography variant="body1" color="text.secondary">
                        Title: {listing.title}
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                        Brand: {listing.brand}
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                        Image: {listing.image}
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                        Stock: {listing.stock}
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                        Price: {listing.price}
                   </Typography>
                 </CardContent>
               </Card>
            ))}
        </div>
    );
};

export default ManageListingsContent;

