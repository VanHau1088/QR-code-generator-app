
import { useState } from 'react';
import {
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import './Sidebar.css';
import Dashboard from './Dashboard';
import ListQR from './ListQR'
import Analyze from './Analyze';

const { Sider, Content } = Layout;

function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const [selectedKey, setSelectedKey] = useState('1'); // State for selected menu item
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Function to handle menu item click
    const handleMenuClick = (e) => {
        setSelectedKey(e.key); // Update selected key
    };
     setCollapsed
    // Render content based on selected key
    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <div><Analyze></Analyze> </div>;
            case '2':
                return <div><ListQR></ListQR></div>;
            case '3':
                return <div><Dashboard></Dashboard></div>;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]} // Set selected key
                    onClick={handleMenuClick} // Handle menu click
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Analyze',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'My QR',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: 'Account',
                        },
                    ]}
                />
            </Sider>
            
            <Layout>
                {/* <Header style={{ padding: 0 }}> */}
                   
                {/* </Header> */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {renderContent()} {/* Render content based on selection */}
                </Content>
            </Layout>
        </Layout>
    );
}

export default Sidebar;

