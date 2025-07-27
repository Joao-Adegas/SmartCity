import "../aside/Aside.sass"
import { NavLink } from "react-router-dom";

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
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/">Home</NavLink> </li>
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/Inicial">Dashboard</NavLink> </li>
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/Sensores">Sensores</NavLink> </li>
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/Ambientes">Ambientes</NavLink> </li>
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/Históricos">Históricos</NavLink> </li>
                            <li> <NavLink className={({isActive}) => isActive ? "ativo":"NavLink"}  to="/Usuarios">Usuários</NavLink> </li>
                        </ul>
                    </div>

                    <div className="container-name-user">
                        <h3 className="name-user">{name}</h3>
                    </div>

                </div>
            </aside>
        </>
    )
}