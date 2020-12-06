import React from 'react'

import './estilo.css'

export default props => {
    const col = props.col === '0' ? 'direita' : 'esquerda'
    return(
        <div className={`tab-item-${col} tab-col`}>
            {props.children}
        </div>
    )
}