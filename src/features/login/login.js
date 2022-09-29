import React from 'react';
import { useMoralis } from "react-moralis";
import { useNavigate } from 'react-router-dom';

import './login.scss'
import { errorToast, successToast } from '../../helper/toast'

const Login = () => {
  const navigate = useNavigate()
  const { authenticate } = useMoralis();

  const login = async () => {
    await authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        if (user) {
          navigate('/dashboard')
          successToast("You have successfully logged in.")
        }
      })
      .catch(function (error) {
        console.log(error);
        errorToast("Authentication failed")
      });
  }

  return (
    <div className="loginBody text-center">
      <main className="form-signin loginForm">
        <img className="mb-4" src="wallet-png.png" alt="" />
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <button id="btn-login" className="w-100 btn btn-lg btn-primary" type="submit" onClick={login}>Connect Wallet</button>
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </main>
    </div>
  );
}

export default Login
