import { createGlobalStyle } from 'styled-components'

const CSSResetsGlobalStyle = createGlobalStyle`
html,
body,
p,
ol,
ul,
li,
dl,
dt,
dd,
blockquote,
figure,
fieldset,
legend,
textarea,
pre,
iframe,
hr,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

ul {
  list-style: none;
}

button,
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
`

export { CSSResetsGlobalStyle }
