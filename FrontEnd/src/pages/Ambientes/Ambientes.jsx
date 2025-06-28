import "../Ambientes/Ambientes.sass"
import Modal from "../../components/Modal/Modal"
import Swal from "sweetalert2"

import { useEffect, useState,useRef } from "react"
import axios from "axios"

export default function Ambientes(){

    const token = localStorage.getItem("token")

    const [editAmbiente,SetEditAmbiente] = useState(null)

    const [modalOpen,setModalOpen] = useState(false)
    const [editing,isEditing] = useState(false)
    
    const [ambientes,setAmbientes] = useState([])
    const [sensores,setSensores] = useState([])

    const sigRef = useRef()
    const descricaoRef =useRef()
    const niRef = useRef()
    const responsavelRef = useRef()

    const buscarAmbientes = () => {
            axios.get("http://127.0.0.1:8000/ambiente/",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                console.log(Object.values(response.data)?.[0])
                setAmbientes(response.data)
            })
            .catch(error => {
                console.log("Erro ao buscar ambiente",error)
            })
    }

    const openEditModal = (ambiente) => {
        SetEditAmbiente(ambiente)
        setModalOpen(true)
        isEditing(true)
        setTimeout(() => {
            if (sigRef.current) sigRef.current.value = ambiente.sig;
            if (niRef.current) niRef.current.value =  ambiente.ni;
            if (descricaoRef.current) descricaoRef.current.value = ambiente.descricao;
            if (responsavelRef.current) responsavelRef.current.value = ambiente.responsavel;
        }, 0);
    }

    const cleanerForm = () => {
        setTimeout(() => {
            if(sigRef.current)sigRef.current.value = ''
            if(descricaoRef.current)descricaoRef.current.value = ''
            if(niRef.current)niRef.current.value = ''
            if(responsavelRef.current)responsavelRef.current.value = ''

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
            sig:sigRef.current.value,
            ni:niRef.current.value,
            responsavel:responsavelRef.current.value,
            descricao:descricaoRef.current.value,
        }

        if(editing){

            axios.put(`http://127.0.0.1:8000/ambiente/${editAmbiente.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                Swal.fire(`Ambiente ${editAmbiente.id} editado com sucesso!`)
                buscarAmbientes()
                closeModal()
            })
            .catch(error => {
                console.log("Erro ao Editar um sensor",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
            })
        }
        else{

            axios.post("http://127.0.0.1:8000/ambiente/",formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                Swal.fire(`Ambiente criado com sucesso!`)
                buscarAmbientes()
                closeModal()
            })
            .catch(error =>{
                console.log("Erro ao criar um ambiente",Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado")
            })
        }

    }

    const deletarAmbiente = (id) =>{
        axios.delete(`http://127.0.0.1:8000/ambiente/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            Swal.fire(`Ambiente ${id} deletado com sucesso!`)
            buscarAmbientes()
        })
        .catch(error =>{
            console.log("Erro ao deletar sensor",Object.values(error.response.data)?.[0] || "Erro inesperado")
        })
    }

    
    useEffect(()=>{
        buscarAmbientes()
    },[])

    return(
        <>
            <main className="main-sensores">
                <div className="top-painel-sensores">
                    <h1 className="title-sensores-cadastrados">Ambientes Cadastrados</h1>
                    <div className="btn-painel-sensores">
                        <button className="btn-dashboard" onClick={openCreateModal}>Novo  <img src="../src/assets/btn_add.png" alt="add_icon" /></button>
                    </div>

                </div>
                <div className="container-tabela-sensores">

                    <div className="container-campos">
                        <h2 className="campo-tabela-sensor">Sig</h2>
                        <h2 className="campo-tabela-sensor">Descrição</h2>
                        <h2 className="campo-tabela-sensor">NI</h2>
                        <h2 className="campo-tabela-sensor">Responsavel</h2>
                        <h2 className="campo-tabela-sensor">Opções</h2>
                    </div>

                    <div className="container-tabela">
                            {ambientes.length > 0 && (
                            <ul className="ul-sensores">
                                {ambientes.map(a => (
                                    <li key={a.id} className="li-sensores">
                                     <div className="cedula-sesnores">

                                            <h2>{a.sig}</h2>

                                            <div className="tooltip-container">
                                                <h2 className="limit-caracter">{a.descricao}</h2>
                                                <span className="tooltip-text">{a.descricao}</span>
                                            </div>

                                            <div className="tooltip-container">
                                                <h2 className="limit-caracter">{a.ni}</h2>
                                                <span className="tooltip-text">{a.ni}</span>
                                            </div>

                                            <div className="tooltip-container">
                                                <h2 className="limit-caracter">{a.responsavel}</h2>
                                                <span className="tooltip-text">{a.responsavel}</span>
                                            </div>

                                            <div className="opcoes">
                                                <button className="icon-opcoes" onClick={() => deletarAmbiente(a.id)}>
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
                    ariaHideApp={false}
                >
                    <h2>Cadastrar Ambiente</h2>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="modal-container">
                            <input type="text" name="" id="sig" placeholder="Digite o sig" ref={sigRef}/>
                            <input type="text" name="" id="NI" placeholder="Digite o NI" ref={niRef}/>
                            <input type="text" name="" id="descricao" placeholder="Digite a descricao" ref={descricaoRef}/>
                            <input type="text" name="" id="responsavel" placeholder="Digite o responsavel" ref={responsavelRef}/>
                            <div className="btns-modal">
                                <button type="submit" className="btn-modal">Cadastrar</button>
                                <button onClick={closeModal} className="btn-modal">Fechar</button>
                            </div>
                        </div>
                    </form>
                  
                </Modal>
            </main>
        </>
    )
}