import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Checkout/Checkout.css';
import { useCart } from './CartContext';

const Checkout = () => {
 
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const handleGoBack = () => navigate(-1);

  console.log(cart);

  const increment = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].count++;
    setCart(updatedCart);
  };

  const decrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].count > 1) {
      updatedCart[index].count--;
    } else {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };
  
  const totalCount = cart.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.count, 0);
 
  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#d2c9ff" }}>
      <div className="card card-registration card-registration-2" style={{ borderRadius: "15px" }}>
        <div className="p-5">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <button className="back" onClick={handleGoBack}>Back</button>
            <h1 className="fw-bold mb-0 text-black">Checkout</h1>
          </div>
          <hr className="my-4" />
          {cart.map((item, index) => (
            <div key={index} className="row mb-4 d-flex justify-content-between align-items-center">
              <div className="col-md-3 col-lg-3 col-xl-3">
                <h6 className="text-muted">Phone</h6>
                <h6 className="text-black mb-0">Title: {item.title}</h6>
              </div>
              <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                <button className="btn btn-link px-2" onClick={() => decrement(index)}><i className="fas fa-minus">-</i></button>
                <div>{item.count}</div>
                <button className="btn btn-link px-2" onClick={() => increment(index)}><i className="fas fa-plus">+</i></button>
              </div>
              <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 className="mb-0">Price: $ {item.price * item.count}</h6>
              </div>
              <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                <a href="#!" className="text-muted" onClick={() => removeItem(index)}><i className="fas fa-times"></i></a>
              </div>
            </div>
          ))}

          <hr className="my-4" />
        </div>

        <div className="col-lg-4 bg-grey">
          <div className="p-5">
            <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex justify-content-between mb-4">
                <h6 className="text-muted">Total</h6>
                <h6>items: {totalCount}</h6>
                <h6 className="text-black">You should pay: ${totalPrice}</h6>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark btn-block btn-lg"
              data-mdb-ripple-color="dark"
            >
              <a href="http://localhost:3000/">Pay</a>
            </button>
          </div>
        </div>
      </div>
    </section>

  );
}

export default Checkout;
