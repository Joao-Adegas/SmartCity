import "../Sensores/Sensores.sass"
import Swal from "sweetalert2"

import { useState,useEffect,useRef } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import axios from 'axios'

import Modal from "../../components/Modal/Modal"

const schema = z.object({
    sensor : z.string().min(1, "Escolha um tipo de sensor"),
    mac_address: z.string().nonempty("Preencha o endereço do sensor").regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/,"Formato do Endereço inválido"),
    unidade_med:z.string().nonempty("Preencha a unidade de medida"),
    latitude:z.string().nonempty("Preencha a Latitude"),
    longitude:z.string().nonempty("Preencha a Longitude")
})

export default function Sensores(){
    const [sensores,setSensores] = useState([])

    const [modalOpen,setModalOpen] = useState(false)
    const [editing,isEditing] = useState(false)

    const [error,setError] = useState("")
    const [editSensor,SetEditSensor] = useState(null)
    const [status,setStatus] = useState(true)

    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const sensorRef = useRef()
    const mac_addressRef = useRef()
    const unidade_medRef = useRef()
    const latitudeRef  = useRef()
    const longitudeRef = useRef()
    const statusRef = useRef()

    const verificacaoToken = (token) => {

        if (!token) {
            
           Swal.fire({
                title: 'Erro 401 - Não autorizado',
                text: 'Você precisa estar logado para acessar esta página.',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                navigate('/Login');
            });
        }
        
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const openEditModal = (sensor) => {
        SetEditSensor(sensor)
        setModalOpen(true)
        isEditing(true)
        setTimeout(() => {
            if (sensorRef.current) sensorRef.current.value = sensor.sensor;
            if (mac_addressRef.current) mac_addressRef.current.value = sensor.mac_address;
            if (unidade_medRef.current) unidade_medRef.current.value = sensor.unidade_med;
            if (latitudeRef.current) latitudeRef.current.value = sensor.latitude;
            if (longitudeRef.current) longitudeRef.current.value = sensor.longitude;
            setStatus(sensor.status);
        }, 0);
    }

 const cleanerForm = () => {
        setTimeout(() => {

            if(sensorRef.current)sensorRef.current.value = ''
            if(mac_addressRef.current)mac_addressRef.current.value = ''
            if(unidade_medRef.current)unidade_medRef.current.value = ''
            if(latitudeRef.current)latitudeRef.current.value = ''
            if(longitudeRef.current)longitudeRef.current.value = ''
            if(statusRef.current)statusRef.current.value = ''

        }, 0);
    }

    const openCreateModal = (modal) => {
        console.log("Modal Aberto")
        isEditing(false)
        setModalOpen(true)
        setTimeout(()=>cleanerForm(),100)
    }

    const closeModal = () =>{
        setModalOpen(false)
    }

    const buscarSensores = () => {
        axios.get("http://127.0.0.1:8000/sensor/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setSensores(response.data)
        })
        .catch(error => {
            if (error.response?.status === 401) {
                Swal.fire({
                title: 'Seu token expirou',
                text: 'Faça login novamente.',
                icon: 'warning',
                confirmButtonText: 'OK',
                })
                .then(() => {
                    localStorage.removeItem("token");
                    navigate('/Login');
                });
            } else {
                console.log("Erro ao buscar sensores", error);
            }
        })
    }

    const handleSensor = (data) =>{

        const formData = {
            ...data,
            status:status
        }

        if(editing){

            axios.put(`http://127.0.0.1:8000/sensor/${editSensor.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                Swal.fire(`Sensor ${editSensor.id} editado com sucesso!`)
                buscarSensores()
                closeModal()
            })
            .catch(error => {
                console.log("Erro ao Editar um sensor",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
                setError(error)
            })
        }
        else{

            axios.post("http://127.0.0.1:8000/sensor/",formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                Swal.fire(`Sensor cadastrado com sucesso!`)
                buscarSensores()
                closeModal()
            })
            .catch(error =>{
                console.log("Erro ao criar um sensor",Object.values(error.response.data)[0][0])
                // let erro = Object.values(error.response.data)[0][0]
                
            })
        }

    }

    const deletarSensor = (id) =>{
        axios.delete(`http://127.0.0.1:8000/sensor/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            Swal.fire(`Sensor ${id} deletado com sucesso!`)
            console.log(`Sensor ${id} deletado com sucesso`)
            buscarSensores()
        })
        .catch(error =>{
            console.log("Erro ao deletar sensor",error)
        })
    }

    useEffect(()=>{
        verificacaoToken(token)
        buscarSensores()
    },[])

    return(
        <>
            <main className="main-sensores">
                <div className="top-painel-sensores">
                    <h1 className="title-sensores-cadastrados">Sensores Cadastrados</h1>
                    <div className="btn-painel-sensores">
                        <button className="btn-dashboard" onClick={() => openCreateModal()}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                    </div>

                </div>
                <div className="container-tabela-sensores">

                    <div className="container-campos">
                        <h2 className="campo-tabela-sensor">Tipo</h2>
                        <h2 className="campo-tabela-sensor">Endereço</h2>
                        <h2 className="campo-tabela-sensor">Unidade medida</h2>
                        <h2 className="campo-tabela-sensor">Latitude</h2>
                        <h2 className="campo-tabela-sensor">Longitude</h2>
                        <h2 className="campo-tabela-sensor">Status</h2>
                        <h2 className="campo-tabela-sensor">Opções</h2>
                    </div>

                    <div className="container-tabela">
                            {sensores.length > 0 && (
                            <ul className="ul-sensores">
                                {sensores.map(a => (
                                    <li key={a.id} className="li-sensores">
                                        <div className="cedula-sesnores">

                                            <h2>{a.sensor}</h2>
                                            <h2>{a.mac_address}</h2>
                                            <h2>{a.unidade_med}</h2>
                                            <h2>{a.latitude}</h2>
                                            <h2>{a.longitude}</h2>
                                            <h2>{a.status ? "Ativo" : "Inativo"}</h2>

                                            <div className="opcoes">
                                                <button className="icon-opcoes" onClick={() => deletarSensor(a.id)}>
                                                    <img src="../src/assets/lixo.png" alt="icon-delete" className="icon-actions"/>
                                                </button>
                                                <button className="icon-opcoes" onClick={() => openEditModal(a)}>
                                                    <img src="../src/assets/lapis.png" alt="edit-icon" className="icon-actions"/>
                                                </button>
                                            </div>
                                            
                                        </div>

                                    </li>
                                ))}
                        
                            </ul>
                        )}

                    </div>
                    
                </div>

                <Modal
                    isOpen={modalOpen}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                    ariaHideApp={true}
                >
                        <form action="" onSubmit={handleSubmit(handleSensor)}>
                            <div className="modal-container">
                                <h2> Cadastrar Sensor </h2>
                                {error && <p className="erro-msg">{error}</p>}


                                <div className="container-input">
                                    <label htmlFor="">Selecione um tipo de Sensor
                                        <select {...register("sensor")} className={errors.sensor ? `error-container-input`:``} >
                                            <option value="" className="option">Selecione</option>
                                            <option value="temperatura" className="option"> temperatura </option>
                                            <option value="umidade" className="option"> umidade </option>
                                            <option value="luminosidade" className="option"> luminosidade </option>
                                            <option value="contagem" className="option"> contagem </option>
                                        </select>
         
                                    </label>
                                    <div className="container-error">
                                        {errors.sensor && <span className="error">{errors.sensor.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite o endereço
                                        <input 
                                        type="text"
                                        id="mac_address" 
                                        placeholder="00:1B:44:11:3A:BA"
                                        className={errors.mac_address ? `error-container-input`:``} 
                                        {...register("mac_address")}
                                        />
                                    </label>
                                    <div className="container-error">
                                        {errors.mac_address && <span className="error">{errors.mac_address.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite a unidade de medida
                                        <input 
                                        type="text" 
                                        name="" 
                                        id="unidade_med" 
                                        placeholder="(%,°C,uni)"  
                                        className={errors.unidade_med ? `error-container-input`:``}  
                                        {...register("unidade_med")}/>
                                    </label>
                                    <div className="container-error">
                                        {errors.unidade_med && <span className="error">{errors.unidade_med.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite a Latitude
                                        <input 
                                        type="text" 
                                        name="" 
                                        id="latitude" 
                                        placeholder="-23.55052"
                                        className={errors.latitude ? `error-container-input`:``} 
                                        {...register("latitude")}/>
                                    </label>
                                    <div className="container-error">
                                        {errors.latitude && <span className="error">{errors.latitude.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">Digite a Longitude
                                        <input 
                                        type="text" 
                                        name="" 
                                        id="longitude" 
                                        placeholder="-43.172896" 
                                        className={errors.longitude ? `error-container-input`:``} 
                                        {...register("longitude")}/>
                                    </label>
                                    <div className="container-error">
                                        {errors.longitude && <span className="error">{errors.longitude.message}</span>}
                                    </div>
                                </div>

                                <div className="radio">

                                    <input
                                    type="radio"
                                    name="status"
                                    value="ativo"
                                    checked={status === true}
                                    onChange={() => setStatus(true)}
                                    />

                                    <label htmlFor="">Ativo</label>

                                    <input
                                    type="radio"
                                    name="status"
                                    value="inativo"
                                    checked={status === false}
                                    onChange={() => setStatus(false)}
                                    />

                                    <label htmlFor="">Inativo</label>
                                </div>

                                <div className="btns-modal">
                                    <button className="btn-modal" type="submit">Salvar</button>
                                    <button onClick={closeModal} className="btn-modal">Fechar</button>
                                </div>
                            </div>
                        </form>

                </Modal>
            </main>
        </>
    )
}