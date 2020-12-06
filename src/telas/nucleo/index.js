import React, { useState } from 'react'

import './estilo.css'

import Tela from '../../componentes/tela'

export default ({ history }) => {
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const links = [
        { id: 0, texto: 'Núcleo', to: '/nucleo', history: history, btn: true, icone: 'icone-menu nucleos' }
    ]


    return (
        <Tela links={links} history={history} loading={loading} alert={alert}>

        </Tela>
    )
}