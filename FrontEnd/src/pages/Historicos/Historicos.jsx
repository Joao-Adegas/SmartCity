import "../Historicos/Historicos.sass"
import CedulaAH from "../../components/CedulaAH/CedulaAH"

import { useEffect, useState ,useRef} from "react"
import axios from "axios"
import Modal from "../../components/Modal/Modal"

export default function Historicos(){

    const token = localStorage.getItem("token")

    const [historicos,setHistoricos] = useState([])


    const [editing,isEditing] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [editHistorico,SetEditHistorico] = useState(null)


    const sensorRef = useRef()
    const ambienteRef =useRef()
    const valorRef = useRef()
    const timestampRef = useRef()

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

    const openEditModal = (historico) => {
        SetEditHistorico(historico)
        setModalOpen(true)
        isEditing(true)
        setTimeout(() => {
            if (sensorRef.current) sensorRef.current.value = historico.sensor;
            if (ambienteRef.current) ambienteRef.current.value =  historico.ambientes;
            if (valorRef.current) valorRef.current.value = historico.valor;
            if (timestampRef.current) timestampRef.current.value = historico.timestamp;
        }, 0);
    }

    const cleanerForm = () => {
        setTimeout(() => {
            if (sensorRef.current) sensorRef.current.value = '';
            if (ambienteRef.current) ambienteRef.current.value = '';
            if (valorRef.current) valorRef.current.value = '';
            if (timestampRef.current) timestampRef.current.value = '';
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

 const handleSubmit = (e) =>{

        e.preventDefault();

        const formData = {
            sensor:sensorRef.current.value,
            ambientes:ambienteRef.current.value,
            valor:valorRef.current.value,
            timestamp:timestampRef.current.value,
        }

        if(editing){

            axios.put(`http://127.0.0.1:8000/historico/${editHistorico.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                buscarHistoricos()
                closeModal()
            })
            .catch(error => {
                console.log("Erro ao Editar um histórico",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
                  if (error.response && error.response.data) {
                        console.log("Erro ao editar histórico", Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado");
                    } else {
                        console.log("Erro inesperado:", error.message || error);
                    }
            })
        }
        else{
            console.log(editHistorico)
            axios.post("http://127.0.0.1:8000/historico/",formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                buscarHistoricos()
                closeModal()
                console.log(`Histórico criado com sucesso`)
            })
            .catch(error =>{
                console.log("Erro ao criar um histórico",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
                  if (error.response && error.response.data) {
                        console.log("Erro ao editar histórico", Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado");
                    } else {
                        console.log("Erro inesperado:", error.message || error);
                    }
            })
        }

    }

    const deletarHistorico = (id) =>{
        axios.delete(`http://127.0.0.1:8000/historico/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            console.log(`Historico ${id} deletado com sucesso`)
            buscarHistoricos()
        })
        .catch(error =>{
            console.log("Erro ao deletar sensor",Object.values(error.response.data)?.[0] || "Erro inesperado")
        })
    }
    
    useEffect(()=>{
        buscarHistoricos()
    },[])

    return(
        <>
            <main className="main-sensores">
                <div className="top-painel-sensores">
                    <h1 className="title-sensores-cadastrados">Históricos Cadastrados</h1>
                    <div className="btn-painel-sensores">
                        <button className="btn-dashboard" onClick={openCreateModal}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                    </div>

                </div>
                <div className="container-tabela-sensores">

                    <div className="container-campos">
                        <h2 className="campo-tabela-sensor">Sensor</h2>
                        <h2 className="campo-tabela-sensor">Sig Ambiente</h2>
                        <h2 className="campo-tabela-sensor">Responsável Ambiente</h2>
                        <h2 className="campo-tabela-sensor">Timestamp</h2>
                        <h2 className="campo-tabela-sensor">Valor</h2>
                        <h2 className="campo-tabela-sensor">Opções</h2>
                    </div>

                    <div className="container-tabela">
                            {historicos.length > 0 && (
                            <ul className="ul-sensores">
                                {historicos.map(a => (
                                    <li key={a.id} className="li-sensores">
                                        <div className="cedula-sesnores" key={a.id}>

                                            <h2 key={a.id}>{a.sensor_tipo}</h2>
                                            <h2 key={a.id}>{a.ambiente_sig}</h2>
                                            <h2 key={a.id}>{a.ambiente_responsavel}</h2>
                                            <h2>{a.timestamp}</h2>
                                            <h2>{a.valor}</h2>
                                          

                                            <div className="opcoes">
                                                <button className="icon-opcoes" onClick={() => deletarHistorico(a.id)}>
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
                                <h2> Cadastrar Histórico </h2>

                                <input type="text" name="" ref={sensorRef} id="sensor" placeholder="Digite o id do sensor"/>
                                <input type="text" name="" ref={ambienteRef} id="ambientes" placeholder="Digite o id do Ambiente"/>
                                <input type="text" name="" ref={valorRef} id="valor" placeholder="Digite o valor"/>
                                <input type="text" name="" ref={timestampRef} id="timestamp" placeholder="Digite o timestamp"/>

                            </div>
                            <button className="btn-modal" type="submit">Salvar</button>
                        </form>

                </Modal>
            </main>
        </>
    )
}