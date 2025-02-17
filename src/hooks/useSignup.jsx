import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { message } from "antd";

function useSignup() {
    const {login} = useAuth()
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const registerUser = async (values) => {
            if(values.password !== values.passwordConfirm){
                return setError("Please are not the same as the password")
            }

            try{
                    setError(null);
                    setLoading(true);
                    const res = await fetch('https://qr-code-generate-backend.onrender.com/api/auth/signup', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    if(res.status === 201){
                        message.success(data.message);
                        login(data.token, data.user);
                    }
                    else if(res.status === 4000){
                            setError(data.message);
                    }
                    else{
                        message.error('Registration failed')
                    }
            }catch(error){
                message.error('Registration failed', error)
            }finally{
                setLoading(false);
            }
    }
    return {loading, error, registerUser}
}

export default useSignup