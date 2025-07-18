import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaBookOpen, FaVideo, FaCubes } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  background-color: #1f1f1f;
  border-bottom: 1px solid #333;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const StyledNavLink = styled(NavLink)`
  color: #aaa;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    color: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #4a90e2;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &.active::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Logo>
        <FaBookOpen />
        K-Means 可视化教学平台
      </Logo>
      <NavLinks>
        <StyledNavLink to="/" end>
          <FaBookOpen />
          算法介绍
        </StyledNavLink>
        <StyledNavLink to="/visualize">
          <FaCubes />
          K-Means 可视化
        </StyledNavLink>
        <StyledNavLink to="/video-center">
          <FaVideo />
          视频教学中心
        </StyledNavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 