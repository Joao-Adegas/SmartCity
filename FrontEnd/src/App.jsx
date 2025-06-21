import { BrowserRouter,Routes,Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './components/Layout/Layout'
import Sensores from './pages/Sensores/Sensores'
import Ambientes from './pages/Ambientes/Ambientes'
import Historicos from './pages/Historicos/Historicos'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>} />
        <Route element={<Layout/>}>
          <Route path="/Inicial" element={<Dashboard/>} />
          <Route path="/Sensores" element={<Sensores/>} />
          <Route path="/Ambientes" element={<Ambientes/>} />
          <Route path="/Históricos" element={<Historicos/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
