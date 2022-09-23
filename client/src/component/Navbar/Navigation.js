import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './Button.css';

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          Dapp Voting
          <i class='fab fa-firstdraft' />
        </Link>
        
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/Voting'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Election
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/Results'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Result
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/adminInfo'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              About
            </Link>
          </li>
        </ul>
        <Link to='../Info'>
          <button className='btn'>Info</button>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;