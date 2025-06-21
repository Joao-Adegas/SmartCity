import "../aside/Aside.sass"


export default function Aside(){

    const usuarioJSON = localStorage.getItem("usuario");
    const usuario = JSON.parse(usuarioJSON);
    const name = usuario.username;

    return(
        <>
            <aside className="aside">
                <div className="container-aside">
                    <div className="nav-aside">

                        <div className="title-aside-container">
                            <h1 className="title-aside">Smart City</h1>
                        </div>

                        <ul>
                            <li> <a href="/">Home</a> </li>
                            <li> <a href="/Inicial">Dashboard</a> </li>
                            <li> <a href="/Sensores">Sensores</a> </li>
                            <li> <a href="/Ambientes">Ambientes</a> </li>
                            <li> <a href="/Históricos">Históricos</a> </li>
                        </ul>
                    </div>

                    <div className="container-name-user">
                        <h3 className="name-user">{name.toUpperCase()}</h3>
                    </div>

                </div>
            </aside>
        </>
    )
}