import "../Login/Login.sass"

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect,useState } from "react";
import { z } from "zod"

import axios from 'axios'

const schema = z.object({
    username: z.string().min(3, "O nome deve ter pelo menos três caracteres"),
    password: z.string().min(3, "A senha deve ter pelo menos seis caracteres"),
})


export default function Login(){
    const navigate = useNavigate()
    const [erros,setErros] = useState({})


    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const handleLogin = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/token/", data);

            if (response.data.access) {

                localStorage.setItem("token", response.data.access);
                localStorage.setItem("usuario",JSON.stringify(response.data.usuario))

                console.log(response.data.access)
                console.log(response.data.usuario.username)

                navigate("/Inicial");
            } else {
                alert("Credenciais inválidas");
            }
        } catch (error) {
            alert("Erro ao fazer login");
        }
    };


    return(
        <>
            <main className="main-login">
                <div className="container-img">
                    <img src="../src/assets/Logo.png" alt="" srcSet="" />
                </div>
                <div className="container-form">
                    <h1>Login</h1>
                    <form action="" className="form" onSubmit={handleSubmit(handleLogin)}>
                        <div className="input-error-container">
                            <label  className="label">Digite seu usuário
                                <input type="text" name="" id="" className={errors.username ? `error-container-input`:`input_text` } placeholder="Username"  {...register("username")} />
                            </label>
                            <div className="error-container">
                                {errors.username && <span className="error-span">{errors.username.message}</span>}
                            </div>
                        </div>

                        <div className="input-error-container">
                            <label className="label">Digite sua senha
                                <input type="password" name="" id="" className={errors.password ? `error-container-input`:`input_text`} placeholder="Password" {...register("password")}/>
                            </label>
                            <div className="error-container">
                                {errors.password && <span className="error-span">{errors.password.message}</span>}
                            </div>
                            
                        </div>
                     
                        <button type="submit" className="input-submit">Entrar</button>
                    </form>
                </div>
            </main>
        </>
    )
}