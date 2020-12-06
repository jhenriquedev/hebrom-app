import React from 'react'

import './estilo.css'

import Logo from '../../logo'
import Menu from '../../menu'

export default props => {
    return (
        <div className='topo'>
            <div className='direita'>
                <Logo />
                <Menu links={
                    [
                        {
                            id: 0, texto: 'Produtos', to: '',
                            sub: [
                                { id: 0, texto: 'Secretária', to: '' },
                                { id: 1, texto: 'Financeiro', to: '' },
                                { id: 2, texto: 'Sites Institucionais', to: '' },
                            ]
                        },
                        { id: 1, texto: 'Preços', to: '' },
                        { id: 2, texto: 'Documentação', to: '' },
                        { id: 3, texto: 'Suporte', to: '' }
                    ]
                } />
            </div>
            <div className='centro'>
            </div>
            <div className='esquerda'>
                <Menu links={
                    [
                        { id: 4, texto: 'Login', to: '/login', btn: true, history:props.history }
                    ]
                } />
            </div>
        </div>
    )
}