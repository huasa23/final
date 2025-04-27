import styled from 'styled-components'
const FooterWrapper = styled.footer`
  padding: 1vh 1vw;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  font-family: "Play", serif;
  font-weight: 400;
  font-style: normal;
`;
export default function Footer() {
  return (
    <>
      <FooterWrapper>
            <p>All Rights Reserved by F1 &copy;</p>
      </FooterWrapper>
    </>
  )
}