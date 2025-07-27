import "../Dashboard/Dashboard.sass"
import GraficoTemperatura from "../../components/GraficoTemperatura/GraficoTemperatura"
import GraficoTimestamp from "../../components/GraficoTimestamp/GraficoTimestamp"


import axios from 'axios'
import Swal from "sweetalert2"
import LoaderNumber from "../../components/LoaderNumber/LoaderNumber"

import { useState,useEffect,useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard(){

    const [modalOpen,setModalOpen] = useState(null)
    const [status,setStatus] = useState(true)
    const [importando, setImportando] = useState(false);
    const [loader,setLoader] = useState(false);
    const [error401,setError401] = useState(false)

    const [sensor,setSensores] =  useState([]);
    const [ambiente,setAmbientes] =  useState([]);
    const [historico,setHistoricos] =  useState([]);


    const [quantidadeAmbientes,setQuantidadeAmbientes] = useState(0)
    const [quantidadeHistoricos,setQuantidadeHistoricos] = useState(0)
    const [quantidadeSensorTemperatura,setQuantidadeSensorTemperatura] = useState(0)
    const [quantidadeSensorUmidade,setQuantidadeSensorUmidade] = useState(0)
    const [quantidadeSensorLuminosidade,setQuantidadeSensorLuminosidade] = useState(0)
    const [quantidadeSensorContagem,setQuantidadeSensorContagem] = useState(0)

    const [arquivos, setArquivos] = useState(null)

    const token = localStorage.getItem("token")
    const navigate = useNavigate()
 
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

    const contarAmbientes = () =>{
        setLoader(false)
        axios.get("http://127.0.0.1:8000/quantidade_ambientes/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Ambientes:"+ response.data.quantidade)
            setQuantidadeAmbientes(response.data.quantidade);
            setLoader(false)
        });
    }
    const contarHistoricos = () =>{
        setLoader(true)
        axios.get("http://127.0.0.1:8000/quantidade_historicos/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLoader(false)
            console.log("Historicos:"+ response.data.quantidade)
            setQuantidadeHistoricos(response.data.quantidade);
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

    const contarSensorTemperartura = () =>{
        setLoader(true)
        axios.get("http://127.0.0.1:8000/quantidade_sensor_temperatura/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLoader(false)
            console.log("Sensores de temperatura:" + response.data.temperatura)
            setQuantidadeSensorTemperatura(response.data.temperatura);
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

    const contarSensorUmidade = () =>{
        setLoader(true)
        axios.get("http://127.0.0.1:8000/quantidade_sensor_umidade/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLoader(false)
            console.log("Sensores de umidade:" + response.data.umidade)
            setQuantidadeSensorUmidade(response.data.umidade);
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
                    setLoader(false)
                    localStorage.removeItem("token");
                    navigate('/Login');
                });
            } else {
                console.log("Erro ao buscar sensores", error);
            }
        })
    }

    const contarSensorLuminosidade = () =>{
        setLoader(true)
        axios.get("http://127.0.0.1:8000/quantidade_sensor_luminosidade/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLoader(false)
            console.log("Sensores de luminosidade:" + response.data.luminosidade)
            setQuantidadeSensorLuminosidade(response.data.luminosidade);
        });
    }

    const contarSensorContagem = () =>{
        setLoader(true)
        axios.get("http://127.0.0.1:8000/quantidade_sensor_contagem/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLoader(false)
            console.log("Sensores de contagem:" + response.data.contagem)
            setQuantidadeSensorContagem(response.data.contagem);
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

    const exportarSensores = () => {
        const token = localStorage.getItem("token");

        axios.get("http://127.0.0.1:8000/exportar_sensores/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob', // MUITO IMPORTANTE para arquivos!
        })
        .then(response => {
            // Cria um link temporário para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sensores_exportados.xlsx'); // nome do arquivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(error => {
            console.error("Erro ao exportar sensores:", error);
        });
    };
    const exportarAmbientes = () => {
        const token = localStorage.getItem("token");

        axios.get("http://127.0.0.1:8000/exportar_ambientes/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob', // MUITO IMPORTANTE para arquivos!
        })
        .then(response => {
            // Cria um link temporário para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ambientes_exportados.xlsx'); // nome do arquivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(error => {
            console.error("Erro ao exportar sensores:", error);
        });
    };
    const exportarHistorico = () => {
        const token = localStorage.getItem("token");

        axios.get("http://127.0.0.1:8000/exportar_historico/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob', // MUITO IMPORTANTE para arquivos!
        })
        .then(response => {
            // Cria um link temporário para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Historicos_exportados.xlsx'); // nome do arquivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(error => {
            console.error("Erro ao exportar sensores:", error);
        });
    };

    const importarArquivos = (event, tipo) => {
        const arquivosSelecionados = event.target.files;

        if (!arquivosSelecionados || arquivosSelecionados.length === 0) {
            alert("Selecione um arquivo");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < arquivosSelecionados.length; i++) {
            formData.append("arquivo", arquivosSelecionados[i]);
        }

        let url = "";

        if (tipo === "sensores") {
            url = "http://127.0.0.1:8000/importar_sensores/";
        } else if (tipo === "ambientes") {
            url = "http://127.0.0.1:8000/importar_ambientes/";
        } else if (tipo === "historicos") {
            url = "http://127.0.0.1:8000/importar_historico/";
        } else {
            alert("Tipo de importação inválido.");
            return;
        }
        setImportando(true)
        axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            Swal.fire(res.data.mensagem);
            if (res.data.erros) {
                console.log("Tipo recebido na função importarArquivos:", tipo)
            }
            contarAmbientes()
            contarHistoricos()
            contarSensorTemperartura()
            contarSensorUmidade()
            contarSensorLuminosidade()
            contarSensorContagem()
        })
        .catch(err => {
            console.error(`Erro ao importar ${tipo}:`, err);
            alert(`Erro ao importar ${tipo}`);
        })
        .finally(() =>{
            setImportando(false)
        })
    };


    useEffect(()=>{
        verificacaoToken(token)
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
                
                {/* Alerta de processamento */}
                {importando && (
                    <>
                        <div class="loader-overlay">
                            <div class="justify-content-center jimu-primary-loading"></div>
                        </div>
                    </>
                )}
                
                {/* Container Sensores */}
                <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Sensores</h1>
                        </div>

                        <div className="options">
                            {/* Botão de exportar */}
                            <button className="btn-dashboard" onClick={exportarSensores}>
                                <img src="../src/assets/exel-icon.png" alt="add_icon" className="img-btn" />
                                Exportar 
                            </button>

                            {/* Botão de importar */}
                            <input
                                id="file-upload-sensores"
                                type="file"
                                multiple
                                accept=".xlsx"
                                style={{ display: 'none' }}
                                onChange={(e) => importarArquivos(e, "sensores")}
                            />
                            <label htmlFor="file-upload-sensores" className="btn-dashboard">
                                <img src="../src/assets/xls-icon.png" alt="Upload Icon" className="img-btn" />
                                <span className="span-btn-import">Importar</span>
                            </label>
                        </div>

                    </div>

                    {/* MELHORIA FUTURA: TRANSFORMAR ESSE BLOBO DE CODIGO EM UM MAP() */}
                    <div className="container-cards-dashboard">
                        <div className="card">
                            <p className="sensor-p-card">Temperatura</p>
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                    <LoaderNumber/>
                                ): ( quantidadeSensorTemperatura )}
                            </h2>
                        </div>
                        <div className="card">
                            <p className="sensor-p-card">Umidade</p>
                           
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                <LoaderNumber/>
                                ):(quantidadeSensorUmidade)}
                            </h2>
                        </div>

                        <div className="card">
                            <p className="sensor-p-card">Luminosidade</p>
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                    <LoaderNumber/>
                                ):(
                                    quantidadeSensorLuminosidade
                                )}
                            </h2>
                        </div>
                        <div className="card">
                            <p className="sensor-p-card">Contagem</p>
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                    <LoaderNumber/>
                                ):(
                                    quantidadeSensorContagem
                                )}
                            </h2>
                        </div>
                    </div>
                    {/* MELHORIA FUTURA: TRANSFORMAR ESSE BLOBO DE CODIGO EM UM MAP() */}

                </div>

                {/* Container Ambientes */}
                <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Ambientes</h1>
                        </div>
                        <div className="options">
                            {/* Botão de exportar */}
                            <button className="btn-dashboard" onClick={exportarAmbientes}>
                                <img src="../src/assets/exel-icon.png" alt="add_icon" className="img-btn" />
                                Exportar 
                            </button>

                            {/* Botão de importar */}   
                            <input
                                id="file-upload-ambientes"
                                type="file"
                                multiple
                                accept=".xlsx"
                                style={{ display: 'none' }}
                                onChange={(e) => importarArquivos(e, "ambientes")}
                            />
                            <label htmlFor="file-upload-ambientes" className="btn-dashboard">
                                <img src="../src/assets/xls-icon.png" alt="Upload Icon" className="img-btn" />
                                <span className="span-btn-import">Importar</span>
                            </label>
                        </div>
                    </div>
                    <div className="container-cards-dashboard">
                        <div className="card">
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                    <LoaderNumber/>
                                ):(
                                    quantidadeAmbientes
                                )}
                            </h2>
                        </div>
                    </div>

                </div>


                 {/* Container Histórico */}
                <div className="container">
                    <div className="top-container">
                        <div className="title-container-dashboard">
                            <h1 className="title-container-card">Históricos</h1>
                        </div>

                        <div className="options">
                            {/* Botão de exportar */}
                            <button className="btn-dashboard" onClick={exportarHistorico}>
                                <img src="../src/assets/exel-icon.png" alt="add_icon" className="img-btn" />
                                Exportar 
                            </button>

                            {/* Botão de importar */}
                            <input
                                id="file-upload-historico"
                                type="file"
                                multiple
                                accept=".xlsx"
                                style={{ display: 'none' }}
                                onChange={(e) => importarArquivos(e, "historicos")}
                            />
                            <label htmlFor="file-upload-historico" className="btn-dashboard">
                                <img src="../src/assets/xls-icon.png" alt="Upload Icon" className="img-btn" />
                                <span className="span-btn-import">Importar</span>
                            </label>
                        </div>

                        
                    </div>

                    <div className="container-cards-dashboard">
                        <div className="card">
                            <h2 className="sensor-quantity-card">
                                {loader ? (
                                    <LoaderNumber/>
                                ):(
                                    quantidadeHistoricos
                                )}
                            </h2>
                        </div>
                    </div>

                </div>
                
                <div className="GraficosContainer">
                        
                    <div className="GraficoContainerTimestamp">
                        <h1 className="title-container-grafico">Timestamp</h1>
                        <GraficoTimestamp/>
                    </div>
                    <div className="Grafico-Container-Temperatura">
                        <h1 className="title-container-grafico">Temperatura</h1>
                        <GraficoTemperatura/>
                    </div>

                </div>

                

            </main>
          
        </>
    )
}