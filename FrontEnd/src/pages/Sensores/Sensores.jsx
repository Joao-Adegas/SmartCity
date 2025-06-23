import "../Sensores/Sensores.sass"


import { useState,useEffect,useRef } from "react"
import axios from 'axios'

import Cedula from "../../components/Cedula/Cedula"
import Modal from "../../components/Modal/Modal"

export default function Sensores(){
    const [sensores,setSensores] = useState([])

    const [modalOpen,setModalOpen] = useState(false)
    const [editing,isEditing] = useState(false)

    const [error,setError] = useState("")
    const [editSensor,SetEditSensor] = useState(null)
    const [status,setStatus] = useState(true)

    const token = localStorage.getItem("token")

    const sensorRef = useRef()
    const mac_addressRef = useRef()
    const unidade_medRef = useRef()
    const latitudeRef  = useRef()
    const longitudeRef = useRef()
    const statusRef = useRef()

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
            console.log("Erro ao buscar sensores",error)
        })
    }

    const handleSubmit = (e) =>{

        e.preventDefault();

        const formData = {
            sensor:sensorRef.current.value,
            mac_address:mac_addressRef.current.value,
            unidade_med:unidade_medRef.current.value,
            latitude:latitudeRef.current.value,
            longitude:longitudeRef.current.value,
            status:status
        }

        if(editing){

            axios.put(`http://127.0.0.1:8000/sensor/${editSensor.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
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
                buscarSensores()
                closeModal()
            })
            .catch(error =>{
                console.log("Erro ao criar um sensor",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
                setError(error)
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
            console.log(`Sensor ${id} deletado com sucesso`)
            buscarSensores()
        })
        .catch(error =>{
            console.log("Erro ao deletar sensor",error)
        })
    }

    useEffect(()=>{
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
                    onClose={closeModal}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                    ariaHideApp={false}
                >
                        <form action="" onSubmit={handleSubmit}>
                            <div className="modal-container">
                                <h2> Cadastrar Sensor </h2>
                                {error && <p className="erro-msg">{error}</p>}
                                <select ref={sensorRef}>
                                    <option value="" className="option"> Selecione um tipo de sensor </option>
                                    <option value="temperatura" className="option"> temperatura </option>
                                    <option value="umidade" className="option"> umidade </option>
                                    <option value="luminosidade" className="option"> luminosidade </option>
                                    <option value="contagem" className="option"> contagem </option>
                                </select>

                                <input type="text" name="" id="mac_address" placeholder="Digite o endereço" ref={mac_addressRef}/>
                                <input type="text" name="" id="unidade_med" placeholder="Digite a unidade de medida" ref={unidade_medRef}/>
                                <input type="text" name="" id="latitude" placeholder="Digite a Latitude" ref={latitudeRef}/>
                                <input type="text" name="" id="longitude" placeholder="Digite a Longitude" ref={longitudeRef}/>
                                
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

                            </div>
                            <button className="btn-modal" type="submit">Salvar</button>
                        </form>

                </Modal>
            </main>
        </>
    )
}