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
            <div className={props.className || 'select-padrao nivel-0'}>
                <span className={`fas fa-${props.config ? props.config.icone : 'trash'} fa-lg`}></span>
                <div className='div-select'>
                    <select {...props.config}>
                        <option key={0} value=''>{props.config.placeholder}</option>
                        {
                            props.config.lista ?
                                props.config.lista.map(item =>
                                    <option key={item._id} value={item._id}>{item.nome}</option>
                                )
                                :
                                <option key={0} value=''>Não foi passado uma lista de opções.</option>
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}