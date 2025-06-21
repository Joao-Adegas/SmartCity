import "../Dashboard/Dashboard.sass"
import Aside from "../../components/aside/Aside"
import Modal from "../../components/Modal/Modal"
import { useState,useEffect,useRef } from "react"
import axios from 'axios'

export default function Dashboard(){

    const [modalOpen,setModalOpen] = useState(null)
    const [status,setStatus] = useState(true)

    const [sensor,setSensores] =  useState([]);
    const [ambiente,setAmbientes] =  useState([]);
    const [historico,setHistoricos] =  useState([]);

    const [quantidadeAmbientes,setQuantidadeAmbientes] = useState(0)
    const [quantidadeHistoricos,setQuantidadeHistoricos] = useState(0)
    const [quantidadeSensorTemperatura,setQuantidadeSensorTemperatura] = useState(0)
    const [quantidadeSensorUmidade,setQuantidadeSensorUmidade] = useState(0)
    const [quantidadeSensorLuminosidade,setQuantidadeSensorLuminosidade] = useState(0)
    const [quantidadeSensorContagem,setQuantidadeSensorContagem] = useState(0)

    const token = localStorage.getItem("token")
 
    //Sensores
    const sensorRef = useRef()
    const mac_addressRef = useRef()
    const unidade_medRef = useRef()
    const latitudeRef  = useRef()
    const longitudeRef = useRef()
    const statusRef = useRef()
    const ativoRef = useRef(null);
    const inativoRef = useRef(null);

    //Ambientes
    const sigRef = useRef()
    const descricaoRef =useRef()
    const niRef = useRef()
    const responsavelRef = useRef()

    //Históricos
    const sensoresRef = useRef()
    const ambientesRef = useRef()
    const valorRef = useRef()
    const timestampRef = useRef()

    const cleanerForm = () => {
        setTimeout(() => {

            if(sensorRef.current)sensorRef.current.value = ''
            if(mac_addressRef.current)mac_addressRef.current.value = ''
            if(unidade_medRef.current)unidade_medRef.current.value = ''
            if(latitudeRef.current)latitudeRef.current.value = ''
            if(longitudeRef.current)longitudeRef.current.value = ''
            if(statusRef.current)statusRef.current.value = ''

            if(sigRef.current)sigRef.current.value = ''
            if(descricaoRef.current)descricaoRef.current.value = ''
            if(niRef.current)niRef.current.value = ''
            if(responsavelRef.current)responsavelRef.current.value = ''

            if(sensoresRef.current)sensoresRef.current.value = ''
            if(ambientesRef.current)ambientesRef.current.value = ''
            if(valorRef.current)valorRef.current.value = ''
            if(timestampRef.current)timestampRef.current.value = ''

        }, 0);
    }
    
    const openCreateModal = (modal) => {
        console.log("Modal Aberto")
        setModalOpen(modal)
        setTimeout(()=>cleanerForm(),100)
    }
    
    const closeModal = () =>{
        console.log("Modal fechado")
        setModalOpen(false)
    }
    
    const buscarSensores = () => {
        axios.get("http://127.0.0.1:8000/sensor/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.results)
            setSensores(response.data)
        })
        .catch(error => {
            console.log("Erro ao buscar sensores",error)
        })
    }

    const buscarAmbientes = () => {
        axios.get("http://127.0.0.1:8000/ambiente/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.results)
            setAmbientes(response.data)
        })
        .catch(error => {
            console.log("Erro ao buscar ambiente",error)
        })
    }

    const buscarHistoricos = () => {
        axios.get("http://127.0.0.1:8000/historico/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.results)
            setHistoricos(response.data)
        })
        .catch(error => {
            console.log("Erro ao buscar ambiente",error)
        })
    }
    
    const cadatrarSensor = (e) =>{
        e.preventDefault(); 
        const formData = {
            sensor:sensorRef.current.value,
            mac_address:mac_addressRef.current.value,
            unidade_med:unidade_medRef.current.value,
            latitude:latitudeRef.current.value,
            longitude:longitudeRef.current.value,
            status:status
        }
        
        axios.post("http://127.0.0.1:8000/sensor/",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            buscarSensores()
            closeModal()
            contarSensorTemperartura()
            contarSensorUmidade()
            contarSensorLuminosidade()
            contarSensorContagem()
        })
        .catch(error =>{
              console.log("Erro ao cadastrar um sensor",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
        })
    }

    const cadastrarAmbiente = (e) =>{
        e.preventDefault(); 
        const formData = {
            sensor:sensorRef.current.value,
            mac_address:mac_addressRef.current.value,
            unidade_med:unidade_medRef.current.value,
            latitude:latitudeRef.current.value,
            longitude:longitudeRef.current.value,
            status:status
        }
        
        axios.post("http://127.0.0.1:8000/sensor/",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            buscarAmbientes()
            closeModal()
            contarAmbientes()
        })
        .catch(error =>{
            console.log("Erro ao cadastrar um sensor",error)
        })
    }

    const cadastrarHistorico = (e) =>{
        e.preventDefault(); 
        
        const formData = {
            sensor:sensorRef.current.value,
            mac_address:mac_addressRef.current.value,
            unidade_med:unidade_medRef.current.value,
            latitude:latitudeRef.current.value,
            longitude:longitudeRef.current.value,
            status:status
        }
        
        axios.post("http://127.0.0.1:8000/sensor/",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            buscarHistoricos()
            closeModal()
            contarHistoricos()
        })
        .catch(error =>{
            console.log("Erro ao cadastrar um sensor",error)
        })
    }

    const contarAmbientes = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_ambientes/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Ambientes:"+ response.data.quantidade)
            setQuantidadeAmbientes(response.data.quantidade);
        });
    }
    const contarHistoricos = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_historicos/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Historicos:"+ response.data.quantidade)
            setQuantidadeHistoricos(response.data.quantidade);
        });
    }

    const contarSensorTemperartura = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_sensor_temperatura/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Sensores de temperatura:" + response.data.temperatura)
            setQuantidadeSensorTemperatura(response.data.temperatura);
        });
    }
    const contarSensorUmidade = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_sensor_umidade/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Sensores de umidade:" + response.data.umidade)
            setQuantidadeSensorUmidade(response.data.umidade);
        });
    }
    const contarSensorLuminosidade = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_sensor_luminosidade/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Sensores de luminosidade:" + response.data.luminosidade)
            setQuantidadeSensorLuminosidade(response.data.luminosidade);
        });
    }
    const contarSensorContagem = () =>{
        axios.get("http://127.0.0.1:8000/quantidade_sensor_contagem/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Sensores de contagem:" + response.data.contagem)
            setQuantidadeSensorContagem(response.data.contagem);
        });
    }

    useEffect(()=>{
        contarAmbientes()
        contarHistoricos()
        contarSensorTemperartura()
        contarSensorUmidade()
        contarSensorLuminosidade()
        contarSensorContagem()
    },[])
    
    return(
        <>
            <main className="main-dashboard-page">
                
                <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Sensores</h1>
                        </div>
                        <div className="options">
                            <button className="btn-dashboard" onClick={() => openCreateModal("sensor")}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Exportar <img src="../src/assets/exel-icon.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Importar <img src="../src/assets/xls-icon.png" alt="add_icon" /></button>
                        </div>
                    </div>
                    <div className="container-cards-dashboard">
                        <div className="card">
                            <p className="sensor-p-card">Temperatura</p>
                            <h2 className="sensor-quantity-card">{quantidadeSensorTemperatura}</h2>
                        </div>
                        <div className="card">
                            <p className="sensor-p-card">Umidade</p>
                            <h2 className="sensor-quantity-card">{quantidadeSensorUmidade}</h2>
                        </div>
                        <div className="card">
                            <p className="sensor-p-card">Luminosidade</p>
                            <h2 className="sensor-quantity-card">{quantidadeSensorLuminosidade}</h2>
                        </div>
                        <div className="card">
                            <p className="sensor-p-card">Contagem</p>
                            <h2 className="sensor-quantity-card">{quantidadeSensorContagem}</h2>
                        </div>
                    </div>

                </div>

                <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Ambientes</h1>
                        </div>
                        <div className="options">
                            <button className="btn-dashboard" onClick={() => openCreateModal("ambiente")}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Exportar <img src="../src/assets/exel-icon.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Importar <img src="../src/assets/xls-icon.png" alt="add_icon" /></button>
                        </div>
                    </div>
                    <div className="container-cards-dashboard">
                        <div className="card">
                            <h2 className="sensor-quantity-card">{quantidadeAmbientes}</h2>
                        </div>
                    </div>

                </div>

                  <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Históricos</h1>
                        </div>
                        <div className="options">
                            <button className="btn-dashboard" onClick={() => openCreateModal("historico")}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Exportar <img src="../src/assets/exel-icon.png" alt="add_icon" /></button>
                            <button className="btn-dashboard">Importar <img src="../src/assets/xls-icon.png" alt="add_icon" /></button>
                        </div>
                    </div>
                    <div className="container-cards-dashboard">
                        <div className="card">
                            <h2 className="sensor-quantity-card">{quantidadeHistoricos}</h2>
                        </div>
                    </div>

                </div>

                <Modal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                    ariaHideApp={false}
                >
                    {/* Modal pra Sensores */}
                    {modalOpen === "sensor" && (
                        <form action="" onSubmit={cadatrarSensor}>
                            <div className="modal-container">
                                <h2> Cadastrar Sensor </h2>

                                <select ref={sensorRef}>
                                    <option value=""> Selecione um tipo de sensor </option>
                                    <option value="temperatura"> temperatura </option>
                                    <option value="umidade"> umidade </option>
                                    <option value="luminosidade"> luminosidade </option>
                                    <option value="contador"> contador </option>
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
                            <button className="btn-modal" type="submit">Cadastrar</button>
                        </form>
                    )}

                    {/* Modal pra Ambientes */}
                    {modalOpen === "ambiente" && (
                        <div>
                            <h2>Cadastro de Ambiente</h2>
                        </div>
                    )}

                    {/* Modal pra Históricos */}
                    {modalOpen === "historico" &&(
                        <div>
                            <h2>Cadastro de histórico</h2>
                        </div>
                    )}

                </Modal>

            </main>
          
        </>
    )
}