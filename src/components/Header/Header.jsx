import { NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import './Header.css';
import { useAuth } from '../../context/AuthContext'; // Điều chỉnh đường dẫn
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const Header = () => {
    const { userData, isAuthenticated } = useAuth();
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
      <div className={isScrolled ? 'header scrolled' : "header"}>
        <div className="container-header">
          <div className="logo">
            <a href="/" className="logo-myqrcode">
              <img src="logo2.png" alt="" className='logo-myqrcode-img' />
            </a>
          </div>
          <div >
              <NavLink to="/qrs">
                  <button className="click-dark-light">ListQR</button>
                </NavLink>
          
          </div>
          <div className="dark-light">
            {isAuthenticated ? (
              <div className="user-info">
                <NavLink to="/Dashboard">
                  {/* <button className="click-dark-light">Đăng xuất</button> */}
                  <Avatar size={50} icon={<UserOutlined />} className="avatar"  /> {/* Sử dụng avatar từ userData */}
                  {userData.name}
                </NavLink>
              </div>
            ) : (
              <NavLink to="/login"> 
                <button className="click-dark-light">Đăng nhập</button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    );
}

export default Header;
