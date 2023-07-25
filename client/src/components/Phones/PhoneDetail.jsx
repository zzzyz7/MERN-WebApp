import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Collapse } from '@mui/material';
import { CartContext } from '../CartContext';
import jwt_decode from "jwt-decode";

const PhoneDetail = ({ phone }) => {
    const [sellerName, setSellerName] = useState('');
    const [reviewerNames, setReviewerNames] = useState([]);
    const [displayedReviews, setDisplayedReviews] = React.useState(3);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const { cart, setCart, getItemCount } = useContext(CartContext);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [token, setToken] = useState(''); 
    const [currentUserId, setCurrentUserId] = useState(null);
    const [hiddenComments, setHiddenComments] = useState({});
    const [openStates, setOpenStates] = useState({});

    useEffect(() => {
        console.log(localStorage);
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        console.log('Token:', storedToken); 
      }, []);
    
      useEffect(() => {
        if (token) {
            let decodedToken = jwt_decode(token);
            console.log(decodedToken);
            setCurrentUserId(decodedToken.userId); 
        }
    }, [token]);
   
    const isReviewerOrSeller = (reviewerId, sellerId) => {
        return currentUserId === reviewerId || currentUserId === sellerId;
    };

    const toggleOpen = (index) => {
        setOpenStates({
          ...openStates,
          [index]: !openStates[index],
        });
      };

    const toggleHidden = (index) => {
        setHiddenComments({
            ...hiddenComments,
            [index]: !hiddenComments[index],
        });
    };

    const showMoreReviews = () => {
        setDisplayedReviews(displayedReviews + 3);
    };

    const handleOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = () => setOpenDialog(false);

    const handleQuantityChange = (event) => setQuantity(event.target.value);

    const handleOpenCommentDialog = () => setOpenCommentDialog(true);

    const handleCloseCommentDialog = () => setOpenCommentDialog(false);

    const handleAddToCart = () => {
        if (parseInt(quantity) > phone.stock) {
            alert("The quantity entered exceeds the available stock.");
            return;
        }

        const quantityValue = Number.isInteger(parseInt(quantity)) && parseInt(quantity) > 0 ? parseInt(quantity) : 0;
        const newItem = {
            title: phone.title,
            price: phone.price,
            count: quantityValue, // the quantity entered
        };

        const existingItemIndex = cart.findIndex(item => item.title === newItem.title);
        const updatedCart = [...cart];

        if (existingItemIndex !== -1) {
            const updatedItem = { ...updatedCart[existingItemIndex] };
            updatedItem.count += newItem.count;
            updatedCart[existingItemIndex] = updatedItem;
        } else {
            updatedCart.push(newItem);
        }

        setCart(updatedCart);
        // console.log(cart);
        handleCloseDialog();
    };

    const submitComment = async () => {
        if (!token){
            alert("Please login first!");
            return;
        }
        if (rating > 5 || rating < 1) {
            alert("The rating can only between 1 to 5");
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneId: phone._id,
                    comment,
                    rating,
                    token
                }),
            });
            if (response.ok) {
                handleCloseCommentDialog();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/users/${phone.seller}`);
                const data = await response.json();
                setSellerName(`${data.firstname} ${data.lastname}`);
            } catch (error) {
                console.error('Error fetching seller:', error);
            }
        };

        const fetchReviewers = async () => {
            try {
              if (phone.reviews && Array.isArray(phone.reviews)) {
                const reviewerIds = phone.reviews.map((review) => review.reviewer);
                const reviewerNames = [];
        
                for (const reviewerId of reviewerIds) {
                  const response = await fetch(`http://localhost:4000/api/users/${reviewerId}`);
                  const data = await response.json();
                  const reviewerName = `${data.firstname} ${data.lastname}`;
                  reviewerNames.push(reviewerName);
                //   console.log(reviewerId);
                }
                setReviewerNames(reviewerNames);
              }
            } catch (error) {
              console.error('Error fetching reviewers:', error);
            }
          };
          fetchSeller();
          fetchReviewers();
        }, [phone.seller, phone.reviews]);

    const imageBaseUrl = "http://localhost:4000/images/";
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                style={{width: '100%', height: 'auto'}}
                image={imageBaseUrl + phone.image}
                alt={phone.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {phone.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {phone.brand}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Available stock: {phone.stock}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Seller: {sellerName}
                </Typography>
                <Typography variant="h6" color="text.primary">
                    Price: ${phone.price}
                </Typography>
                
                {phone.reviews && phone.reviews.slice(0, displayedReviews).map((review, index) => (
                    <Box key={index}>
                         <Typography variant="h6" color="text.primary">
                            {reviewerNames[index]}
                        </Typography>
                        <Rating name="read-only" value={review.rating} readOnly />
                        <Typography variant="body2" color={hiddenComments[index] ? "text.secondary" : "text.primary"}>
                            Comment: {review.comment.slice(0, 200)}
                            <Collapse in={openStates[index]}>
                                {review.comment.slice(200)}
                            </Collapse>
                        </Typography>
                        {review.comment.length > 200 && (
                            <Button onClick={() => toggleOpen(index)}>
                                {openStates[index]  ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                        {isReviewerOrSeller(review.reviewer, phone.seller) && (
                            <Button onClick={() => toggleHidden(index)}>
                                {hiddenComments[index] ? 'Show Comment' : 'Hide Comment'}
                            </Button>
                        )}
                    </Box>
                ))}
                 {phone.reviews && phone.reviews.length > displayedReviews && (
                    <Button onClick={showMoreReviews}>
                        Show More
                    </Button>
                )}
            </CardContent>

            <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
                Add to Cart
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add to Cart</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the quantity you want to add to the cart.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="quantity"
                        label="Quantity"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddToCart}>Add</Button>
                </DialogActions>
            </Dialog>
            <Button variant="outlined" color="primary" onClick={handleOpenCommentDialog}>
                Add a Comment
            </Button>
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
                <DialogTitle>Add a Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your comment and rating.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment"
                        label="Comment"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="rating"
                        label="Rating"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog}>Cancel</Button>
                    <Button onClick={submitComment}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default PhoneDetail;
