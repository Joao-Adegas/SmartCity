import "../Cedula/Cedula.sass"

export default function Cedula({tipo,endereco,unidade_medida,latitude,longitude,status}){
    return(
        <>
            <div className="cedula-sesnores">
 
                <h2>{tipo}</h2>
                <h2>{endereco}</h2>
                <h2>{unidade_medida}</h2>
                <h2>{latitude}</h2>
                <h2>{longitude}</h2>
                <h2>{status ? "Ativo" : "Inativo"}</h2>

                <div className="opcoes">
                    <button className="icon-opcoes">
                        <img src="../src/assets/lixo.png" alt="icon-delete" className="icon-actions"/>
                    </button>
                    <button className="icon-opcoes">
                        <img src="../src/assets/lapis.png" alt="edit-icon" className="icon-actions"/>
                    </button>
                </div>
            </div>
        </>
    )
}