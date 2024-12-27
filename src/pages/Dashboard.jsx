import { Card, Avatar, Button, Typography } from 'antd'; // Bỏ import không cần thiết
import { useAuth } from '../context/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header";
function Dashboard() {
  const { userData, logout } = useAuth(); // sửa lỗi chính tả UserData thành userData
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout();
    navigate('/Login'); // Chuyển hướng người dùng về trang đăng nhập
  };
  
     return (
    <div className='Container_Dashboard'>
        <Header />
        <div className="Dashboard">
      
          <Card className="profile-card">
            <div className="profile"> {/* Thay thế Flex bằng div */}
             
              <Avatar size={150} icon={<UserOutlined />} className="avatar" />
             
              <Typography.Title level={2} strong className="username">
                {userData.name}
              </Typography.Title>
             
              <Typography.Text type="secondary" strong>
                Email: {userData.email}
              </Typography.Text> {/* Đóng thẻ đúng cách */}
              
              <Typography.Text type="secondary" strong>
                Role: {userData.role}
              </Typography.Text> {/* Đóng thẻ đúng cách */}
              <Button
                type="primary"
                size="large"
                shape="round"
                className="profile-btn"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Card>
      </div>
    </div>
  );
}

export default Dashboard;
