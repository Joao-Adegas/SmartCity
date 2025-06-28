import Aside from "../aside/Aside";
import { Outlet } from "react-router-dom";
import "../Layout/Layout.sass"
export default function Layout(){
    return(
        <div className="flex">
            <Aside/>
            <main className="main-layout">
                <Outlet/>
            </main>
            <footer>
                 
                <div className="main-footer">
                    {/* <figure>
                        <img src="../src/assets/Logo.png" alt="" srcSet="" className="Logo-footer"/>
                    </figure> */}

                    <div>
                        <div className="mensagens">
                            
                            <div className="separador">
                                <p>Monitoramentos inteligentes para cidades mais sustentáveis</p>
                                <p>Soluções diigitais para ambientes urbanos conectados</p>
                            </div>

                            <div className="separador">
                                <p>Tecnologia e serviço da gestão urbana eficiente</p>
                                <p>Transformando dados em soluções</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="direitos-autorais">
                    <p className="direitos-text">© 2025 Smart City – Todos os direitos reservados.</p>
                </div>
            
            </footer>
        </div>
    )
}