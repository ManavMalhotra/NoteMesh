const Login = ()=>{
    return(
        <div className="">
            <h1 className="font-bold text-3xl font-sans bg-white rounded px-8 pt-6 pb-8 mb-4">Login</h1>
            
            <div className="px-3 py-3">
                <label className="block text-gray-700 font-bold mb-2">
                    User Name: 
                </label>
                <input  type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="px-3 py-3">
                <label className="block text-gray-700 font-bold mb-2">
                    Password: 
                </label>
                <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>


            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Sign In</button>
        </div>
    )
}

export default Login