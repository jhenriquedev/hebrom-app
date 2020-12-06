import React from 'react'

import './estilo.css'

import Loading from '../../componentes/loading'


export default props => {
    return(
        <div className={`painel ${props.nivel}`}>
            {
                props.titulo ?
                    <div className='painel-head'>
                        <h3>{props.titulo}</h3>
                        {
                            props.msg ? 
                                <span className={props.msg.tipo}>{props.msg.texto}</span>
                            : ''
                        }
                        {
                            props.loading ?
                                <Loading /> 
                            : ''
                        }
                    </div>
                : ''
            }
            <div className='painel-body'>
                {props.children}
            </div>
            {
                props.link ?
                    <div className='painel-footer'>
                        <span>{props.link.label}</span> <a onClick={props.link.onClick}>{props.link.texto}</a>
                    </div>
                : ''
            }
        </div>
    )
}