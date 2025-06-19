import { Outlet } from "react-router-dom"
import NavBar from "./Sheared/NavBar"





function App() {



 

  return (

    <div>
     
      <NavBar/>
<Outlet></Outlet>
    </div>

  )
}

export default App
