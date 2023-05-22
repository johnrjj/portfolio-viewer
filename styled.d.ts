export type Color = string
export interface Colors {
  primary: string
  secondary: string
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {}
}
