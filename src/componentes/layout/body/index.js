import React from 'react'

import './estilo.css'

export default props => {
    return (
        <div className={`corpo ${props.className}`}>
            <div className='body-container'>
                {props.children} 
            </div>
        </div>
    )
}