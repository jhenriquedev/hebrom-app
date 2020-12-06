import React from 'react'

import './estilo.css'

import Icone from '../icone'

export default props => {

    const item = props.item

    return (
        <div className={`item-lista-form ${props.className}`}>
            {
                item.icone ? 
                    item.icone.map(icon =>
                        <div key={icon.icon} className='item-lista-left'>
                            <Icone icon={icon.icon} cor={icon.cor} tamanho='lg' />
                        </div>
                    )
                : ''
            }
            <div className='item-lista-center'>
                {
                    item.texto ?
                        <p>
                            <b>
                                {item.texto}
                                {item.destaque ? ': ' : ''}
                            </b>
                            
                            {item.destaque ? item.destaque : ''}
                            {
                                item.span ?
                                    <span>{item.span}</span>
                                    : ''
                            }
                        </p>
                        : ''
                }
                {
                    item.info ?
                        <span className='item-lista-form-info'>{item.info}</span>
                        : ''
                }
                {
                    item.obs ? 
                        <p className='item-lista-form-info'>{item.obs}</p>
                    : ''
                }
            </div> 
            {
                item.link ? 
                    <div className='item-lista-right'>
                        <a onClick={item.link.onClick}>
                            {item.link.texto}
                            {
                                item.link.icone ?
                                    <i className={`fas fa-${item.link.icone}`}></i>
                                    : ''
                            }
                        </a>
                    </div>
                : ''
            }
        </div>
    )
}