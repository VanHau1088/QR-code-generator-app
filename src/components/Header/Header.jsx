import { NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import './Header.css';
import { useAuth } from '../../context/AuthContext'; // Điều chỉnh đường dẫn
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import Select from 'react-select';

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

        const {t, i18n} = useTranslation();
        const [language, setLanguage] = useState(i18n.language);
        console.log(language);
        console.log(t);
        useEffect(() => {
          setLanguage(i18n.language);
        }, [i18n.language]);
      
        const options = [
          { value: 'vi', label: 'Tiếng Việt' },
          { value: 'en', label: 'Tiếng Anh' },
          { value: 'cn', label: 'Tiếng Trung' }
        ];

        
    const customStyles = {
      select: (provided, state) => ({
        ...provided,
        fontSize: state.isSelected? '13px':'13px' , // Độ mạnh chữ
        border: state.isSelected ?'#5D82D5' : '#5D82D5',
      }),

      option: (provided, state) => ({
        ...provided,
        
        backgroundColor: state.isSelected ? '#5D82D5' : '#5D82D5', // Màu nền cho option
        fontSize: state.isSelected? '13px':'13px' , // Độ mạnh chữ
        border: state.isSelected ?'#5D82D5' : '#5D82D5',
        color: state.isSelected ? 'white' : 'white', // Màu chữ
        ':hover': {
          backgroundColor: '#3A5FAA', // Màu nền khi hover
        },
      }),
    };
        
      
        const handleChange = (selectedOption) => {
          const selectedLanguage = selectedOption.value;
          i18n.changeLanguage(selectedLanguage);
          setLanguage(selectedLanguage);
        };
      

    return (
      <div className={isScrolled ? 'header scrolled' : "header"}>
        <div className="container-header">
          <div className="logo">
            <a href="/" className="logo-myqrcode">
              <img src="logo2.png" alt="" className='logo-myqrcode-img' />
            </a>
          </div>
          {/* <div >
              <NavLink to="/qrs">
                  <button className="click-dark-light">ListQR</button>
                </NavLink>
          
                <NavLink to="/Analyze">
                  <button className="click-dark-light">Analyze</button>
                </NavLink>
                      
                <NavLink to="/Sidebar">
                  <button className="click-dark-light">Sidebar</button>
                </NavLink>

          </div> */}

          {/* <div >
              <NavLink to="/Analyze">
                </NavLink>
          </div> */}

          {/* <select className="select " onChange={handleChange}>
            <option className="optine" value="vi">Tiếng Việt</option>
            <option className="optine" value="en">Tiếng Anh</option>
          </select> */}

           <Select
           className="select"
            options={options}
            styles={customStyles}
            value={options.find(option => option.value === language)}
            onChange={handleChange}
          /> 


          <div className="dark-light">
            {isAuthenticated ? (
              <div className="user-info">
                <NavLink to="/Sidebar">
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
