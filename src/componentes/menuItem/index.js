import React from 'react'

import './estilo.css'

export default props => {
    return(
        <a className={`menu-item ${props.borda}`} href={props.to} onClick={props.onClick}>
            <i className={`fas ${props.icone} fa-lg`}></i>
            {props.texto}
        </a>
    )
}