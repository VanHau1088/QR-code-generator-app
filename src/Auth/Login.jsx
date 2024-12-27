import './Login.css'
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from "antd";
import {Link} from 'react-router-dom'
import useLogin from '../hooks/useLogin';
const Login = () => {
  const {error, loading, LoginUser} = useLogin();
  const handleLogin = async (values) => {
   await LoginUser(values);
}
  return (
    <div className='Container_Login'>
      <div className='Login'>
          <Card className='form-container'>
              <Flex gap="large" align='center'> 
                  {/* Image */}
              <Flex flex={1}>
                <img src="/src/assets/Image/Login/login.png" className='auth-image' />
              </Flex>

                {/* Form */}
                <Flex vertical flex = {1}>
                    <Typography.Title  level={3} strong className='title'>
                       Sign In
                    </Typography.Title>
                    <Typography.Text type='secondary'strong className='slogan' >
                    Unlock you world.
                    </Typography.Text>
            
                <Form 
                  layout='vertical' 
                  onFinish={handleLogin}
                  autoComplete='off'
                  >
                      {/* 1 */}
                      <Form.Item 
                      label = 'Email' 
                      name = "email"
                      rules = {[
                        {
                          required: true,
                          message: 'Please input your Email!',
                          whitespace: true,
                        },
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        }
                      ]}
                      >
                        <Input  size='large' placeholder = 'Enter your email' />
                      </Form.Item>

                      {/* 3 */}
                      <Form.Item 
                      label = 'Password' 
                      name = "password"
                      rules = {[
                        {
                          required: true,
                          message: 'Please input your Password!',
                          whitespace: true,
                        },
                        {
                          type: 'password',
                          message: 'Please input at least 6 characters password!',
                          min: 6,
                        }
                      ]}
                      >
                        <Input.Password  size='large' placeholder = 'Enter your password' />
                      </Form.Item>
                   
                      {error && (
                        <Alert 
                        description={error} 
                        type='error'
                        showIcon 
                        closable
                        className='alert'
                        />
                      )}

                      <Form.Item>
                        <Button 
                        type= {`${loading ? '' : 'primary'}`} 
                        htmlType='submit' 
                        size='large'
                        className='btn'
                        >
                          {loading ? <Spin/> : "Sign In"}
                        </Button>
                      </Form.Item>
                      {/* 5 */}
                      <Form.Item>
                          <Link to = "/Register">
                            <Button size='large' className='btn'>
                           Create an Account
                            </Button>
                          </Link>
                      </Form.Item>
                </Form>
              </Flex>
              </Flex>
            </Card>
      </div>
      </div>
  )
}

export default Login