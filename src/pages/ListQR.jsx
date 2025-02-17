
import { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert, Button, Switch, Input, Select, message, Modal, InputNumber, DatePicker, Dropdown, Menu, Tag, Image   } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import './ListQR.css';

const ListQR = () => {
  const { userData } = useAuth();
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  // Modal states
  const [selectedQR, setSelectedQR] = useState(null);
  const [maxScans, setMaxScans] = useState(null); 
  const [visible, setVisible] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null); 
  const [expirationVisible, setExpirationVisible] = useState(false);

  useEffect(() => {
    if (!userData) {
      setError('User data is not available');
      setLoading(false);
      return;
    }

    const fetchQRCodes = async () => {
      try {
        const res = await axios.get('https://qr-code-generate-backend.onrender.com/api/user/qrs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(res.data)) {
          setQrs(res.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        
        setError('Failed to fetch QR codes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [userData]);

  // Filtering QR codes based on search and project selection

  const handleDelete = async (id) => {
        try {
          await axios.delete(`https://qr-code-generate-backend.onrender.com/api/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          setQrs(qrs.filter(qr => qr._id !== id));
        } catch (error) {
          console.error('Failed to delete QR code', error);
        }
      };
    
      const handleDeleteQRStatus = async (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái mã QR này? Hành động này không thể hoàn tác.");
        if (confirmed) {
          try {
            await axios.delete(`https://qr-code-generate-backend.onrender.com/api/delete/${id}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setQrs(qrs.filter(qr => qr._id !== id));
            history.replace('/');
          } catch (error) {
            console.error('Failed to delete QR code', error);
          }
        }
      };
    
      const handleToggleStatus = async (id) => {
        try {
          const res = await axios.patch(`https://qr-code-generate-backend.onrender.com/api/toggle-status/${id}`, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          setQrs(qrs.map(qr => qr._id === id ? { ...qr, isActive: res.data.isActive } : qr));
        } catch (error) {
          console.error('Failed to toggle QR code status', error);
        }
      };
    
      const filteredQrs = qrs.filter(qr => 
        qr.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        (selectedProject === "NoProject" ? !qr.project 
          : 
        (selectedProject ? qr.project === selectedProject : true))
      );
    
      const handleMaxScansChange = (value) => { 
        setMaxScans(value); 
      };
    
      const showMaxScansModal = (qr) => { 
        setSelectedQR(qr); 
        setMaxScans(qr.maxScans || 0); 
        setVisible(true); 
      };
    
      const handleMaxScansSubmit = async () => {
        try {
          await axios.patch(`https://qr-code-generate-backend.onrender.com/api/set-max-scans/${selectedQR._id}`, { maxScans }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          setQrs(qrs.map(qr => qr._id === selectedQR._id ? { ...qr, maxScans } : qr));
          message.success('Cập nhật số lượt quét tối đa thành công');
        } catch (error) {
          console.error('Failed to set max scans', error);
          message.error('Cập nhật số lượt quét tối đa thất bại');
        }
        setVisible(false);
      };
      
      const handleExpirationDateChange = (date) => { 
        setExpirationDate(date); 
      };
    
      const showExpirationDateModal = (qr) => { 
        setSelectedQR(qr); 
        setExpirationDate(qr.expirationDate ? moment(qr.expirationDate) : null); 
        setExpirationVisible(true); 
      };
    
      const handleExpirationDateSubmit = async () => { 
        try { 
          await axios.patch(`https://qr-code-generate-backend.onrender.com/api/set-expiration-date/${selectedQR._id}`, { expirationDate }, { 
             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
            }); 
            setQrs(qrs.map(qr => qr._id === selectedQR._id ? { ...qr, expirationDate } : qr));
            message.success('Cập nhật ngày hết hạn thành công'); 
          } catch (error) { 
            console.error('Failed to set expiration date', error); 
            message.error('Cập nhật ngày hết hạn thất bại'); 
          } 
            setExpirationVisible(false); 
        };
    

  // Define columns for the Ant Design table
  const columns = [
    {
      title: 'Chọn tất cả',
      dataIndex: 'qrImage ',
      key: 'qrImage',
      render: (text, record) => (
          <Image src={record.qrImage} alt="QR Code" />
      ),
    },
    {
      title: 'Tên mã QR',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Dự án',
      dataIndex: 'project',
      key: 'project',
      render: (text) => <b>{text ? text : 'Không có dự án'}</b>,
    },
    {
      title: 'Loại mã QR',
      dataIndex: 'type',
      key: 'type',
      // render: (data) => <b>{data ? data : 'Không xác định'}</b>
    },
    {
      title: 'Số lần quét / Tối đa',
      key: 'scanCount',
      render: (text, record) => `${record.scanCount} / ${record.maxScans}`,
    },

    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => (
        <>
            <Tag color={record.isActive ? 'green' : 'red'}>
              {record.isActive ? 'Đang hoạt động' : 'Đã tắt'}
            </Tag>
        </>
      ),
    
    },
    
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
 
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      // title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
        <div className='Dropdown'>
        <Switch
              checked={record.isActive}
              onChange={() => handleToggleStatus(record._id)}
              checkedChildren="Hoạt động"
              unCheckedChildren="Tắt"
              color={record.isActive ? 'green' : 'red'}

            />
            

          <Dropdown overlay={getActionMenu(record)} trigger={['click']} >
                <Button type="primary">...</Button>
            </Dropdown>

         
        </div>
            {/* Dropdown for actions */}
          {/* <Button type="primary" onClick={() => showMaxScansModal(record)}>Giới hạn số lượt quét</Button> */}
          {/* <Button type="primary" onClick={() => showExpirationDateModal(record)}>Thêm ngày hết hạn</Button> */}
          {/* <Switch
            checked={record.isActive}
            onChange={() => handleToggleStatus(record._id)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Tắt"
          /> */}
          {/* <Button type="primary" danger onClick={() => handleDelete(record._id)}>Xóa</Button>
          <NavLink to="/">
            <Button type="default" danger onClick={() => handleDeleteQRStatus(record._id)}>Thay đổi trạng thái mã QR</Button>
          </NavLink>  */}
         
        </>
      ),
    },
  ];

   // Define menu for dropdown actions
   const getActionMenu = (qr) => (
    <Menu>
      <Button  type="primary" onClick={() => showMaxScansModal(qr)}>Giới hạn số lượt quét</Button>
      <Button   type="primary"onClick={() => showExpirationDateModal(qr)}>Thêm ngày hết hạn</Button>
      <Button   type="primary" danger onClick={() => handleDelete(qr._id)}>Xóa</Button>
      <NavLink to="/">
        <Button  type="default" danger onClick={() => handleDeleteQRStatus(qr._id)}>Thay đổi trạng thái mã QR</Button>
      </NavLink>  
    </Menu>
  );


  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="dashboard">
      <Typography.Title level={2}>Mã QR của bạn</Typography.Title>

    <div className='creatQR_menu_listqr'>
      <div className="menu_listqr">
        <Input 
          type="text" 
          placeholder="Nhập tên mã QR" 
          value={searchKeyword} 
          onChange={(e) => setSearchKeyword(e.target.value)} 
          style={{ width: '200px', marginBottom: '16px' }}
        />
        <Select
          placeholder="Chọn dự án"
          style={{ width:'200px', marginBottom: '16px' }}
          onChange={value => setSelectedProject(value)} 
          value={selectedProject}
        >
          <Select.Option value="">Tất cả</Select.Option>
          {[...new Set(qrs.map(qr => qr.project))].map((project, index) => (
            <Select.Option key={index} value={project}>{project}</Select.Option>
          ))}
        </Select>
        </div>

        <div className='createQR'>
            <NavLink to="/" >
              <Button  type="primary" danger>Tạo mã QR</Button>
          </NavLink>  
        </div>
      
      </div>
      <Table
        columns={columns}
        dataSource={filteredQrs}
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Adjust pagination as needed
      />

      {/* Modals for max scans and expiration date */}
      <Modal title="Giới hạn số lượt quét" visible={visible} onOk={handleMaxScansSubmit} onCancel={() => setVisible(false)}>
        <InputNumber min={0} value={maxScans} onChange={handleMaxScansChange} />
      </Modal>
      
      <Modal title="Thêm ngày hết hạn" visible={expirationVisible} onOk={handleExpirationDateSubmit} onCancel={() => setExpirationVisible(false)}>
        <DatePicker value={expirationDate} onChange={handleExpirationDateChange} />
      </Modal>
      
    </div>
  );
};

export default ListQR;
