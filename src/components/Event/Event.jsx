import './Event.css'
import Header from "../Header/Header";
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import { toPng } from 'html-to-image';
const Event = () => {
    const {userData} = useAuth();
    const [project, setProject] = useState('');
  const [name, setName] = useState('');
  // Event
  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState('');
  // const [eventImage, setEventImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [service, setService] = useState('');
  const [about, setAbout] = useState(''); 

  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

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



  const qrRef = useRef(null);
  const qrCode = useRef(new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 10,
    data: `BEGIN:VEVENT\nSUMMARY:${eventName}\nDTSTART:${startDate}\nDTEND:${endDate}\nLOCATION:${address}\nDESCRIPTION:${about}\nCONTACT:${contactName}\nPHONE:${phoneNumber}\nEMAIL:${email}\nURL:${website}\nEND:VEVENT`,
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
  }, [title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website,  dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);

  useEffect(() => { 
    if (title && eventName && startDate && endDate && about && address && contactName && phoneNumber && email && website && !isCreatingQRCode) { 
      setIsCreatingQRCode(true); 
      createDynamicQRCode('event', { title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website}); 
    } }, [title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website, ]);

    useEffect(() => { 
        createDynamicQRCode('event', { title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website}); 
      }, [title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website, ]);
  
  const createDynamicQRCode = (type, data) => {
    console.log('Type:', type);
    console.log('Data:', data);
    // Tạo URL giả cho mã QR động
    // const shortUrl = `http://localhost:3000/${Math.random().toString(36).substring(7)}`;
    const shortUrl = `https://503b-2001-ee0-4f8c-92c0-d1a1-1519-84f-2120.ngrok-free.app/${Math.random().toString(36).substring(7)}`;
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

  const dotTypes = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  const SquareTypes = ['dots', 'square', 'extra-rounded'];

  const CornerDotTypes = ['dots', 'square'];

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
        await saveQRCodeToDatabase('event', {title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website, }, userData._id);
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
const updateQRCodeEvent = async (shortUrl, title ,eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website) => {
  console.log('Updating shortUrl:', shortUrl);  // Log shortUrl gửi đi
  console.log('Updating Card Info - title Event:', title, 
    'eventName:', eventName, 
    'startDate:', startDate, 
    'endDate:', endDate, 
    'about:', about, 
    'address:', address, 
    'contactName:', contactName, 
    'phoneNumber:', phoneNumber, 
    'email:', email,
    'website:', website);  // Log thông tin card gửi đi
  try {
    const response = await axios.post('http://localhost:3000/update-event', {
      shortUrl: shortUrl,
      title: title,
      eventName: eventName,
      startDate: startDate,
      endDate: endDate,
      about: about,
      address: address,
      contactName: contactName,
      phoneNumber: phoneNumber,
      email: email,
      website: website,
    });

    if (response.status === 200) {
      console.log('Event Info updated successfully');
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


const handleUpdateEvent = () => {
  const title = prompt('Nhập title mới:');
  const eventName = prompt('Nhập eventName mới:');
  const startDate = prompt('Nhập startDate mới:');
  const endDate = prompt('Nhập endDate mới:');
  const about = prompt('Nhập about mới:');
  const address = prompt('Nhập address mới:');
  const contactName = prompt('Nhập contactName mới:');
  const phoneNumber = prompt('Nhập phoneNumber mới:');
  const email = prompt('Nhập email mới:');
  const website = prompt('Nhập website mới:');
  if (title && eventName && startDate && endDate && about && address && contactName && phoneNumber && email && website) {
    updateQRCodeEvent(shortUrl, title, eventName, startDate, endDate, about, address, contactName, phoneNumber, email, website);
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
                <span>2. Thêm nội dung vào mã QR Vcard</span>
              </h3>
            </div>
            <div className="card-section">
              <section className='card-section_container'>
                <div className="card-section-url_title">
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">Đặt tên cho mã QR của bạn</p>
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
                    <p className="mui-styled-title">Thêm dự án cho mã QR của bạn (nếu có)</p>
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
                    <p className="mui-styled-title">Mã QR Vcard</p>
                    <span className='mui-styled-title_children'>Tạo mã QR dễ dàng và có thể tùy chỉnh Vcard trong vài phút.</span>
                    <div className='mui-styled-content_handleInput'>
                  {/* Title */}
                      <div className="mui-styled-content_handleInput_Page"> 
                          <hr />
                          <p className="mui-styled-title_URL">Tên sự kiện*</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="Maria's wedding" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                      </div>
                       {/* Tóm tắt sự kiện  */}
                       <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL"> Tóm tắt sự kiện*</p>
                            <input 
                              className='mui-styled-content_handleInput_Page-URL' 
                              aria-invalid='false' 
                              type="text" 
                              placeholder='Maria & Steve are finally getting married'
                              value={eventName}
                              onChange={(e) => setEventName(e.target.value)}
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


                    {/* Start Time  */}
                    <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Ngày bắt đầu</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                             type="datetime-local"
                            placeholder="26/08/2024" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                      </div>
                      {/*    End Time   */}
                    <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Ngày kết thúc</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                             type="datetime-local"
                            placeholder="30/08/2024" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                      </div>
                       {/*   Address:  */}
                      {/* <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Địa chỉ </p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="HoChiMinh" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                      </div> */}
                        {/*  About   */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Nội dung</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="Come and join us in celebrating our wedding with our family and friends." 
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                          />
                      </div>
                        {/*  address:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Địa chỉ</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="address" 
                            placeholder="Hồ Gươm - Hà Nội" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                      </div>
                        {/*   Tên liên hệ:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Tên liên hệ*</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="text" 
                            placeholder="Oscar" 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                      </div>
                        {/*  Phone:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL"> Số điện thoại* </p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="number" 
                            placeholder="0919381862" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                      </div>

                        {/*  Email:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Email</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="email" 
                            placeholder="hauvan788@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>
                        {/*  Website:  */}
                        <div className="mui-styled-content_handleInput_Page"> 
                          <p className="mui-styled-title_URL">Website</p>
                          <input 
                            className='mui-styled-content_handleInput_Page-URL' 
                            aria-invalid='false' 
                            type="website"  
                            placeholder="http://abc.com" 
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-section-url_content"></div>
              </section>

              <section className='card-section_styled'>
                <div className="card-section-url_title">
                      <div className="card-section-url_title-text">
                        <p className="mui-styled-title">Khung mã QR</p>
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
                          <div className="color-picker">
                              {/* <label htmlFor="dotColor">Màu chấm</label> */}
                              <p className="mui-styled-title_URL">
                              Chọn màu chấm*
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
                          {/* Màu nền */}
                          <div className="color-picker">
                              {/* <label htmlFor="dotColor">Màu chấm</label> */}
                              <p className="mui-styled-title_URL">
                              Chọn màu nền*
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
                      </div>
                <hr />
                    {/* Kiểu góc & kiểu chấm*/}
                      <div className="card-section-url_title-text">
                          <p className="mui-styled-title">Kiểu góc</p>
                          <div className="card-section_cornerSquareType">
                              <div className="card-section_cornerSquareTypeStyled">
                                    <p className="mui-styled-title_URL">
                                        Kiểu khung góc
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
                                  Kiểu chấm góc
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
                              <div className="color-picker">
                                  {/* <label htmlFor="dotColor">Màu chấm</label> */}
                                  <p className="mui-styled-title_URL">
                                  Chọn khung góc*
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
                              {/* Màu chấm góc */}
                              <div className="color-picker">
                                  {/* <label htmlFor="dotColor">Màu chấm</label> */}
                                  <p className="mui-styled-title_URL">
                                  Chọn chấm góc*
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

                    {/* Logo */}
                <div className="card-section-logo_title">
                    <div className="card-section-url_title-text">
                        <p className="mui-styled-title">Thêm Logo</p>
                    </div>
                      {/* Thêm Logo */}
                      <div className="card-section_logoType">

                        <div className="card-section_logoType-input">
                        <p className="mui-styled-title_URL">
                               Chọn Logo
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
                                        Tải Logo riêng của bạn
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
                       
                        {title && eventName && startDate && endDate && about && contactName && phoneNumber && email && address && website && (
                          <div>
                          <div ref={qrRef} />
                          <div className="downloadQRCode">
                            <button className='DoneQRCode' onClick={handleDownloadClick}> Hoàn thành </button>
                              <select className='wrapper_select' value={download} onChange={(e) => setDownload(e.target.value)}>
                                  <option value="png">PNG</option>
                                  <option value="jpg">JPG</option>
                                  <option value="svg">SVG</option>
                              </select>
                            </div>
                            <button onClick={handleUpdateEvent} className='hidden'>Cập nhật Văn bản</button>
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

export default Event;
