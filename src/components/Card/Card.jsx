import './Card.css'
import Header from "../Header/Header";
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import { toPng } from 'html-to-image';
import { useTranslation } from "react-i18next";
const Card = () => {
  const {t} = useTranslation();
  const {userData} = useAuth();
  const [project, setProject] = useState('');
  const [name, setName] = useState('');
  // Vcard
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [job, setJob] = useState('');


  // Kiểu mã QR
  const [dotType, setDotType] = useState('rounded');
  // Maù mã QR
  const [dotColor, setDotColor] = useState('#00000');
  const[bgColor, setBgColor] = useState('#FFFF');
  // Kiểu góc khung góc
  const [cornerSquareType, setCornerSquareType] = useState('extra-rounded'); 
  // Màu khung góc
  const [bgSquareType, setBgCornerSquareType] = useState('#00000')
  // Kiểu chấm góc 
  const [cornerDotType, setCornerDotType] = useState('dot');
// Màu chấm góc 
  const [bgDotType, setBgDotType] = useState('#00000')

  const LogoTypes = ['Facebook', 'Gmail', 'Instagram', 'Linkedin', 'Netflix', 'Outlook', 'Pinterest', 'TikTok', 'Twitter', 'Whatsapp', 'Youtube', 'Apple']; 
  // const [logo, setLogo] = useState(`src/assets/Image/LogoType/${LogoTypes[0]}.svg`);
  const [logo, setLogo] = useState(null);
  // Download
  const [download, setDownload] = useState('png');

  const [shortUrl, setShortUrl] = useState(''); 
  const [isCreatingQRCode, setIsCreatingQRCode] = useState(false);


  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessageURL, setErrorMessageURL] = useState('');

  const urlRegex = /^\+?[0-9]\d{1,14}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const urlRegex2 = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setPhoneNumber(inputText);
    
    // Kiểm tra tính hợp lệ của URL
    if (urlRegex.test(inputText)) {
        setIsValid(true);
        setErrorMessage('');
    } else {
        setIsValid(false);
        setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
    }
};


const handleInputChangeEmail = (e) => {
  const inputText = e.target.value;
  setEmail(inputText);
  
  // Kiểm tra tính hợp lệ của URL
  if (emailRegex.test(inputText)) {
      setIsValid(true);
      setErrorMessageEmail('');
  } else {
      setIsValid(false);
      setErrorMessageEmail('Email không hợp lệ. Vui lòng nhập lại.');
  }
};


