import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Menu.css'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";

function Menu() {

    const [opacity, setOpacity] = useState(1);

    const changeNavbarOpacity = () => {
        if (window.scrollY >= 80) {
            setOpacity(0.3);
        }
        else {
            setOpacity(1);
        }
    };

    window.addEventListener('scroll', changeNavbarOpacity);

    return (
        <Navbar collapseOnSelect expand="lg" style={{
            opacity: `${opacity}`
        }} className='position-fixed w-100 menu p-0' >
            <Container className='py-2'>
                <Link className="navbar-brand d-flex align-items-center " to="/">
                    Waterpoint Monitoring System
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse className='justify-content-end' id="responsive-navbar-nav">
                    <Nav className="justify-content-end">
                        <Link className="nav-link text-black" to="/visualization" >Monitoring</Link>
                        <Link className="nav-link text-black" to="/aboutUs" >About Us</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Menu;