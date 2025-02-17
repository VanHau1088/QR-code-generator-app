// import { useState } from "react"
// import { useAuth } from "../context/AuthContext"
// import { message } from "antd";
// import { useNavigate } from 'react-router-dom';
// function useLogin() {
//     const {login} = useAuth()
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(null);
//     const navigate = useNavigate(); // Khởi tạo useNavigate
//     const LoginUser = async (values) => {
//             try{
//                     setError(null);
//                     setLoading(true);
//                     const res = await fetch('https://qr-code-generate-backend.onrender.com/api/auth/login', {
//                         method: 'POST',
//                         body: JSON.stringify(values),
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     });
//                     const data = await res.json();
//                     if(res.status === 200){
//                         message.success(data.message);
//                         login(data.token, data.user);
//                         localStorage.setItem('token', data.token); // Lưu token vào localStorage
//                         navigate('/Dashboard'); // Điều hướng người dùng đến trang dashboard
                        
//                     }
//                     else if(res.status === 404){
//                             setError(data.message);
//                     }
//                     else{
//                         message.error('Login failed')
//                     }
//             }catch(error){
//                 message.error('Login failed', error)
//             }finally{
//                 setLoading(false);
//             }
//     }
//     return {loading, error, LoginUser}
// }

// export default useLogin

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';

function useLogin() {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const navigate = useNavigate();

    const LoginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('https://qr-code-generate-backend.onrender.com/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (res.status === 200) {
                message.success(data.message);
                login(data.token, data.user);
                localStorage.setItem('token', data.token); // Lưu token vào localStorage
                navigate('/'); // Điều hướng người dùng đến trang dashboard
            } else if (res.status === 404) {
                setError(data.message);
            } else {
                message.error('Login failed');
            }
        } catch (error) {
            message.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, LoginUser }
}

export default useLogin;
