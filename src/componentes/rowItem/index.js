import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className={`row-item ${props.larg ? 'row-item-2' : ''} ${props.larg3 ? 'row-item-3' : ''}`}>
            {props.children}
        </div>
    )
}