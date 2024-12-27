import { useEffect, useState } from 'react';
import { Card, Typography, Spin, Alert, Button, Switch } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ListQR.css'

const ListQR = () => {
  const { userData } = useAuth();
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData) {
      setError('User data is not available');
      setLoading(false);
      return;
    }

    const fetchQRCodes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/qrs', { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Response data:', res.data);
        if (Array.isArray(res.data)) {
          setQrs(res.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError('Failed to fetch QR codes');
        console.error('Failed to fetch QR codes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [userData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${id}`, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setQrs(qrs.filter(qr => qr._id !== id)); // Cập nhật danh sách mã QR sau khi xóa
    } catch (error) {
      console.error('Failed to delete QR code', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/toggle-status/${id}`, {}, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setQrs(qrs.map(qr => qr._id === id ? { ...qr, isActive: res.data.isActive, shortUrl: res.data.isActive ? qr.shortUrlOriginal : 'https://your-domain.com/qr-disabled' } : qr)); // Cập nhật trạng thái isActive và shortUrl
    } catch (error) {
      console.error('Failed to toggle QR code status', error);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="dashboard">
      <Typography.Title level={2}>Mã QR của bạn</Typography.Title>
      <div className='list-qr'>
      {qrs.length > 0 ? (
        qrs.map(qr => (
          <Card key={qr._id} title={qr.name} style={{ marginBottom: '16px' }}>
            <p>{qr.data.url}</p>
            <p>Ngày tạo: {new Date(qr.createdAt).toLocaleDateString()}</p>
            <p>Trạng thái: {qr.isActive ? 'Đang hoạt động' : 'Đã tắt'}</p>
            <p>Số lần quét: {qr.scanCount}</p>
            <img src={qr.qrImage} alt="QR Code" />
            <Switch 
              checked={qr.isActive} 
              onChange={() => handleToggleStatus(qr._id)}
              checkedChildren="Hoạt động"
              unCheckedChildren="Tắt"
            />
            <Button type="primary" danger onClick={() => handleDelete(qr._id)}>Xóa</Button>
          </Card>
        ))
      ) : (
        <Typography.Text>No QR codes found</Typography.Text>
      )}
      </div>
    </div>
  );
};

export default ListQR;


