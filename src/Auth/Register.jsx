import './Register.css'
import { Card, Flex, Typography, Form, Input, Button, Spin, Alert } from "antd";
import {Link} from 'react-router-dom'
// import Alert from 'antd/es/alert/Alert';
import useSignup from '../hooks/useSignup';
function Register() {
  const {loading, error, registerUser} = useSignup();
  const handleRegister = (values) => {
    registerUser(values)
  }
  return (
    <div className='Container_Register'>
      <div className="Register">
          <Card className='form-container'>
              <Flex gap="large" align='center'> 
                {/* Form */}
                <Flex vertical flex = {1}>
                    <Typography.Title  level={3} strong className='title'>
                        Create an account
                    </Typography.Title>
                    <Typography.Text type='secondary'strong className='slogan' >
                      Join for exclusive access! 
                    </Typography.Text>
            
                <Form 
                  layout='vertical' 
                  onFinish={handleRegister}
                  autoComplete='off'
                  >
                    {/* 1 */}
                      <Form.Item 
                      label = 'Full name' 
                      name = "name"
                      rules = {[
                        {
                          required: true,
                          message: 'Please input your full name!',
                          whitespace: true,
                        },
                      ]}
                      >
                        <Input size='large' placeholder = 'Enter your full name' />
                      </Form.Item>

                      {/* 2 */}
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

                        {/* 4 */}
                        <Form.Item 
                      label = 'Password' 
                      name = "passwordConfirm"
                      rules = {[
                        {
                          required: true,
                          message: 'Please input your Confirm Password!',
                          whitespace: true,
                        },
                        {
                          type: 'password',
                          message: 'Please input at least 6 characters password!',
                          min: 6,
                        }
                      ]}
                      >
                        <Input.Password  
                        size='large' 
                        placeholder = 'Re-enter your password' />
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
                          {loading ? <Spin/> : "Create Account"}
                        
                        </Button>
                      </Form.Item>
                      {/* 5 */}
                      <Form.Item>
                          <Link to = "/Login">
                            <Button size='large' className='btn'>
                            Sign In
                            </Button>
                          </Link>
                      </Form.Item>
                </Form>
              </Flex>

              {/* Image */}
              <Flex flex={1}>
                <img src="//assets/Image/Register/register.png" className='auth-image' />
              </Flex>
              </Flex>
            </Card>
      </div>
      </div>
  )
}

export default Register