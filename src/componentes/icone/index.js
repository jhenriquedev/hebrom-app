import React from 'react'

import './estilo.css'

export default props => {
    return(
        <span className={`${props.cor || 'logo-color-app'} fas fa-${props.icon || 'trash'} fa-${props.tamanho || 'lg'}`}>{props.texto}</span>
    )
}