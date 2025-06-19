import { Link } from "react-router-dom"

const Unauthorize = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1>Oppos You Are Not a Register User Please <Link to="/register">Sign-Up</Link> and <Link>Login</Link> !</h1>
    </div>
  )
}

export default Unauthorize
