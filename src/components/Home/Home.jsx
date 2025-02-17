

import { NavLink } from "react-router-dom";
import './Home.css'
import Header from "../Header/Header";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// import purify from "dompurify";


const Home = () => {

  // ImageHover
    const [imageSrc, setImageSrc] = useState(
      '/assets/Image/ImageHover/QR.jpg'
    );
    const {t} = useTranslation();
    // const [language, setLanguage] = useState("");
    // const handleChange = (e) => {
    //   i18n.changeLanguage(e.target.value);
    //   setLanguage(e.target.value);
    // }

  return (
       

        <div >        
          <div className="main-container">
          <Header></Header>
            <div className="content">
              <div className="section">
                <div className="title-home-section">
                  <h3 className='title-home-section-children'>
                    <span>1. {t("Choose QR code type")}</span>
                  </h3>
                </div>

                <div className="card-section">
                  <ul className="card-section-content">
                    {/* URL */}
                    <li className="card-section-content-qr">
                    <NavLink to= 'URL'> 
                        <button className='template-selector__item-container' to = 'URL'  onMouseEnter={() =>
                                      setImageSrc(
                                            '/assets/Image/ImageHover/url.jpg'
                                      )
                                    }
                          >
                            <div className="template-selector__item-container-logo">
                              <img src="/assets/Image/Icons/url.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'URL'>
                              <p className="template-selector__item-container-text-title">
                                <span> 
                                  {t("Website URL")}
                                  </span>
                              </p>

                              <p className="template-selector__item-container-text-subtitle">
                                <span>
                                {t("Link to your chosen website")}
                                 </span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                    {/* vCard */}
                    <li className="card-section-content-Card">
                    <NavLink to= 'Card'> 
                        <button className='template-selector__item-container' to = 'Card'
                        onMouseEnter={() =>
                          setImageSrc(
                            '/assets/Image/ImageHover/vcard.jpg'
                          )
                        }>
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/card.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Card'>
                              <p className="template-selector__item-container-text-title">
                                <span> vCard </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                         
                                <span>    {t("shareDigitalBusinessCard")}</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                  {/* Email */}
                    <li className="card-section-content-Email">
                    <NavLink to= 'Email'> 
                        <button className='template-selector__item-container' to = 'Email'
                        onMouseEnter={() =>
                          setImageSrc(
                            '/assets/Image/ImageHover/Email.png'
                          )
                        }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/image.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Email'>
                              <p className="template-selector__item-container-text-title">
                                <span> Email </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>
                                {t("shareEmailContent")}
                                 
                                  </span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                    {/* HÌNH ẢNH */}
                    {/* <li className="card-section-content-IMG">
                    <NavLink to= 'IMG'> 
                        <button className='template-selector__item-container' to = 'IMG'
                        onMouseEnter={() =>
                          setImageSrc(
                            '/assets/Image/ImageHover/image.jpg'
                          )
                        }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/image.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'IMG'>
                              <p className="template-selector__item-container-text-title">
                                <span> Hình ảnh </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Hiển thị thư viện hình ảnh</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                    {/* Video */}
                    {/* <li className="card-section-content-Video">
                    <NavLink to= 'Video'> 
                        <button className='template-selector__item-container' to = 'Video'
                            onMouseEnter={() =>
                              setImageSrc(
                                '/assets/Image/ImageHover/video.jpg'
                              )
                            }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/video-camera.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Video'>
                              <p className="template-selector__item-container-text-title">
                                <span> Video </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Hiển thị thư viện hình ảnh</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                  {/* Văn bản đơn giản */}
                    <li className="card-section-content-Text">
                    <NavLink to= 'Text'> 
                        <button className='template-selector__item-container' to = 'Text'
                              onMouseEnter={() =>
                                setImageSrc(
                                  '/assets/Image/ImageHover/text.jpg'
                                )
                              }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/font.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Text'>
                              <p className="template-selector__item-container-text-title">
                                <span> 
                                {t("plainText")}
                                </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span> {t("displayTextContent")}</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                  {/* SMS */}
                   <li className="card-section-content-SMS">
                    <NavLink to= 'SMS'> 
                        <button className='template-selector__item-container' to = 'SMS'
                             onMouseEnter={() =>
                              setImageSrc(
                                '/assets/Image/ImageHover/sms.png'
                              )
                            }
                        >
                            <div className="template-selector__item-container-logo">
                                <img src="/assets/Image/Icons/menu.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'SMS'>
                              <p className="template-selector__item-container-text-title">
                                <span> SMS </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>   {t("createPrewrittenMessage")}
                                </span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                  {/* Sự kiện */} 
                     <li className="card-section-content-Event">
                    <NavLink to= 'Event'> 
                        <button className='template-selector__item-container' to = 'Event'
                           onMouseEnter={() =>
                            setImageSrc(
                              '/assets/Image/ImageHover/business.jpg'
                            )
                          }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/my-business.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Event'>
                              <p className="template-selector__item-container-text-title">
                                <span> 
                                {t("event")}

                                </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>
                                {t("event_text")}
                                </span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                  {/* Vị trí địa lý */}
                  <li className="card-section-content-Map">
                    <NavLink to= 'Map'> 
                        <button className='template-selector__item-container' to = 'Map'
                                  onMouseEnter={() =>
                                    setImageSrc(
                                      '/assets/Image/ImageHover/location.png'
                                    )
                                  }
                          >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/geo.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Map'>
                              <p className="template-selector__item-container-text-title">
                                <span> 
                                {t("location")}
                                </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>
                                {t("Location_text")}
                                 </span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li>

                  {/* Thanh toán */} 
                  <li className="card-section-content-Payment">
                          <NavLink to= 'Payment'> 
                              <button className='template-selector__item-container' to = 'Payment'
                                        onMouseEnter={() =>
                                          setImageSrc(
                                            '/assets/Image/ImageHover/payment.jpg'
                                          )
                                        }
                                >
                                  <div className="template-selector__item-container-logo">
                                  <img src="/assets/Image/Icons/payment.png" alt="" />
                                  </div>
                                  <div className="template-selector__item-container-text" to = 'Payment'>
                                    <p className="template-selector__item-container-text-title">
                                      <span> 
                                      {t("payment")}
                                       </span>
                                    </p>
                                    <p className="template-selector__item-container-text-subtitle">
                                      <span>
                                      {t("payment_text")}
                                      </span>
                                    </p>
                                  </div>
                              </button>
                          </NavLink>
                      </li>

                   {/* Wifi */}     
                  <li className="card-section-content-Wifi">
                      <NavLink to= 'Wifi'> 
                          <button className='template-selector__item-container' to = 'Wifi'
                                    onMouseEnter={() =>
                                      setImageSrc(
                                        '/assets/Image/ImageHover/wifi.jpg'
                                      )
                                    }
                            >
                              <div className="template-selector__item-container-logo">
                              <img src="/assets/Image/Icons/wifi1.png" alt="" />
                              </div>
                              <div className="template-selector__item-container-text" to = 'Wifi'>
                                <p className="template-selector__item-container-text-title">
                                  <span>     {t("wifi")} </span>
                                </p>
                                <p className="template-selector__item-container-text-subtitle">
                                  <span>  {t("wifi_text")} </span>
                                </p>
                              </div>
                          </button>
                      </NavLink>
                      </li>
                   {/* BULK QR */}     
                  <li className="card-section-content-BulkQR">
                      <NavLink to= 'BulkQR'> 
                          <button className='template-selector__item-container' to = 'BulkQR'
                                    onMouseEnter={() =>
                                      setImageSrc(
                                        '/assets/Image/ImageHover/BULK QR.png'
                                      )
                                    }
                            >
                              <div className="template-selector__item-container-logo">
                              <img src="/assets/Image/Icons/bulkqr.png" alt="" />
                              </div>
                              <div className="template-selector__item-container-text" to = 'BulkQR'>
                                <p className="template-selector__item-container-text-title">
                                  <span> {t("bulkqr")}</span>
                                </p>
                                <p className="template-selector__item-container-text-subtitle">
                                  <span> {t("createBulkQRCodes")}</span>
                                </p>
                              </div>
                          </button>
                      </NavLink>
                    </li>


                   {/* PDF */}
                    {/* <li className="card-section-content-PDF">
                    <NavLink to= 'PDF'> 
                        <button className='template-selector__item-container' to = 'PDF'
                         onMouseEnter={() =>
                          setImageSrc(
                            '/assets/Image/ImageHover/pdf.jpg'
                          )
                        }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/file.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'PDF'>
                              <p className="template-selector__item-container-text-title">
                                <span> PDF </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Hiển thị thông tin trong tệp PDF</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}
                      
                    {/* Mạng xã hội */}
                    {/* <li className="card-section-content-Social_media">
                    <NavLink to= 'Social_media'> 
                        <button className='template-selector__item-container' to = 'Social_media'
                            onMouseEnter={() =>
                              setImageSrc(
                                '/assets/Image/ImageHover/social.jpg'
                              )
                            }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/social-media.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Social_media'>
                              <p className="template-selector__item-container-text-title">
                                <span> Mạng xã hội </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Hiển thị thư viện hình ảnh</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                   {/* Facebook */}     
                   {/* <li className="card-section-content-Facebook">
                    <NavLink to= 'Facebook'> 
                        <button className='template-selector__item-container' to = 'Facebook'
                             onMouseEnter={() =>
                              setImageSrc(
                                '/assets/Image/ImageHover/fb.jpg'
                              )
                            }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/facebook.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Facebook'>
                              <p className="template-selector__item-container-text-title">
                                <span> Facebook </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Chuyển người dùng đến trang Facebook</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                
                  {/* Kinh doanh */}     
                  {/* <li className="card-section-content-Business">
                    <NavLink to= 'Business'> 
                        <button className='template-selector__item-container' to = 'Business'
                           onMouseEnter={() =>
                            setImageSrc(
                              '/assets/Image/ImageHover/business.jpg'
                            )
                          }
                        >
                            <div className="template-selector__item-container-logo">
                            <img src="/assets/Image/Icons/my-business.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Business'>
                              <p className="template-selector__item-container-text-title">
                                <span> Trang kinh doanh </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Lập hồ sơ thông tin doanh nghiệp</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                    {/* Ứng dụng */}     
                    {/* <li className="card-section-content-apps">
                    <NavLink to= 'apps'> 
                        <button className='template-selector__item-container' to = 'apps'
                           onMouseEnter={() =>
                            setImageSrc(
                              '/assets/Image/ImageHover/application.jpg'
                            )
                          }
                        >
                            <div className="template-selector__item-container-logo">
                                <img src="/assets/Image/Icons/smartphone.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'apps'>
                              <p className="template-selector__item-container-text-title">
                                <span> Ứng dụng </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Liên kết tới iOS App Store/Google Play</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                    {/* Menu */}     
                   {/* <li className="card-section-content-Menu">
                    <NavLink to= 'Menu'> 
                        <button className='template-selector__item-container' to = 'Menu'
                             onMouseEnter={() =>
                              setImageSrc(
                                '/assets/Image/ImageHover/menu.jpg'
                              )
                            }
                        >
                            <div className="template-selector__item-container-logo">
                                <img src="/assets/Image/Icons/menu.png" alt="" />
                            </div>
                            <div className="template-selector__item-container-text" to = 'Menu'>
                              <p className="template-selector__item-container-text-title">
                                <span> Menu </span>
                              </p>
                              <p className="template-selector__item-container-text-subtitle">
                                <span>Tạo menu kỹ thuật số cho nhà hàng</span>
                              </p>
                            </div>
                        </button>
                    </NavLink>
                    </li> */}

                  </ul>
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
                                    <img 
                                          className="template-preview-content-wrapper_image"
                                          src={imageSrc}
                                          // alt='Hover to change'
                                          // onMouseLeave={() =>
                                          //   setImageSrc(
                                          //     'https://ss-images.saostar.vn/wp700/pc/1597331599109/maxresdefault(1).jpg'
                                          //   )
                                          // }
                                        />
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
      {/* <NavLink to= 'URL'>Url</NavLink> */}
      <br></br>
      {/* <NavLink to= 'Text'>Text</NavLink> */}
      </div>
  );
}

export default Home;






