import React from 'react'

import './estilo.css'

export default props =>{
    return(
        <div className='form-item'>
            {props.children}
        </div>
    )
}