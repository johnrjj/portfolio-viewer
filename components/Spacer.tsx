import { memo } from 'react'
import styled from 'styled-components'

export interface SpacerProps {
  size: number | undefined
}

const SpacerDiv = styled.div<SpacerProps>`
  height: ${(props) => props.size ?? 16}px;
  min-height: ${(props) => props.size ?? 16}px;
`

const Spacer: React.FC<{
  size: number | undefined
}> = (props) => {
  return <SpacerDiv {...props} />
}

const SpacerMemo = memo(Spacer)

export { SpacerMemo as Spacer }
