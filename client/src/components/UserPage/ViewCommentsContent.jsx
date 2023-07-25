import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Card, CardContent, Typography } from '@mui/material';

function ShowComments() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/api/comments/?id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setComments(data.comments);
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }, [userId, token]);

  return (
    <div>
      <Typography variant="h4" component="div" gutterBottom>
        User Comments
      </Typography>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Card variant="outlined" style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                Rating: {comment.rating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comment: {comment.comment}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No comments to show.</p>
      )}
    </div>
  );
}

export default ShowComments;

