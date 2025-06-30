import "../Login/Login.sass"

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect,useState } from "react";
import { z } from "zod"

import Swal from "sweetalert2";
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
              Swal.fire({
                title: 'Erro 404 - Credenciais Inválidas',
                text: 'Confira suas usuário e sua senha.',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            })
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
                            <label  className="label">Usuário
                                <input type="text" name="" id="" className={errors.username ? `error-container-input`:`input_text` } placeholder="Digite seu usuário"  {...register("username")} />
                            </label>
                            <div className="error-container">
                                {errors.username && <span className="error-span">{errors.username.message}</span>}
                            </div>
                        </div>

                        <div className="input-error-container">
                            <label className="label">Senha
                                <input type="password" name="" id="" className={errors.password ? `error-container-input`:`input_text`} placeholder="Digite sua senha" {...register("password")}/>
                            </label>
                            <div className="error-container">
                                {errors.password && <span className="error-span">{errors.password.message}</span>}
                            </div>
                            
                        </div>
                     
                        {/* <!-- From Uiverse.io by satyamchaudharydev -->  */}
                        <button className="button">
                        Apply Now
                        <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                            clipRule="evenodd"
                            ></path>
                        </svg>
                        </button>

                    </form>
                </div>
            </main>
        </>
    )
}