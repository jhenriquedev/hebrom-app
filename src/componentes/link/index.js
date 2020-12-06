import React from 'react'

import './estilo.css'

export default props => {
    return(
        <a 
            href={props.to} 
            alt={props.alt} 
            className={props.className || 'link-padrao'}
            onClick={props.onClick}
        >
            {props.texto}
        </a>
    )
}