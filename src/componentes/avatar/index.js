import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='item-lista-box'>
            <div className='input-avatar'>
                <img src={props.src} alt="Avatar"/>
            </div>
        </div>
    )
}