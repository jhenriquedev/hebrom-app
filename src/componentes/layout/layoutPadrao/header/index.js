import React, {useState, useEffect} from 'react'

import './estilo.css'

import {Logout} from '../../../../crud'

import Logo from '../../../logo'
import Button from '../../../button'
import Painel from '../../../painel'
import ItemMenu from '../../../menuItem'

import FormItem from '../../../formItem'
import Input from '../../../input'

export default props => {

    const [user, setUser] = useState('')
    const [avatar, setAvatar] = useState('')

    useEffect(() => { //não permite entrar sem estar logado
        setUser(props.user)
        setAvatar(props.user.avatar)
    }, [])

    const [displayMenu, setDisplayMenu] = useState([false, 0])

    const menu = [
        { id: 0, icone: 'fa-tachometer-alt', texto: 'Dashboard', to: '/dashboard', borda:'menu-item-primeiro', rootAplicacao: true },
        { id: 1, icone: 'icone-menu minister', texto:'Ministério', to:'/ministerio', borda:''},
        {id: 2, icone: 'fa-print', texto:'Serviços', to:'/servicos', borda:''},
        { id: 3, icone: 'icone-menu nucleos', texto: 'Núcleo', to: '/nucleo', borda: '' },
        { id: 4, icone: 'icone-menu setores', texto: 'Setores', to: '/setores', borda: '' },
        { id: 5, icone: 'icone-menu area', texto: 'Áreas', to: '/areas', borda: '' },
        { id: 6, icone: 'icone-menu congregs', texto: 'Congregações', to: '/congregacoes', borda: '' },
        { id: 7, icone: 'icone-menu celula', texto: 'Células', to: '/celulas', borda: '' },
        { id: 8, icone: 'icone-menu family', texto: 'Familias', to: '/familias', borda: '' },
        { id: 9, icone: 'fa-user', texto: 'Membros', to: '/membros', borda: 'menu-item-ultimo' }
    ]


    const menuUser = [
        { id: 0, icone: 'fa-bell', texto: 'Notificações', to: '/notificacoes', borda: 'menu-item-primeiro' },
        { id: 1, icone: 'fa-long-arrow-alt-right', texto: 'Sair', to: '', borda: 'menu-item-ultimo', onClick: () => Logout(props.history, true) }
    ]


    const painelMenu = () => {
        const display = displayMenu[0] ? 'block' : 'none'

        const lista = displayMenu[1] ? menu : menuUser

        return(
            <div style={{ display: display }}>
                <Painel nivel='nivel-2'>
                    {
                        lista.map(item => {
                            if(item.rootAplicacao){
                                return props.user.rootAplicacao ?
                                    <ItemMenu key={item.id} icone={item.icone} texto={item.texto} to={item.to} borda={item.borda} onClick={item.onClick} />
                                : ''
                            }else{
                                return <ItemMenu key={item.id} icone={item.icone} texto={item.texto} to={item.to} borda={item.borda} onClick={item.onClick} />
                            }
                        })
                    }
                </Painel>
            </div>
        )
    }

    return(
        <div className='topo-padrao'>
            <div className='topo-padrao-direita'>
                <Logo />
            </div>
            <div className='topo-padrao-centro'>
                {
                    props.busca ?
                        <FormItem>
                            <Input className='input-header' config={{
                                id: 'busca',
                                icone: 'search',
                                type: 'text',
                                name: 'Busca',
                                placeholder: props.busca.placeholder || 'Digite algo para buscar...',
                                maxLength: '50',
                                required: false,
                                disabled: false,
                                onChange: props.busca.onChange,
                                value: props.busca.value
                            }} />
                        </FormItem>
                    : ''
                }
            </div>
            <div className='topo-padrao-esquerda'>
                {
                    props.carregado ?
                        <Button className='btn-icone' icone='bars lavander' onClick={() => setDisplayMenu([!displayMenu[0], 1])} />
                    : ''
                }
                <Button className={avatar ? 'btn-img' : 'btn-icone'} icone={avatar ? '' : 'user-circle fa-2x mid-blue'} img={avatar ? avatar.url : false} onClick={() => setDisplayMenu([!displayMenu[0], 0])} />
            </div>
            <div className='topo-padrao-barra-inferior'></div>
            {painelMenu()}
        </div>
    )
}