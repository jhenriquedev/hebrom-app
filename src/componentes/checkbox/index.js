import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='space-item-form'>
            {
                props.config ?
                    props.config.label ?
                        <label htmlFor={props.config.id}
                            style={{ top: '0px', left: '0px' }}
                            >{
                                props.config ?
                                    props.config.placeholder
                                : '' }
                        </label>
                : ''
                : ''
            }
            <div className={props.className || 'check-padrao nivel-0'} >
                <span className={`fas fa-${props.config ? props.config.icone : 'trash'} fa-lg`}></span>
                {
                    props.config ?
                    <p>{props.config.placeholder}</p>
                    : ''
                }
                
                <input type='checkbox' {...props.config} />
                {
                    props.info ?
                        <span className='input-info'>{props.info}</span>
                        : ''
                }
            </div>
        </div>
    )
}