import styled from 'styled-components'
import {RouterProvider, Route, Routes, createBrowserRouter} from 'react-router-dom'
import Header from './components/Header'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Management from './components/Management'
import Dashboard from './components/Dashboard'

const BodyWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
`

const router = createBrowserRouter([
  {
    path: '*',
    element: <Root />,
  },
])

const HeaderNavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const CheckeredFlagBorder = styled.div`
  width: 100%;
  border-bottom: 2px solid black;
  margin: 1vh 0;
`

function Root() {
  return (
    <>
      <HeaderNavWrapper>
        <Header />
        <Nav />
      </HeaderNavWrapper>
      <CheckeredFlagBorder>
      </CheckeredFlagBorder>
      <Routes>
        <Route path='/' element={<Management />} />
        <Route path='/session/:sessionId' element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <BodyWrapper>
        <RouterProvider router={router} />
      </BodyWrapper>
    </>
  )
}

export default App
