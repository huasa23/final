import styled from 'styled-components'
const HeaderWrapper = styled.div`
  width: 50%;
  margin: auto 0;
`
const Title = styled.h1`
font-size: calc(10px + 3vw);
  font-family: "Oxanium", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: italic;
`
const Description = styled.p`
  font-family: "Play", serif;
    font-weight: 400;
    font-style: normal;
    margin-top: -2vh;
`
export default function Header() {
  return (
    <HeaderWrapper>
      <Title>F1 Flashback</Title>
      <Description>Replay your favorite games</Description>
    </HeaderWrapper>
  )
}