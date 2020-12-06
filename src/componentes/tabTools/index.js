import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='tab-tools'>
            {props.children}
        </div>
    )
}