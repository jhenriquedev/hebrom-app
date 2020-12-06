import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className={`${props.className || 'tab-item-box'}`}>
            {props.children}
        </div>
    )
}