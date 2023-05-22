import { createGlobalStyle } from 'styled-components'

const CSSBaseGlobalStyle = createGlobalStyle`
html,
body {
  font-size: 16px;
}

html {
  height: 100%;
  width: 100%;
}


* {
  box-sizing: border-box;
}

:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #8EF42E;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: #e74c3c;
  --toastify-font-family: Jokker;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

body {
  margin: 0;
  font-family: "Jokker", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
  min-height: 100vh;
  padding: 0;
  width: 100%;
  position: relative;
  min-height: 100vh;
  scroll-behavior: smooth;
  max-width: 100vw;
  overflow-x: hidden;
  color: #ffffff;
  background: #121416;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

#__next {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: #121416;
}

select,
button {
  font-family: 'Jokker', 'Roboto', sans-serif;
  color: #17262F;
  outline: none;
  cursor: pointer;
}

input,button,a,h1,h2,h3,h4,h5 {
  font-family: 'Jokker';
  color: #ffffff;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
  outline: none;
}

select::-ms-expand {
  display: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}


input,
select,
textarea {
  margin: 0;
}

img,
video {
  height: auto;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

#main-draw-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  border-radius: 12px;
}

#main-draw-outer canvas {
  border-radius: 12px;
}

#layer-row-body canvas {
  border-radius: 2px;
}

.row-contents {
  display: flex;
  align-items: center;
}

.hue-horizontal {
  border-radius: 100px;
}

// Andrew: Gacky, but fixes our color selector.
.flexbox-fix[style*="padding-top: 16px; display: flex;"] {
}


.disable-save {
    -webkit-user-select:none;
    -webkit-touch-callout:none;
}

.aria-table-headerCell {
  padding: 5px 10px;
  outline: none;
  cursor: default;
  box-sizing: border-box;
  box-shadow: none;
  text-align: left;
}

.aria-table-headerTitle {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-inline-start: -6px;
  outline: none;
}

.aria-table-headerTitle.focus {
  outline: 2px solid orange;
}
`

export { CSSBaseGlobalStyle }
