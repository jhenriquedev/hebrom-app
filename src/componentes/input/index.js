import React from 'react'

import './estilo.css'

export default props => {
    return(
        <div className='space-item-form'>
            {
                props.config.label ?
                    <label htmlFor={props.config.id}
                    style={{top:'0px', left:'0px'}}
                    >{props.config.placeholder}</label>
                    : ''
            }
            <div className={props.className || 'input-padrao nivel-0'} >
                <span className={`fas fa-${props.config ? props.config.icone : 'trash'} fa-lg`}></span>
                <input {...props.config} />
                {
                    props.config.info ?
                        <span className='input-info'>{props.config.info}</span>
                        : ''
                }
                {
                    props.onClick ?
                        <button onClick={props.onClick}>
                            <span className={`fas fa-${props.btnIcone ? props.btnIcone : 'search'} fa-lg fa-flip-horizontal`}></span>
                        </button>
                        : <br />
                }
                {
                    props.info ?
                        <span className='input-info'>{props.info}</span>
                        : ''
                }
            </div>
        </div>
    )
}