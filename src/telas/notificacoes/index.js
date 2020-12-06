import React from 'react'

import './estilo.css'

import Tela from '../../componentes/tela'

export default ({ history }) => {
    const links = [
        { id: 0, texto: 'Notificações', to: '/notificacoes', history: history, btn: true, icone: 'fa-bell' }
    ]


    return (
        <Tela links={links} history={history} >

        </Tela>
    )
}