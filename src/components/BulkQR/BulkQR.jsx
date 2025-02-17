import './BulkQR.css'
import Header from "../Header/Header";
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useTranslation } from "react-i18next";
const BulkQR = () => {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [qrData, setQrData] = useState([]);
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
  // const [logo, setLogo] = useState(`assets/Image/LogoType/${LogoTypes[0]}.svg`);
  const [logo, setLogo] = useState(null);
  // Download
  const [download, setDownload] = useState('png');


const fileInputRef = useRef(null);
const qrCodesRef = useRef([]);


const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data.filter(entry => Object.values(entry).some(value => value.trim() !== ''));
        generateQRCodes(data);
      },
    });
  }
};

const generateQRCodes = (data) => {
  const qrCodes = data.map((entry, index) => {
    const content = Object.keys(entry)
      .filter(key => key !== 'label')
      .map(key => `${key}: ${entry[key]}`)
      .join('\n');

    return {
      id: index,
      content: content,
      label: entry.label || `QR ${index + 1}`,
      qrCodeStyling: new QRCodeStyling({
        width: 300,
        height: 300,
        data: content,
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: bgSquareType,
          type: cornerSquareType,
        },
        cornersDotOptions: {
          color: cornerDotType,
          type: cornerDotType,
        },
        image: logo,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.6
        }
      }),
    };
  });

  setQrData(qrCodes);
};


const handleExport = () => {
  const zip = new JSZip();

  qrData.forEach((qr) => {
    const canvas = qrCodesRef.current[qr.id].querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const imgData = url.split(',')[1];

    zip.file(`${qr.label}.png`, imgData, { base64: true });
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content,  name);
  });

   
};

useEffect(() => {
  qrData.forEach((qr) => {
    qr.qrCodeStyling.append(qrCodesRef.current[qr.id]);
  });
}, [qrData]);

  useEffect(() => {
    qrData.forEach((qr) => {
      qr.qrCodeStyling.update({
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
    })
  }, [qrData, dotType, dotColor, bgColor, cornerSquareType, cornerDotType, bgSquareType, bgDotType, logo]);

  const dotTypes = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];

  const SquareTypes = ['dots', 'square', 'extra-rounded'];

  const CornerDotTypes = ['dots', 'square'];

  // const handleDownloadClick = () => {
  //  qrCodesRef.current.download({name, extension: download})
  // };

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

  return (
    <div>
      <div className="main-container">
        <Header />
        <div className="content">
          <div className="section">
            <div className="title-home-section">
              <h3 className='title-home-section-children'>
                <span>2. {t("addContentToQrUrl")}</span>
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
                </div>
                <div className="card-section-url_title">
                  <div className="card-section-url_title-text">
                    <p className="mui-styled-title">{t("websiteAddress")}</p>
                    <span className='mui-styled-title_children'>{t("addContentToQrUrl")}</span>
                    <div className='mui-styled-content_handleInput'>
                      <div className="mui-styled-content_handleInput_Page"> 
                        <hr />
                        <p className="mui-styled-title_URL">{t("websiteUrlRequired")}</p>
                        <input 
                          className='mui-styled-content_handleInput_Page-URL' 
                          type="file" 
                          accept='.csv'
                          ref={fileInputRef}
                          onChange={handleFileUpload}
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
                          <img src={`assets/Image/BgDotColor/${type}.png`} alt={type} className="dotType-image" /> 
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
                                                <img src={`assets/Image/cornerSquareType/${type}.png`} alt={type} className="cornerSquareType-image" /> 
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
                                          <img src={`assets/Image/Alo/${type}.png`} alt={type} className="cornerSquareType-image" /> 
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
                                  onClick={() => setLogo(`assets/Image/LogoType/${type}.svg`)}
                                >
                                <img src={`assets/Image/LogoType/${type}.svg`} alt={type} className="LogoType-image" /> 
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
                    
                 
                        {qrData && (
                          <div>
                          <div  ref={qrCodesRef} />

                          <div className="qr-container">
                                {qrData.map((qr) => (
                                  <div key={qr.id} className="qr-item" ref={el => qrCodesRef.current[qr.id] = el}>
                                    <h2>{qr.label}</h2>
                                  </div>
                                ))}
                              </div>
                          <div className="downloadQRCode">
                              {qrData.length > 0 && (
                                <div>
                                  <button className='DoneQRCode' onClick={handleExport}> Hoàn thành </button>
                                    <select className='wrapper_select' value={download} onChange={(e) => setDownload(e.target.value)}>
                                        <option value="png">PNG</option>
                                        <option value="jpg">JPG</option>
                                        <option value="svg">SVG</option>
                                    </select>
                                  </div>
                              )}
                                {/* {qrData.length > 0 && (
                                    <button className='DoneQRCode' onClick={handleExport}> Hoàn thành </button>
                                        <select className='wrapper_select' value={download} onChange={(e) => setDownload(e.target.value)}>
                                            <option value="png">PNG</option>
                                            <option value="jpg">JPG</option>
                                            <option value="svg">SVG</option>
                                        </select>
                                )} */}
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

export default BulkQR;
