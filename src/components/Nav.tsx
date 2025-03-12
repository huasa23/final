import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavWrapper = styled.nav`
    width: 50%;
    margin: auto 0;
`

const NavList = styled.ul`
    display: flex;
    flex-direction: row;
    margin-top: 5%;
    justify-content: flex-end;
    list-style: none;
    li:last-child {
      border-right: none;
    }
`
const NavItem = styled.li`
    border-right: 2px solid black;
    padding: 0 0.3vw;
    a:link,a:visited {
    text-align: center;
    color: black;
    text-decoration: none;
    font-family: "Moulpali", serif;
    font-weight: 400;
    font-size: calc(2px + 1vw);
    font-style: normal;
  }
`
export default function Nav() {
  return (
    <>
    <NavWrapper>
        <NavList>
            <NavItem><Link to="/">Management</Link></NavItem>
            <NavItem><Link to="/session/:sessionId">Dashboard</Link></NavItem>
        </NavList>
    </NavWrapper>
    </>
  )
}