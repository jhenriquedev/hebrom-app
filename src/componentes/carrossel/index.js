import React from 'react'

import './estilo.css'

export default props => {
    return (
        <div className='carrossel'>
            <div className='tela'>
                <div className='tela-box'>
                    <img src='img/promo/agilidade.png' alt='Agilidade nos processos'/>
                </div>
                <div className='tela-texto'>
                    <div>
                        <h2>AGILIDADE</h2>
                        <h3>
                            Emissão de documentos ou consulta de cadastros a um click
                        </h3>
                        <p>
                            Com o módulo Secretária, tenha em suas mãos o controle total de membros 
                            através de relatórios, além da emissão de uma gama de documentos, com apenas um click.
                        </p>
                        <button>
                            SAIBA MAIS
                        </button>
                        <br />
                        <a href='#'>Eu quero contratar</a>
                    </div>
                </div>
            </div>
            <div className='indicador'>
                <span className={`fas fa-circle fa-sm logo-color-app`}></span>
                <span className={`fas fa-circle fa-sm logo-cor`}></span>
                <span className={`fas fa-circle fa-sm logo-color-app`}></span>
                <span className={`fas fa-circle fa-sm logo-color-app`}></span>
                <span className={`fas fa-circle fa-sm logo-color-app`}></span>
            </div>
        </div>
    )
}