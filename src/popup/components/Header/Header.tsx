import './styles.scss';

import React from 'react';

import Assets from '../../assets';

interface Props {
  canGoBack?: boolean;
}

const Header: React.FC<Props> = ({ canGoBack = false }) => {
  return (
    <div className="popup-header">
      <div
        className="popup-header__logo"
        role="button"
        aria-label={canGoBack ? 'Go back' : 'KidShield'}
        aria-disabled={!canGoBack}
        onClick={() => {
          if (canGoBack) {
            window.history.back();
          }
        }}
        style={{
          cursor: canGoBack ? 'pointer' : 'default',
        }}
      >
        {canGoBack && (
          <div className="popup-header__back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
              <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
            </svg>
          </div>
        )}
        <img src={Assets.images.logo} alt="logo" />
        <h2>
          Kid<span>Shield</span>
        </h2>
      </div>
      <div
        role="button"
        aria-label="Close"
        className="popup-header__close"
        onClick={() => {
          window.close();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    </div>
  );
};

export default Header;
