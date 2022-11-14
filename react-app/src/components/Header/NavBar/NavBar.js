import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import './NavBar.css'

const NavBar = () => {
  const sessionUser = useSelector(state => state.session.user)
  console.log("SESSION USER: ", sessionUser);

  return (
    <div id='header-links'>
      <nav>
        {!sessionUser && (
          <>
            <NavLink to='/login' exact={true} activeClassName='active'>
              Login
            </NavLink>

            <NavLink to='/sign-up' exact={true} activeClassName='active'>
              Sign Up
            </NavLink>
          </>)
        }
        {sessionUser && (
          <>
            <NavLink to='/' exact={true} activeClassName='active'>
              Nav Feed
            </NavLink>
            <NavLink to='/' exact={true} activeClassName='active'>
              Explore
            </NavLink>
            <NavLink to='/' exact={true} activeClassName='active'>
              Profile
            </NavLink>
            <NavLink to='/' exact={true} activeClassName='active'>
              Nav Create Post
            </NavLink>
            <LogoutButton />
          </>)
        }
      </nav>
    </div>
  );
}

export default NavBar;
