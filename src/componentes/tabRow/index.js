import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className={`${props.className} ${props.bottom ? 'tab-item-row-bottom' : ''} tab-item-row`}>
            {
                props.children
            }
        </div>
    )
}