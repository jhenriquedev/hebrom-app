import React from 'react'

import './estilo.css'

import Menu from '../../../menu'

export default props => {
    return(
        <div className='rodape-padrao'>
            <div className='rodape-padrao-direita'>
                <Menu links={
                    [
                        { id: 0, texto: 'hebrom.com', to: '/' },
                        { id: 1, texto: 'Redes Sociais', to: '/sociais' },
                        { id: 2, texto: 'Documentação', to: '/documentacao' },
                        { id: 3, texto: 'Suporte', to: '/suporte', btn:true }
                    ]
                } />
            </div>
            <div className='rodape-padrao-centro'></div>
            <div className='rodape-padrao-esquerda'>
                <Menu links={
                    [
                        { id: 0, texto: 'Termos de Serviço', to: '/termos-de-servico' },
                        { id: 1, texto: 'Pivacidade', to: '/privacidade' },
                        { id: 2, texto: 'Codes.com', to: '/'}
                    ]
                } />
            </div>
        </div>
    )
}