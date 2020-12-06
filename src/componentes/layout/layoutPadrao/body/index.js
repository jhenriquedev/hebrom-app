import React from 'react'

import './estilo.css'

import Menu from '../../../menu'
import Loading from '../../../loading'

export default props => {
    return (
        <div className='body-tela-padrao'>
            <div className='body-padrao-head'>
                <div className='body-padrao-head-direita'>
                    <Menu links={props.links} />
                </div>
                <div className='body-padrao-head-centro'>
                    {
                        props.loading ? 
                            <Loading /> 
                        : props.alert.display 
                            ? 
                                <span>{props.alert.texto}</span>
                            : ''
                    }
                </div>
                <div className='body-padrao-head-esquerda'>

                </div>
            </div>
            <div className='body-padrao-container'>
                {props.children}
            </div>
        </div>
    )
}