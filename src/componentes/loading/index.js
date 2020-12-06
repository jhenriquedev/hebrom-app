import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='loading'>
            <div className='circulo primeiro'></div>
            <div className='circulo segundo'></div>
            <div className='circulo terceiro'></div>
        </div>
    )
}