import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #593D29; /* Rich brown from the logo */
    --secondary-color: #8B6E4E; /* Lighter brown for accents */
    --accent-color: #C5AA6A; /* Gold accent */
    --bg-color: #F5F1E8; /* Light beige background */
    --text-color: #3A2E24; /* Dark brown text */
    --tile-bg: #E8E1D5; /* Beige tile background */
    --tile-hover: #DFD5C3; /* Slightly darker beige for hover state */
    --tile-selected: #8B6E4E; /* Brown for selected state */
    --team1-color: #593D29; /* Primary brown */
    --team2-color: #7D5A44; /* Medium brown for second team */
    --header-height: 80px;
    --footer-height: 80px;
    --border-radius: 8px;
    --modal-bg: rgba(89, 61, 41, 0.9); /* Semi-transparent brown */
    --modal-content-bg: #F5F1E8; /* Light beige modal background */
    --lifeline-color: #C5AA6A; /* Gold/brown for lifelines */
    --lifeline-used: #A99B85; /* Muted brown for used lifelines */
    --container-max-width: 1200px;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
    --transition-fast: 0.2s;
    --transition-medium: 0.3s;
    --transition-slow: 0.5s;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  body {
    font-family: 'Cairo', 'Tajawal', 'Roboto', 'Helvetica Neue', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    overflow-x: hidden;
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  body[dir="rtl"] {
    font-family: 'Cairo', 'Tajawal', sans-serif;
  }

  /* Improve scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--tile-bg);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: var(--border-radius);
    padding: 10px 18px;
    font-family: inherit;
    background-color: var(--primary-color);
    color: white;
    transition: all var(--transition-medium) ease-in-out;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  input, textarea, select {
    font-family: inherit;
    padding: 12px 16px;
    border: 1px solid var(--tile-hover);
    border-radius: var(--border-radius);
    width: 100%;
    font-size: 1rem;
    background-color: #FFFFFF;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(89, 61, 41, 0.2);
    }
    
    &::placeholder {
      color: #999;
      opacity: 0.8;
    }
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--secondary-color);
      text-decoration: underline;
    }
  }

  /* Improved focus states for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.3;
    margin-bottom: 0.5em;
    font-weight: 700;
    color: var(--primary-color);
  }

  p {
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 20px;
    
    @media (max-width: 768px) {
      padding: 0 16px;
    }
    
    @media (max-width: 480px) {
      padding: 0 12px;
    }
  }

  /* Animation keyframes for various effects */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  /* Helper classes */
  .animate-fadeIn {
    animation: fadeIn var(--transition-medium) ease forwards;
  }
  
  .animate-slideUp {
    animation: slideUp var(--transition-medium) ease forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }

  @media (max-width: 768px) {
    :root {
      --header-height: 60px;
      --footer-height: 60px;
      --border-radius: 6px;
    }
    
    button {
      padding: 8px 16px;
    }
  }
  
  @media (max-width: 480px) {
    :root {
      --header-height: 50px;
      --border-radius: 5px;
    }
    
    button {
      padding: 8px 12px;
      font-size: 0.9rem;
    }
  }
`; 