const handleInputChangeURL = (e) => {
  const inputText = e.target.value;
  setWebsite(inputText);
  
  // Kiểm tra tính hợp lệ của URL
  if (urlRegex2.test(inputText)) {
      setIsValid(true);
      setErrorMessageURL('');
  } else {
      setIsValid(false);
      setErrorMessageURL('URL không hợp lệ. Vui lòng nhập lại.');
  }
};





  const qrRef = useRef(null);
  const qrCode = useRef(new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 10,
    data: `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nTEL:${phoneNumber}\nEMAIL:${email}\nURL:${website}\nTITLE:${job}\nADR:${address}:\nEND:VCARD`,
    dotsOptions: {
      color: dotColor,
      type: dotType,
    },
    backgroundOptions:{
      color: bgColor,
    },
    cornerSquareOptions:{
      type: cornerSquareType,
      color: bgSquareType,
    },
    cornersDotOptions:{
      type: cornerDotType,
      color: bgDotType,
    },
    image: logo,
    imageOptions:{
      crossOrigin: 'anonymous',
      margin: 6,
      imageSize: 0.3
    }
  }));

  useEffect(() => {
    qrCode.current.append(qrRef.current);
  }, [fullName, phoneNumber, email, address,  website, job, dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);


  useEffect(() => { 
    if (fullName && phoneNumber && email && address && website && job && !isCreatingQRCode) { 
      setIsCreatingQRCode(true); 
      createDynamicQRCode('card', { fullName, phoneNumber, email, address, website, job }); 
    } }, [fullName, phoneNumber, email, address, website, job]);
    
    
  useEffect(() => { 
    createDynamicQRCode('card', { fullName, phoneNumber, email, address, website, job }); 
  }, [fullName, phoneNumber, email, address, website, job, dotType, dotColor, bgColor, cornerSquareType, bgSquareType, cornerDotType, bgDotType, logo]);
  
  const dotTypes = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  const SquareTypes = ['dots', 'square', 'extra-rounded'];

  const CornerDotTypes = ['dots', 'square'];


  const createDynamicQRCode = (type, data) => {
    console.log('Type:', type);
    console.log('Data:', data);
    // Tạo URL giả cho mã QR động
    // const shortUrl = `http://localhost:3000/${Math.random().toString(36).substring(7)}`;
    const shortUrl = `https://76e4-2001-ee0-500e-c150-992-a9a1-edc-d09b.ngrok-free.app/${Math.random().toString(36).substring(7)}`;
      setShortUrl(shortUrl);
      console.log('Short URL:', shortUrl);
        qrCode.current.update({
          data: shortUrl,
          dotsOptions: {
            type: dotType,
            color: dotColor
          },
          backgroundOptions: {
            color: bgColor,
          },
          cornersSquareOptions: {
            type: cornerSquareType,
            color: bgSquareType,
          },
          cornersDotOptions: {
            type: cornerDotType,
            color: bgDotType,
          },
          image: logo,
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 6,
            imageSize: 0.3
          }
        });
      setIsCreatingQRCode(false);
    };

    const saveQRCodeToDatabase = async ( type, data, userId) => {
      console.log('Saving QR code to database');
      try {
        const qrImage = await toPng(qrRef.current);
          const token = localStorage.getItem('token');
          console.log('Token:', token); 
          console.log('Ngrok URL:', 'https://503b-2001-ee0-4f8c-92c0-d1a1-1519-84f-2120.ngrok-free.app/shorten'); 
            // Khởi tạo shortUrl trước khi sử dụng 
          const response = await axios.post('https://503b-2001-ee0-4f8c-92c0-d1a1-1519-84f-2120.ngrok-free.app/shorten', {
            type, 
            data, 
            userId, 
            qrImage,
            name, 
            project: project || "Không có dự án",
            createdAt: new Date(),
            isActive: true,
            shortUrlOriginal: data.url, // Lưu URL gốc
            scanCount: 0,
            scanIps: [String],
            scanLocations: [Object], // Lưu trữ thông tin vị trí địa lý
            scans:[],
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const shortUrl = `https://503b-2001-ee0-4f8c-92c0-d1a1-1519-84f-2120.ngrok-free.app/${response.data.shortUrl}`;
            setShortUrl(shortUrl);
            console.log('QR code saved:', response.data);
              qrCode.current.update({
                data: shortUrl,
                dotsOptions: {
                  type: dotType,
                  color: dotColor
                },
                backgroundOptions: {
                  color: bgColor,
                },
                cornersSquareOptions: {
                  type: cornerSquareType,
                  color: bgSquareType,
                },
                cornersDotOptions: {
                  type: cornerDotType,
                  color: bgDotType,
                },
                image: logo,
                imageOptions: {
                  crossOrigin: 'anonymous',
                  margin: 6,
                  imageSize: 0.3
                }
              });
            } catch (error) {
                console.error('Error saving QR code to database:', error);
          }
  };
  const handleDownloadClick = async () => {
    try{
      await saveQRCodeToDatabase('card', {  fullName, phoneNumber, email, address, website, job }, userData._id);
        qrCode.current.download({ name, extension: download});
      }catch(error){
          console.error('Error saving QR code:', error);
      }
    };    

  const handleUploadLogoClick = (e) => {
      const file = e.target.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogo(e.target.result);
        };
        reader.readAsDataURL(file);
      }
  }

