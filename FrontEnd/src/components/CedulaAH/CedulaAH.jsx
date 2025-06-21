import "../CedulaAH/CedulaAH.sass"

export default function CedulaAH({label1,label2,label3,label4}){
    return(
        <>
            <div className="cedula-sesnores">
 
                <h2>{label1}</h2>
                <h2>{label2}</h2>
                <h2>{label3}</h2>
                <h2>{label4}</h2>

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