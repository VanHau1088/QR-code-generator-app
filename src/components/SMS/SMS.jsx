import './SMS.css'
import Header from "../Header/Header";
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import parsePhoneNumberFromString  from 'libphonenumber-js';

const countryCodes = [
  { code: '+84', name: 'Vietnam' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+61', name: 'Austria' },
]

const SMS = () => {
  const [name, setName] = useState('');
  const[countryCode, setCounTryCode] = useState('');
  const [number, setNumber] = useState('');
  const [formattedNumber, setFormattedNumber] = useState('');
  const [message, setMessage] = useState('');


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

  const qrRef = useRef(null);
  const qrCode = useRef(new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 10,
    data: `SMSTO:${formattedNumber}:${message}`, // Sử dụng SMSTO để tạo mã QR cho SMS 
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
  }, [formattedNumber, message, dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);

  useEffect(() => {
    qrCode.current.update({
      data: `SMSTO:${formattedNumber}:${message}`, // Sử dụng SMSTO để tạo mã QR cho SMS 
      dotsOptions: {
        type: dotType,
        color: dotColor
      },
      backgroundOptions:{
        color: bgColor,
      },
      cornersSquareOptions:{
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
    });
  }, [formattedNumber, message, dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);

  const dotTypes = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  const SquareTypes = ['dots', 'square', 'extra-rounded'];

  const CornerDotTypes = ['dots', 'square'];

  const handleDownloadClick = () => {
   qrCode.current.download({name, extension: download})
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


  // SMS
  const handlePhoneNumberChange = () => {
    const phoneNumber = parsePhoneNumberFromString(`${countryCode}${number}`)
    if(phoneNumber && phoneNumber.isValid()){
      setFormattedNumber(phoneNumber.format('E.164'));
    } else {
      setFormattedNumber('');
  }
}

useEffect(() => {
      handlePhoneNumberChange();
  }, [countryCode, number])

  return (
    <div>
      <div className="main-container">
        <Header />
        <div className="content">
          <div className="section">
            <div className="title-home-section">
              <h3 className='title-home-section-children'>
                <span>2. Thêm nội dung vào mã QR Tin nhắn SMS</span>
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
                </div>
                <div className="card-section-url_title">
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">Tin nhắn SMS</p>
                    <span className='mui-styled-title_children'>Tạo mã QR dễ dàng và có thể tùy chỉnh Tin nhắn SMS trong vài phút.</span>
                    <div className='mui-styled-content_handleInput'>
                      <div className="mui-styled-content_handleInput_Page"> 
                        <hr />
                        <p className="mui-styled-title_URL">Khu vực*</p>
                        <select  className='mui-styled-content_handleInput_Page-URL' value={countryCode} onChange={(e) => setCounTryCode(e.target.value)} >
                              <option value="">
                                Khu vực*
                              </option>
                            {countryCodes.map((country) => ( 
                              <option key={country.code} 
                                value={country.code}>{country.name} ({country.code})
                              </option> ))}
                          </select>
                      </div>
                    </div>
                  
                    <div className='mui-styled-content_handleInput'>
                      <div className="mui-styled-content_handleInput_Page"> 
                        <p className="mui-styled-title_URL">Số điện thoại*</p>
                        <input 
                          className='mui-styled-content_handleInput_Page-URL' 
                          aria-invalid='false' 
                          type="number" 
                          placeholder="ví dụ: 0919381862" 
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className='mui-styled-content_handleInput'>
                      <div className="mui-styled-content_handleInput_Page"> 
                        <p className="mui-styled-title_URL">Tin nhắn*</p>
                        <input 
                          className='mui-styled-content_handleInput_Page-URL' 
                          aria-invalid='false' 
                          type="text" 
                          placeholder="ví dụ: www.mywebsite.com" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
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
                       
                        {countryCode && number && message && (
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

export default SMS;
