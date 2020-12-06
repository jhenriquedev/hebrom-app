import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='box-padrao'>
            {
                props.children
            }
        </div>
    )
}