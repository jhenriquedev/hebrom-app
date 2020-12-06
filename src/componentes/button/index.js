import React from 'react'

import './estilo.css'

export default props => {
    const style = props.img ? {backgroundImage: `url(${props.img})`} : {}
    return(
        <button 
            type={props.type || 'button'} 
            className={props.className || 'btn-padrao'} 
            style={style}
            onClick={props.onClick}
        >
            {props.texto ? props.texto : ''}
            {props.icone ? <span className={`fas fa-${props.icone}`}></span> : ''}
            {props.children}
        </button>
    )
}