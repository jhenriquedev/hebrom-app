import React from 'react'

import './estilo.css'

import Icone from '../icone'

export default props => {
    return(
        <>
            {
                props.texto ?
                    <div className='item-lista-texto'>
                        <p>
                            {props.texto}
                            
                        </p>
                        {
                            props.btn ?
                                <button
                                    type='button'
                                    onClick={props.btn.onClick}
                                >
                                    <span className={`fas fa-${props.btn.icone} fa-sm`}></span>
                                </button>
                                : ''
                        }
                    </div>
                : 
                props.link ? 
                        <div className={`item-lista-link ${props.className || 'border-bottom'}`}>
                            <a onClick={props.onClick}>
                                {props.link}
                                {
                                    props.icone ?
                                        <span className={`fas fa-${props.icone} fa-sm`}></span>    
                                    : '' 
                                }
                            </a>
                        </div>
                :
                    <div className={`item-lista-padrao ${props.className}`}>
                        {
                            props.item ?
                                props.item.icone ?
                                    props.item.icone.map(icon =>
                                        <div key={icon.icon} className='item-lista-box'>
                                            <Icone icon={icon.icon} cor={icon.cor} tamanho='lg' />
                                        </div>
                                    )
                                    : ''
                                : ''
                        }
                        {
                            props.item ?
                                props.item.avatar ?
                                    <div className='item-lista-box'>
                                        <div className='input-avatar'>
                                            <img src={props.item.avatar} alt="Avatar" />
                                        </div>
                                    </div>
                                    : ''
                                : ''
                        }
                        <div className= 'item-lista-box'>
                            {
                                props.item ?
                                    props.item.texto ?
                                        <p>
                                            <b>
                                                {props.item.texto}
                                                {props.item.destaque ? ': ' : ''}
                                            </b>
                                            {props.item.destaque ? props.item.destaque : ''}
                                            {
                                                props.item.span ?
                                                    <span>{props.item.span}</span>
                                                    : ''
                                            }
                                        </p>
                                        : ''
                                    : ''
                            }
                            {
                                props.item ?
                                    props.item.info ?
                                        <p className='item-lista-info'>
                                            {props.item.info ? `${props.item.info}` : ''}
                                            {
                                                props.item.link ?
                                                    <a onClick={props.item.link.onClick}>
                                                        {props.item.link.texto}
                                                    </a>
                                                    : ''
                                            }
                                        </p>
                                        : ''
                                    : ''
                            }
                        </div>
                    </div>
            }
        </>
    )
}