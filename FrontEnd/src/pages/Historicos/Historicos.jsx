import "../Ambientes/Ambientes.sass"

import { useEffect, useState ,useRef} from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import axios from "axios"
import Modal from "../../components/Modal/Modal"
import LoaderCedula from "../../components/LoaderCedula/LoaderCedula"
import Swal from "sweetalert2"

const schema = z.object({
    sensor : z.string().min(1, "Digite o sensor"),
    ambiente : z.string().min(1, "Digite o ambiente"),
    valor: z.string().min(1,"Digite o valor"),
    timestamp:z.string().min(1,"Digite o timestamp")
})

export default function Historicos(){

    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const [historicos,setHistoricos] = useState([])
    const [editing,isEditing] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [loader,setLoader] = useState(false)
    const [editHistorico,SetEditHistorico] = useState(null)

    const sensorRef = useRef()
    const ambienteRef =useRef()
    const valorRef = useRef()
    const timestampRef = useRef()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });


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

    const buscarHistoricos = () => {
        setLoader(true)
        axios.get("http://127.0.0.1:8000/historico/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.results)
            setHistoricos(response.data)
            setLoader(false)
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

 const handleHistorico = (data) =>{

        const formData = {
            ...data
        }

        if(editing){

            axios.put(`http://127.0.0.1:8000/historico/${editHistorico.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                Swal.fire(`Histórico ${editHistorico.id} editado com sucesso!`)
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
                Swal.fire(`Histórico cadastrado com sucesso!`)
                buscarHistoricos()
                closeModal()
            })
            .catch(error =>{
                console.log("Erro ao criar um histórico",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
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
            Swal.fire(`Histórico ${id} deletado com sucesso!`)
            buscarHistoricos()
        })
        .catch(error =>{
            console.log("Erro ao deletar sensor",Object.values(error.response.data)?.[0] || "Erro inesperado")
        })
    }
    
    useEffect(()=>{
        verificacaoToken(token)
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
                            {loader ? (
                                <LoaderCedula/>
                            ):(historicos.length > 0 ? (
                            <ul className="ul-sensores">
                                {historicos.map(a => (
                                    <li key={a.id} className="li-sensores">
                                        <div className="cedula-sesnores" key={a.id}>

                                            <h2>{a.sensor_tipo}</h2>
                                            <h2>{a.ambiente_sig}</h2>

                                            <div className="tooltip-container">
                                                <h2 className="limit-caracter">{a.ambiente_responsavel}</h2>
                                                <span className="tooltip-text">{a.ambiente_responsavel}</span>
                                            </div>
                                            
                                            <div className="tooltip-container">
                                                <h2 className="limit-caracter">{a.timestamp}</h2>
                                                <span className="tooltip-text">{a.timestamp}</span>
                                            </div>

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
                            ):(
                                <p>Nenhum Histórico Cadastrado</p>
                            )
                        )}

                    </div>
                </div>

                <Modal
                    isOpen={modalOpen}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                    ariaHideApp={false}
                >
                        <form action="" onSubmit={handleSubmit(handleHistorico)}>
                            <div className="modal-container">
                                <h2> Cadastrar Histórico </h2>

                                <div className="container-input">
                                    <label htmlFor="">Digite o Id
                                        <input
                                        type="text" 
                                        {...register("sensor")} 
                                        id="sensor"
                                        className={errors.sensor ? `error-container-input`:``} 
                                        placeholder="Digite o id do sensor"/>
                                    </label>
                                    <div className="container-error">
                                        {errors.sensor && <span className="error">{errors.sensor.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite o Ambiente
                                        <input 
                                        type="text"
                                        {...register("ambiente")} 
                                        id="ambientes"
                                        placeholder="Digite o id do Ambiente"
                                        className={errors.ambiente ? `error-container-input`:``}
                                        />
                                    </label>
                                    <div className="container-error">
                                        {errors.ambiente && <span className="error">{errors.ambiente.message}</span>}
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite o Valor
                                        <input 
                                        type="text" 
                                        {...register("valor")} 
                                        id="valor" 
                                        placeholder="Digite o valor"
                                        className={errors.valor ? `error-container-input`:``}
                                        />
                                        
                                    </label>
                                    <div className="container-error">
                                        {errors.valor && <span className="error">{errors.valor.message}</span>}
                                    </div>
                                </div>                                        
                                <div className="container-input">
                                    <label htmlFor="">
                                        Digite o timestamp
                                        <input 
                                        type="text" 
                                        {...register("timestamp")}
                                        className={errors.timestamp ? `error-container-input`:``} 
                                        id="timestamp" 
                                        placeholder="Digite o timestamp"/>
                                    </label>
                                    <div className="container-error">
                                        {errors.timestamp && <span className="error">{errors.timestamp.message}</span>}
                                    </div>
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