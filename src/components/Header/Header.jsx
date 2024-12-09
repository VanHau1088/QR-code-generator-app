// import { NavLink } from "react-router-dom";

import { useEffect, useState } from 'react';
import './Header.css'
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
      };
      window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
         };
        }, []);  

    return (
      // <header className={scrollPosition > 50 ? 'header-scrolled' : 'header'}> {/* Nội dung header */} 
        <div className={isScrolled ? 'header scrolled' : "header"}>
          <div className="container-header">
              <div className="logo">
                <a href="/" className="logo-myqrcode">
                    <img src="logo2.png" alt="" className='logo-myqrcode-img' />
                </a>
              </div>
              <div className="dark-light">
                <button className="click-dark-light">Trợ giúp</button>
              </div>
          </div>
        </div>

  // </header>
    
    );
  }
  
  export default Header;
  

  