import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Fragment } from 'react';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';

export default function NavBar() {

  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser({
      name: "",
      token: "",
    })
    window.location.reload();
  };

  if(user.auth){

    return (
      <Navbar fluid rounded>
        <Navbar.Brand href="#">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          NoteMesh
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.name}
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              Log out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link href="/" active>
            My Notes
          </Navbar.Link>
          <Navbar.Link href="/new-note">
            Create New Note
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )

  }else{

    return(
      <Navbar fluid rounded>
        <Navbar.Brand href="https://flowbite.com/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            NoteMesh
          </span>
        </Navbar.Brand>
        
        <Navbar.Collapse className="px-8">
          <Navbar.Link href="/login">
            Login
          </Navbar.Link>
          <Navbar.Link href="/register">
            Sign Up
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  
}