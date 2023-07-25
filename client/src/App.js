import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import User from './components/User';
import Login from './components/Login';
import Main from './components/Main';
import Checkout from './components/Checkout';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import ChangePassword from './components/ChangePassword';
import SendPasswordEmail from './components/SendPasswordEmail';
import SoldOutSoon from './components/SoldOutS';
import BestSellers from './components/BestSellers';
import PhoneDetail from './components/Phones/PhoneDetail.jsx';
import { CartContext } from './components/CartContext';
import { PageStateProvider } from './components/PageStateContext';
import { useState, useEffect } from 'react';

const App = () => {
  const [cart, setCart] = useState([]);
  
  return(
    <PageStateProvider>
       <CartContext.Provider value={{ cart, setCart}}>
        <Router>
          <Routes>
              <Route path="/" element={<Main />} />
              <Route exact path="/user" element={<User />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/checkout" element={<Checkout/>} />
              <Route exact path="/signup" element={<Signup/>} />
              <Route exact path="/resetpassword" element={<ResetPassword/>} />
              <Route exact path="/change-password" element={<ChangePassword/>} />
              <Route exact path="/send-password-email" element={<SendPasswordEmail/>} />
              <Route exact path="/sold-out-soon" element={<SoldOutSoon/>} />
              <Route exact path="/best-sellers" element={<BestSellers/>} />
              <Route path="/confirm-email" element={<VerifyEmail/>} />
              <Route path="/detail/:phoneId" element={<PhoneDetail />} />
              <Route path="*" element={<Main />} /> 
          </Routes>
        </Router>
      </CartContext.Provider>
    </PageStateProvider>

  );
};

export default App;