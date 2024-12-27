import  { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QRScanHandler = () => {
  const { shortUrl } = useParams();

  useEffect(() => {
    const checkQRCode = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/check/${shortUrl}`);
        console.log('QR code data:', res.data);

        // Xử lý dữ liệu mã QR nếu cần, ví dụ chuyển hướng hoặc hiển thị thông tin
      } catch (error) {
        console.error('Error checking QR code:', error);
      }
    };

    checkQRCode();
  }, [shortUrl]);

  return (
    <div>
      <h1>QR Scan Handler</h1>
      <p>Đang xử lý mã QR...</p>
    </div>
  );
};

export default QRScanHandler;
