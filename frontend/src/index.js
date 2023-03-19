import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Edit from './components/Edit';
import NewNote from './components/NewNote';
import { MyContext } from './Context';
import './index.css';
function App() {
  const [name, setName] = useState('');
  const [jwt, setJwt] = useState('');


  return (
    <MyContext.Provider value={{name, setName, jwt, setJwt}}>
      <div className="App">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </MyContext.Provider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/new-note',
        element: <NewNote />,
      },
      {
        path: '/edit/:id',
        element: <Edit />,
      },
    ],
  },
]);

ReactDOM.render(<RouterProvider router={router} />, document.getElementById('root'));
