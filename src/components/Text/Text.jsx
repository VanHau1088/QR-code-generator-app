import './Text.css'
import Header from "../Header/Header";
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import { toPng } from 'html-to-image';
const Text = () => {
   const {userData} = useAuth();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
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
    data: text,
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
  }, [text, dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);


  useEffect(() => { 
    if (text && !isCreatingQRCode) { 
      setIsCreatingQRCode(true); 
      createDynamicQRCode('text', { text }); 
    } 
  }, [text]);

  useEffect(() => { 
    createDynamicQRCode('text', { text }); 
  }, [text, dotType, dotColor, bgColor, cornerSquareType, bgSquareType, cornerDotType, bgDotType, logo]);
  
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
  
  const dotTypes = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  const SquareTypes = ['dots', 'square', 'extra-rounded'];

  const CornerDotTypes = ['dots', 'square'];

  const saveQRCodeToDatabase = async ( type, data, userId) => {
    console.log('Saving QR code to database');
    try {
      const qrImage = await toPng(qrRef.current);
        const token = localStorage.getItem('token');
        console.log('Token:', token); 
        console.log('Ngrok URL:', 'https://76e4-2001-ee0-500e-c150-992-a9a1-edc-d09b.ngrok-free.app/shorten'); 
          // Khởi tạo shortUrl trước khi sử dụng 
        const response = await axios.post('https://76e4-2001-ee0-500e-c150-992-a9a1-edc-d09b.ngrok-free.app/shorten', {
          type, 
          data, 
          userId, 
          qrImage, 
          name, 
          createdAt: new Date(),
          isActive: true,
          shortUrlOriginal: ' ', // Lưu URL gốc
          scanCount: 0,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const shortUrl = `https://76e4-2001-ee0-500e-c150-992-a9a1-edc-d09b.ngrok-free.app/${response.data.shortUrl}`;
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
        await saveQRCodeToDatabase('text', {text}, userData._id);
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
  const updateQRCodeURL = async (shortUrl, newText) => {
    console.log('Updating shortUrl:', shortUrl);  // Log shortUrl gửi đi
    console.log('Updating newText:', newText);  // Log newUrl gửi đi
    try {
      const response = await axios.post('http://localhost:3000/update-text', {
        shortUrl: shortUrl,
        newText: newText
      });
  
      if (response.status === 200) {
        console.log('URL updated successfully');
        console.log('New URL updated successfully:');
        console.log(`http://localhost:3000/${shortUrl}`);
        const updateUrl = `http://localhost:3000/${shortUrl}`;
        qrCode.current.update({
            data: updateUrl,
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
        }
    } catch (error) {
      console.error('Error updating URL:', error.response ? error.response.data : error.message);
  };
}
  const handleUpdateText = () => {
    const newText = prompt('Nhập URL mới:'); // Hỏi người dùng nhập URL mới
    if (newText) {
      updateQRCodeURL(shortUrl, newText);
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
              <span>2. Thêm nội dung vào mã QR văn bản đơn giản</span>
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
                  <p className="mui-styled-title">Văn bản đơn giản</p>
                  <span className='mui-styled-title_children'>Nhập văn bản bạn muốn hiển thị khi người dùng quét mã QR của bạn</span>
                  <div className='mui-styled-content_handleInput'>
                    <div className="mui-styled-content_handleInput_Page"> 
                      <hr />
                      <p className="mui-styled-title_URL">URL trang web*</p>
                      <textarea 
                        className='mui-styled-content_handleInput_Page-Text' 
                        aria-invalid='false' 
                        type="text" 
                        placeholder="ví dụ: Buổi hòa nhạc sẽ diễn ra lúc 9 giờ tối ngày 12 tháng 10." 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
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
                      {text && (
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
                        <button onClick={handleUpdateText}>Cập nhật Văn bản</button>
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

export default Text;











  