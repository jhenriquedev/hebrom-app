import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div id={props.id} className={`${props.className ? props.className : props.full ? 'tab-item-full' : 'tab-item'}`}>
            {props.children}
        </div>
    )
}