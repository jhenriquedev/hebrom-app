import React from 'react'
import {Redirect} from 'react-router'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './telas/home' //tela inicial do aplicativo
import Login from './telas/login'
import Dashboard from './telas/dashboard'
import Ministerio from './telas/ministerio'
import Servicos from './telas/servicos'
import Nucleo from './telas/nucleo'
import Setores from './telas/setores'
import Areas from './telas/areas'
import Congregacoes from './telas/congregacoes'
import Celulas from './telas/celulas'
import Familias from './telas/familias'
import Membros from './telas/membros'

import Notificacoes from './telas/notificacoes'
import Sociais from './telas/sociais'

export default props => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/home' exact component={Home} />
                <Route path='/login' exact component={Login} />
                <Route path='/dashboard' exact component={Dashboard} />
                <Route path='/ministerio' exact component={Ministerio}/>
                <Route path='/servicos' exact component={Servicos} />
                <Route path='/nucleo' exact component={Nucleo} />
                <Route path='/setores' exact component={Setores} />
                <Route path='/areas' exact component={Areas} />
                <Route path='/congregacoes' exact component={Congregacoes} />
                <Route path='/celulas' exact component={Celulas} />
                <Route path='/familias' exact component={Familias} />
                <Route path='/membros' exact component={Membros} />
                <Route path='/membros/tab/:tab' exact component={Membros} />

                <Route path='/notificacoes' exact component={Notificacoes} />

                
                <Route path='/sociais' exact component={Sociais} />


                <Redirect from='/' to='/home' />
                <Redirect from='*' to='/home' />
            </Switch>
        </BrowserRouter>
    )
}