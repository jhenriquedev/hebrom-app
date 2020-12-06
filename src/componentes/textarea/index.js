import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='space-item-form'>
            {
                props.config.label ?
                    <label htmlFor={props.config.id}
                        style={{ top: '0px', left: '0px' }}
                    >{props.config.placeholder}</label>
                    : ''
            }
            <div className={props.className || 'textarea-padrao nivel-0'} >
                <textarea {...props.config} />
            </div>
        </div>
    )
}