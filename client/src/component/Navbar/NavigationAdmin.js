import React, { useState } from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import './Navbar.css';

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
              to='/AddCandidate'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Candidate
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/RegisterVoter'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Voter
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
        </ul>
      </nav>
      <nav className='navAdmin'>
      <p>Admin site</p>
      </nav>
    </>
  );
}

export default Navbar;