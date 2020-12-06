import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='row-container'>
            {props.children}
        </div>
    )
}