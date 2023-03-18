import { Link } from "react-router-dom"

const Navbar = ()=>{
    return (
        <div className="flex justify-around m-3 border-solid shadow-md" >
            <Link to="/" > <h1 className="" >Home</h1> </Link>
            <Link to="/login" > <h1>Login</h1> </Link>
            <Link to="/register" > <h1>Register</h1> </Link>

        </div>
    )
}

export default Navbar