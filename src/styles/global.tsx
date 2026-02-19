import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle<{ theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
    font-family: '${props => props.theme.fontFamily}', sans-serif;
  }
  
  html, body {
    background: transparent !important;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* Global Scrollbar Hiding */
  *::-webkit-scrollbar {
    display: none;
    width: 0px;
    height: 0px;
  }

  * {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  button {
    cursor: pointer;
    outline: 0;
  }
`;