// Gọi hàm với dữ liệu cụ thể cho URL
const updateQRCodeCard = async (shortUrl, fullName, phoneNumber, email, address, website, job) => {
  console.log('Updating shortUrl:', shortUrl);  // Log shortUrl gửi đi
  console.log('Updating Card Info - Full Name:', fullName, 'Phone Number:', phoneNumber, 'Email:', email, 'Address:', address, 'Website:', website, 'Job:', job);  // Log thông tin card gửi đi
  try {
    const response = await axios.post('http://localhost:3000/update-card', {
      shortUrl: shortUrl,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      website: website,
      job: job
    });

    if (response.status === 200) {
      console.log('Card Info updated successfully');
      const updateUrl = `http://localhost:3000/${shortUrl}`;
      qrCode.current.update({
        data: updateUrl,
        dotsOptions: {
          type: dotType,
          color: dotColor
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          type: cornerSquareType,
          color: bgSquareType,
        },
        cornersDotOptions: {
          type: cornerDotType,
          color: bgDotType,
        },
        image: logo,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.3
        }
      });
    }
  } catch (error) {
    console.error('Error updating Card Info:', error.response ? error.response.data : error.message);
  }
};


const handleUpdateCard = () => {
  const fullName = prompt('Nhập Họ Tên mới:');
  const phoneNumber = prompt('Nhập Số Điện Thoại mới:');
  const email = prompt('Nhập Email mới:');
  const address = prompt('Nhập Địa Chỉ mới:');
  const website = prompt('Nhập Website mới:');
  const job = prompt('Nhập Công Việc mới:');
  if (fullName && phoneNumber && email && address && website && job) {
    updateQRCodeCard(shortUrl, fullName, phoneNumber, email, address, website, job);
  }
};


  return (
    <div>
      <div className="main-container">
        <Header />
        <div className="content">
          <div className="section">
            <div className="title-home-section">
              <h3 className='title-home-section-children'>
                <span>2. {t("addContentToQrCard")}</span>
              </h3>
            </div>
            <div className="card-section">
              <section className='card-section_container'>
                <div className="card-section-url_title">
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">{t("nameYourQrCode")}</p>
                    <div className='mui-styled-content_text'>
                      <div className="mui-styled-content-text_inputPage"> 
                        <input 
                          className='mui-styled-content-text_inputPage_muiInputBase' 
                          aria-invalid='false' 
                          type="text" 
                          placeholder="ví dụ: Mã QR đầu tiên của tôi" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">{t("addProjectForYourQrCodeIfAny")}</p>
                    <div className='mui-styled-content_text'>
                      <div className="mui-styled-content-text_inputPage"> 
                        <input 
                          className='mui-styled-content-text_inputPage_muiInputBase' 
                          aria-invalid='false' 
                          type="text" 
                          placeholder="ví dụ: Xuân tình nguyện 2025" 
                          value={project} 
                          onChange={(e) => setProject(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-section-url_title">
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">{t("addContentToQrCard")}</p>
                    <span className='mui-styled-title_children'>{t("Creating a QR code is easy and customizable for Vcard in minutes.")}</span>
                    <div className='mui-styled-content_handleInput'>
                  {/* Fullname */}
                      <div className="mui-styled-content_handleInput_Page"> 
                          <hr />
                          <p className="mui-styled-title_URL">{t("name")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="Steve Jobs" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                      </div>
                      {/* Profile Image  */}
                      {/* <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL"> Ảnh đại diện*</p>
                            <input 
                              className='mui-styled-content_handleInput_Page-URL' 
                              aria-invalid='false' 
                              type="file" 
                              value={profileImage}
                              onChange={(e) => setProfileImage(e.target.value)}
                            />
                      </div> */}
                    {/* Phone number */}
                    <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">{t("phone")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            // type="number" 
                            placeholder="0919381862" 
                            value={phoneNumber}
                            onChange={handleInputChange}
                          />
                           {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                      </div>
                      {/*  Email Address:  */}
                    <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">{t("email")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            type="email" 
                            placeholder="titi27748@gmail.com" 
                            // value={email}
                            onChange={handleInputChangeEmail}
                          />
                            {errorMessageEmail && <p style={{ color: 'red' }}>{errorMessageEmail}</p>}
                      </div>
                       {/*   Address:  */}
                      <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">{t("address")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="HoChiMinh" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                      </div>
                        {/*  Job  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">{t("job")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="Giám đốc sáng tạo" 
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                          />
                      </div>
                        {/*  Website:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">{t("websiteAddress")}</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="http://abc.com" 
                            value={website}
                            onChange={handleInputChangeURL}
                          />
                          {errorMessageURL && <p style={{ color: 'red' }}>{errorMessageURL}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-section-url_content"></div>
              </section>


              <section className='card-section_styled'>
                <div className="card-section-url_title">
                      <div className="card-section-url_title-text">
                        <p className="mui-styled-title">{t("qrCodeFrame")}</p>
                      </div>
                      {/* Kiểu mã */}
                      <div className="card-section_dotType">
                        {dotTypes.map(type => (
                          <button 
                            key={type} 
                            className={`dotType-button ${dotType === type ? 'selected' : ''}`} 
                            onClick={() => setDotType(type)}
                          >
                          <img src={`src/assets/Image/BgDotColor/${type}.png`} alt={type} className="dotType-image" /> 
                          </button>
                        ))}
                      </div> 
                      {/* Màu nền & màu chấm */}
                      <div className="card-section_BgDotType">
                          {/* Màu chấm */}
                          <div className='dotname'>  
                              <div className="color-picker">
                                <p className="mui-styled-title_URL">
                                {t("chooseDotColorRequired")}
                              </p>
                                  <div className="color-picker_dopdown">
                                      <input 
                                      type="color" 
                                      placeholder='color'
                                      className='dotColor'
                                      value={dotColor} 
                                      onChange={(e) => setDotColor(e.target.value)} />
                                      <input type="text" value={dotColor} readOnly className="color-code" />
                                  </div>
                            </div>
                            <div className="color-preview"
                              style={{background: dotColor}}
                            >
                            </div>
                          </div>
                        
                          {/* Màu nền */}
                          <div className='dotname'>  
                              <div className="color-picker">
                                <p className="mui-styled-title_URL">
                                {t("chooseBackgroundColor")}
                              </p>
                                  <div className="color-picker_dopdown">
                                      <input 
                                      type="color" 
                                      placeholder='color'
                                      className='bgColor'
                                      value={bgColor} 
                                      onChange={(e) => setBgColor(e.target.value)} />
                                      <input type="text" value={bgColor} readOnly className="color-code" />
                                  </div>
                            </div>
                            <div className="color-preview"
                              style={{background: bgColor}}
                            >
                            </div>
                          </div>
                          {/* <div>
                            <div className="color-picker">
                                <p className="mui-styled-title_URL">
                                {t("chooseBackgroundColor")}
                              </p>
                                  <div className="color-picker_dopdown">
                                      <input 
                                      type="color" 
                                      placeholder='color'
                                      className='bgColor'
                                      value={bgColor} 
                                      onChange={(e) => setBgColor(e.target.value)} />
                                      <input type="text" value={bgColor} readOnly className= 'color-code'  />
                                  </div>
                            </div>
                            <div className="color-preview"
                              style={{background: bgColor}}
                            >
                            </div>
                          </div> */}
                      </div>
                <hr />
                    {/* Kiểu góc & kiểu chấm*/}
                      <div className="card-section-url_title-text">
                          <p className="mui-styled-title">{t("cornerStyle")}</p>
                          <div className="card-section_cornerSquareType">
                              <div className="card-section_cornerSquareTypeStyled">
                                    <p className="mui-styled-title_URL">
                                        {t("frameCornerStyle")}
                                    </p>
                                    <div className="card-section_bgCornerSquareType">
                                          {SquareTypes.map(type => (
                                              <button 
                                                  key={type} 
                                                  className={`cornerSquareType-button ${cornerSquareType === type ? 'selected' : ''}`} 
                                                  onClick={() => setCornerSquareType(type)}
                                                >
                                                <img src={`src/assets/Image/cornerSquareType/${type}.png`} alt={type} className="cornerSquareType-image" /> 
                                              </button>
                                          ))}
                                      </div>
                              </div>
                              
                                <div className="card-section_cornerDotTypeStyled">
                                <p className="mui-styled-title_URL">
                                  {t("dotCornerStyle")}
                                </p>
                                <div className="card-section_bgCornerSquareType">
                                    {CornerDotTypes.map(type => (
                                        <button 
                                            key={type} 
                                            className={`cornerSquareType-button ${cornerDotType === type ? 'selected' : ''}`} 
                                            onClick={() => setCornerDotType(type)}
                                          >
                                          <img src={`src/assets/Image/Alo/${type}.png`} alt={type} className="cornerSquareType-image" /> 
                                        </button>
                                    ))}
                                </div>
                                </div>
                          </div>
                      </div>
                   {/* Màu khung góc & màu chấm góc */}
                      <div className="card-section_BgDotType">
                              {/* Màu khung góc */}
                              <div className='dotname'>
                                <div className="color-picker">
                                    {/* <label htmlFor="dotColor">Màu chấm</label> */}
                                    <p className="mui-styled-title_URL">
                                    {t("frameCornerStyle")}
                                  </p>
                                      <div className="color-picker_dopdown">
                                          <input 
                                          type="color" 
                                          placeholder='color'
                                          className='bgSquareType'
                                          value={bgSquareType} 
                                          onChange={(e) => setBgCornerSquareType(e.target.value)} />
                                          <input type="text" value={bgSquareType} readOnly className="color-code" />
                                      </div>
                                </div>
                                <div className="color-preview"
                                  style={{background: bgSquareType}}
                                >
                                </div>
                              </div>
                              {/* Màu chấm góc */}
                              <div className='dotname'>
                                <div className="color-picker">
                                    {/* <label htmlFor="dotColor">Màu chấm</label> */}
                                    <p className="mui-styled-title_URL">
                                    {t("chooseDotCornerRequired")}
                                  </p>
                                      <div className="color-picker_dopdown">
                                          <input 
                                          type="color" 
                                          placeholder='color'
                                          className='bgDotType'
                                          value={bgDotType} 
                                          onChange={(e) => setBgDotType(e.target.value)} />
                                          <input type="text" value={bgDotType} readOnly className= 'color-code'  />
                                      </div>
                                </div>
                                <div className="color-preview"
                                  style={{background: bgDotType}}
                                >
                                </div>
                              </div>
                      </div>
                 </div>

                    {/* Logo */}
                <div className="card-section-logo_title">
                    <div className="card-section-url_title-text">
                        <p className="mui-styled-title">{t("addLogo")}</p>
                   
                    </div>
                      {/* Thêm Logo */}
                      <div className="card-section_logoType">

                        <div className="card-section_logoType-input">
                        <p className="mui-styled-title_URL">
                            {t("chooseLogo")}
                          </p>
                          {/* Logo */}
                              {LogoTypes.map(type => (
                                <button 
                                  key={type} 
                                  className={`LogoType-button ${logo === type ? 'selected' : ''}`} 
                                  onClick={() => setLogo(`src/assets/Image/LogoType/${type}.svg`)}
                                >
                                <img src={`src/assets/Image/LogoType/${type}.svg`} alt={type} className="LogoType-image" /> 
                                </button>
                              ))}
                        </div>
                          {/* <span className='card-section_logoType-text'>hoặc</span> */}
                        <div className="card-section_logoType-window">
                        <p className="mui-styled-title_URL">
                                        {t("uploadYourOwnLogo")}
                          </p>
                              <input type="file" accept='image/*' onChange={handleUploadLogoClick} className='logoUpLoad' placeholder='Tải lên ảnh của riêng bạn'/>
                        </div>
                      </div> 
                    </div> 
              </section>
            </div>
          </div>
        
          <div className="phone">
            <div className="phone_lockup"></div>
            <div className="phone_change-lockup">    
              <div className="template-preview-scroll-container">
                <div className="template-preview-preview-box">
                  <div className="template-preview-content">
                    <div className="template-preview-content-header"> 
                      <div className="template-preview-content-wrapper">
                       
                        {fullName && phoneNumber  && email && address && job && website &&  isValid &&(
                          <div>
                          <div  className='qr_Code' ref={qrRef} />
                          <div className="downloadQRCode">
                            <button className='DoneQRCode' onClick={handleDownloadClick}> Hoàn thành </button>
                              <select className='wrapper_select' value={download} onChange={(e) => setDownload(e.target.value)}>
                                  <option value="png">PNG</option>
                                  <option value="jpg">JPG</option>
                                  <option value="svg">SVG</option>
                              </select>
                            </div>
                            <button onClick={handleUpdateCard} className='hidden'>Cập nhật Văn bản</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <img src="phonemyqrcode.jpg" alt="" className='template-preview-content-wrapper-phone-img' />
                 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
