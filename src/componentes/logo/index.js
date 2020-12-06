import React from 'react'

import './estilo.css'

export default props => {
    const estilo= props.className ? props.className : 'logo'
    return (
        <div className={estilo}>
            <img src={props.src || 'logos/logo.png'} alt={props.alt || 'Hebrom'}/>
        </div>
    )
}