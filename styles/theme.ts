import type { DefaultTheme } from 'styled-components'

function colors(darkMode: boolean) {
  return {
    primary: 'TODO',
    secondary: 'TODO',
  }
}

function getTheme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),
  }
}

const darkTheme = getTheme(true)

export { darkTheme }
