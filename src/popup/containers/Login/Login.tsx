import './styles.scss';

import React from 'react';

import { useNavigate } from 'react-router-dom';

import { emailPattern } from '../../../utils/utils';
import Assets from '../../assets';
import Header from '../../components/Header/Header';
import { setIsLoggedIn, setToken } from '../../context/reducers/appReducer';
import {
  setFilterEffect,
  toggleExtension,
} from '../../context/reducers/settingsReducer';
import { useAppDispatch, useAppSelector } from '../../hooks/context';
import ROUTES from '../../types/routes';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { apiEndpoint } = useAppSelector(state => state.app);

  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const _onLogin = async (email: string, password: string) => {
    if (!email || !emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiEndpoint}/login-extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      const { token, isExtensionEnabled, imageFilterMode } = data.result;

      if (!token) {
        setError('An error occurred. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Save values to reducer
      dispatch(setToken(token));
      dispatch(setFilterEffect(imageFilterMode));
      dispatch(toggleExtension(isExtensionEnabled));

      dispatch(setIsLoggedIn(true));

      // Redirect to home
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  const _onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    _onLogin(email, password);
  };

  return (
    <div className="popup-login-container">
      <Header />
      <div className="popup-inner">
        <h1>Welcome to KidShield</h1>
        <img className="login-image" src={Assets.images.login} alt="login" />
        <form className="login-form" onSubmit={_onSubmitHandler}>
          <div className="input-box">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter Your Email"
            />{' '}
            <i>Email</i>
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              required
              placeholder="Enter Your Password"
            />{' '}
            <i>Password</i>
          </div>
          <a
            className="forgot-password"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            Forgot Password?
          </a>
          <div className="button-container">
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary" disabled={isLoading}>
              Login
            </button>
          </div>
          <div className="signup">
            Not signed up?{' '}
            <a href="https://github.com" target="_blank" rel="noreferrer">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
