import "../Home/Home.sass"

export default function Home(){
    return(
        <>
            <header>
                <figure>
                    <img src="../src/assets/Logo.png" alt="Logo" srcSet="" className="img-logo"/>
                </figure>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/Login">Login</a></li>
                    </ul>
                </nav>
            </header>

            <main>

                <section className="section">
                    <div className="banner">
                        <h2 className="title-main"><b>Smart City</b></h2>
                        <p className="subtitle-main">Tecnologia não é luxo.</p>
                    </div>
                </section>

                <section>
                    <div className="cards-container">
                        <div className="card">
                            <figure>
                                <img src="../src/assets/sensor-img.png" alt="" className="img-card"/>
                            </figure>
                            <h3>Sensores</h3>
                        </div>
                        <div className="card center-card" >
                            <figure>
                                <img src="../src/assets/historico-img.png" alt="" className="img-card"/>
                            </figure>
                            <h3>Ambientes</h3>
                        </div>
                        <div className="card">
                            <figure>
                                <img src="../src/assets/ambiente-img.png" alt="" className="img-card"/>
                            </figure>
                            <h3>Históricos</h3>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="title">Sensores</h2>

                    <div className="cards-sensores">
                        <div className="card-sensor">
                            <figure>
                                <img src="../src/assets/umidade-img.png" alt="" srcSet="" className="img-sensor"/>
                            </figure>
                            <p>Umidade</p>
                        </div>
                        <hr />
                        <div className="card-sensor">
                            <figure>
                                <img src="../src/assets/temperatura-img.png" alt="" srcSet="" className="img-sensor"/>
                            </figure>
                            <p>Temperatura</p>
                        </div>
                        <hr />
                        <div className="card-sensor">
                            <figure>
                                <img src="../src/assets/contador-img.png" alt="" srcSet="" className="img-sensor"/>
                            </figure>
                            <p>Contagem</p>
                        </div>
                        <hr />
                        <div className="card-sensor">
                            <figure>
                                <img src="../src/assets/luminosidade-img.png" alt="" srcSet="" className="img-sensor"/>
                            </figure>
                            <p>Luminosidade</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h1 className="title">Dashboard</h1>

                    <div className="container-dashboard">
                        <div className="container-dashboard-cards">
                            <div className="card-dashborad">
                                <p className="sensor">Temperatura</p>
                                <h2 className="quantity-sensor">200</h2>
                            </div>
                            <div className="card-dashborad">
                                <p className="sensor">Umidade</p>
                                <h2 className="quantity-sensor">200</h2>
                            </div>
                            <div className="card-dashborad">
                                <p className="sensor">Luminosidade</p>
                                <h2 className="quantity-sensor">200</h2>
                            </div>
                            <div className="card-dashborad">
                                <p className="sensor">Contagem</p>
                                <h2 className="quantity-sensor">200</h2>
                            </div>
                        </div>

                        <div className="text">
                            <h1 className="msg">Fácil vizualização de dados em tempo real !!</h1>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="title">Importação e Exportação de Dados</h2>
                    <div className="container-importacao-exportacao">
                        <div>
                            <figure>
                                <img src="../src/assets/Exel-print-img.png" alt="exel-print" className="print-exel"/>
                            </figure>
                        </div>
                        <div>
                            <figure>
                                <img src="../src/assets/exel-logo.png" alt="exel-icon" className="icon-exel"/>
                            </figure>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="main-footer">
                    <figure>
                        <img src="../src/assets/Logo.png" alt="" srcSet="" className="Logo-footer"/>
                    </figure>

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
        </>
    )
}