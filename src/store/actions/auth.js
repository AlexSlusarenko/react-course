import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  }
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData,
  }
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error,
  }
};

const authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const key = 'AIzaSyC0V2TPkPCgh9J0hYZUgjuKwXRzy4PB0FI';
const signUpUrl = authUrl + 'signUp?key=' + key;
const singInUrl = authUrl + 'signInWithPassword?key=' + key;

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email, password, returnSecureToken: true,
    };

    const signInOrSingUpUrl = isSignUp ? signUpUrl : singInUrl;

    axios.post(signInOrSingUpUrl,
      authData)
      .then(response => {
        console.log(response);
        dispatch(authSuccess(response.data))
      })
      .catch(err => {
        console.log(err);
        dispatch(authFailed(err));
      });
  }
};

