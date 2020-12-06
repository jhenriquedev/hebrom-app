import React, { useState, useEffect, useMemo } from 'react'

import './estilo.css'

import {
    Login,
    FindAllClient,
    Remove,
    Update, POST, Sumario, Busca,
    FindFuncao
} from '../../crud'

import { FormataData } from '../../util'

import env from '../../environments'

import Tela from '../../componentes/tela'
import Tab from '../../componentes/tab'

import Button from '../../componentes/button'
import Link from '../../componentes/link'

import TabPainel from '../../componentes/tabPainel' //painel que contém todos os itens
import TabCol from '../../componentes/tabCol' //colunas do painel => dividido em 2
import TabRow from '../../componentes/tabRow' //linhas que ficam dentro das colunas
import TabBox from '../../componentes/tabBox' //box que dividem as linhas em 2

import RowContainer from '../../componentes/rowContainer'
import RowItem from '../../componentes/rowItem'

import Lista from '../../componentes/lista'

import Tabela from '../../componentes/tabela'

import Form from '../../componentes/form'
import FormItem from '../../componentes/formItem'
import Input from '../../componentes/input'

import Select from '../../componentes/select'


export default ({ history }) => {
    const [sessao, setSessao] = useState({})
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const [tab, setTab] = useState(0)

    const [sumario, setSumario] = useState([])

    const [tabela, setTabela] = useState([])

    //perfil
    const [dadosIniciais, setDadosIniciais] = useState({})
    const [setor, setSetor] = useState({})
    const [sede, setSede] = useState({})
    const [supervisor, setSupervisor] = useState({})

    //selects
    const [congregs, setCongregs] = useState([])
    const [supervisores, setSupervisores] = useState([])

    const links = [
        { id: 0, texto: 'Setores', to: '/setores', history: history, btn: true, icone: 'icone-menu setores' }
    ]


    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        FindFuncao('Supervisor de Setor').then(resp => {
            if(resp.data){
                changeSelectSupervisores(resp.data)
            }
        })
    }, [])

    useEffect(()=>{
        setLoading(true)
        const user = Login(1)
        setSessao(user)
        try{
            if(tab === 0) Sumario('clients', user.client._id).then(resp => {
                    changeSumario(resp.data)
                    setLoading(resp.loading)
                    setAlert(resp)
                })
            if(tab === 1) FindAllClient('setores', 'Dados Carregados').then(resp => {
                    setLoading(resp.loading)
                    listagem(resp.data)
                    setAlert(resp)
                })
            if(tab === 2) Busca('congregacoes/find-sede-setor', 'Dados Carregados').then(resp => {
                    if(resp.data){
                        changeSelectSede(resp.data)
                        setLoading(resp.loading)
                        setAlert(resp)
                    }
                })
            if(tab != 2) resetPerfil()
        }catch(err){
            setLoading(false)
            setAlert(env.ALERTS[0])
        }
    }, [tab])

    useMemo(() => {
        if(setor._id){
            if(setor.ativo != dadosIniciais.ativo ){
                setLoading(true)
                const msg = setor.ativo ? 'Setor Ativado!' : 'Setor Desativado!'
                Update('setores', msg, setor._id, setor).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [setor.ativo])
    
    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Setores', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: setor._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
    ]


    const changeSumario = sumario => {
        let lista = [
            { id: 3, texto: 'Setores', info: `${sumario.setores}`, 
                link: { texto: sumario.setores > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.setores > 0 ? () => setTab(1) : () => setTab(2)}
            },
            { id: 4, texto: 'Áreas', info: `${sumario.areas}` },
            { id: 5, texto: 'Congregações', info: `${sumario.congregs}` },
            { id: 6, texto: 'Células', info: `${sumario.celulas}` },
            { id: 7, texto: 'Familias', info: `${sumario.familias}` },
            { id: 8, texto: 'Membros', info: `${sumario.membros}` }
        ]
        return setSumario(lista)
    }

    const changePerfil = item => {
        setDadosIniciais(item)
        setSetor(item)
        setSede(item.sede)
        setSupervisor(item.supervisor)

        //verificaTab(2)
        setTab(2)
    }

    const resetPerfil = () => {
        setSetor({})
        setSede({})
        setSupervisor({})
        setDadosIniciais({})
    }

    const changeSelectSede = dados => {
        let lista = []
        if (dados) {
            dados.map(item => {
                lista.push({
                    _id: item._id,
                    nome: item.nome
                })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem sedes cadastradas'
            })
        }

        return setCongregs(lista)
    }

    const changeSelectSupervisores = dados => {
        let lista = []
        if (dados) {
            dados.map(item => {
                lista.push({
                    _id: item._id,
                    nome: item.nome
                })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem supervisores cadastrados'
            })
        }

        return setSupervisores(lista)
    }

    const listagem = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({
                    id: item._id,
                    icone: [{ id: 0, icone: 'fa-power-off', cor: item.ativo ? 'green-2' : 'red' }],
                    colunas: [
                        item.nome,
                        item.supervisor ? item.supervisor.nome : 'Sem supervisão',
                        item.sede ? item.sede.nome : 'Sede não definida',
                        item.areas ? item.areas.length : '0',
                        item.congregs ? item.congregs.length : '0',
                        FormataData(item.createdAt),
                        <>
                            <Link texto='Gerenciar' onClick={() => changePerfil(item)} />
                        </>,
                    ]
                })
            })
        }
        if(dados.length < 1){
            lista.push({
                id: '0',
                icone: [{ id: 0, icone: 'fa-power-off', cor: 'red' }],
                colunas: ['Não existem setores cadastrados', '', '', '', '', '', '']
            })
        }

        return setTabela(lista)
    }

    const criacao = () => {
        setLoading(true)

        const data = {
            client: sessao.client,
            nome: setor.nome,
            sede: setor.sede,
            supervisor: setor.supervisor
        }

        const msg = 'Novo Setor Criado!'

        POST('setores', data, msg)
            .then(resp => {
                setLoading(resp.loading)
                resetPerfil()
                setAlert(resp)
                setTimeout(() => {
                    verificaTab(1) //volta para listagem
                    setTab(1)
                }, 1000)
            })
    }

    const update = (tabela, _id, dados) => {
        setLoading(true)

        Update(tabela, 'Dados Atualizados', _id, dados).then(resp => {
            if (resp) {
                setLoading(resp.loading)
                setAlert(resp)
            }
        })
    }


    const updateSetor = e => {
        e.preventDefault()
        update('setores', setor._id, setor)
    }

    const remove = () => {
        setLoading(true)
        Remove('setores', 'Setor removido', setor._id)
            .then(resp => {
                if (resp) {
                    resetPerfil()
                    setLoading(resp.loading)
                    setAlert(resp)
                    setTimeout(() => {
                        verificaTab(1) //volta para listagem
                        setTab(1)
                    }, 1000)
                }
            })
    }

    //configuracao dos formularios
    const configForm = {
        submit: updateSetor,
        id: setor._id ? true : false,
        cancelar: () => setSetor(dadosIniciais)
    }

    const tabs = [
        <TabPainel id='Overview'>
            <TabCol col='0'>
                <TabRow>
                    <Lista
                        className='lista-simples'
                        titulo='Útimas Atualizações'
                        button={[{ id: 0, lista: true, texto: 'Ver Relatórios', icone: 'fas fa-arrow-alt-circle-right', onClick: () => setTab(1) }]}
                        itens={sumario}
                    />
                </TabRow>
            </TabCol>
            <TabCol col='1'>
                <TabRow>

                </TabRow>
            </TabCol>
        </TabPainel>,
        <TabPainel id='Setores' full={true}>
            <TabRow>
                <Tabela
                    colunas={['Ativo', 'Nome', 'Supervisor', 'Sede', 'Areas', 'Congregações', 'Criado em', <Button texto='Add Setor' onClick={() => setTab(2)} />]}
                    linhas={tabela}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id={setor._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Setor</h3>
                        <p>Informações do Setor.</p>
                        {setor.createdAt ? <p>Criado em: <b>{FormataData(setor.createdAt)}</b></p> : ''}
                        {
                            setor.sede ?
                            <>
                                <p><b>Contatos da Sede</b></p>
                                <p>Telefone: <b>{setor.sede.fixo}</b></p>
                                <p>Celular: <b>{setor.sede.celular}</b></p>
                                <p>E-mail: <b>{setor.sede.email}</b></p>
                            </>
                            : ''
                        }
                        {
                            setor.supervisor ?
                            <>
                                <p><b>Contatos do Supervisor</b></p>
                                <p>Telefone: <b>{setor.supervisor.fixo}</b></p>
                                <p>Celular: <b>{setor.supervisor.celular}</b></p>
                                <p>E-mail: <b>{setor.supervisor.email}</b></p>
                            </>    
                            : ''
                        }
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-setor',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    type: 'text',
                                    name: 'nome',
                                    placeholder: 'Nome do Setor',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: true,
                                    disabled: false,
                                    autoFocus: setor._id ? false : true,
                                    onChange: event => setSetor({ ...setor, nome: event.target.value }),
                                    value: setor.nome
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'Sede-setor',
                                    label: true,
                                    icone: 'place-of-worship',
                                    name: 'sede',
                                    placeholder: 'Sede',
                                    required: false,
                                    disabled: false,
                                    lista: congregs,
                                    onChange: event => setSetor({ ...setor, sede: event.target.value }),
                                    value: setor.sede
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'Supervisor-setor',
                                    label: true,
                                    icone: 'user-tie',
                                    name: 'supervisor',
                                    placeholder: 'Supervisor',
                                    required: false,
                                    disabled: false,
                                    lista: supervisores,
                                    onChange: event => setSetor({ ...setor, supervisor: event.target.value }),
                                    value: setor.supervisor
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                setor._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        setor.ativo ?
                                            <>
                                                <h3>Desativar o Setor</h3>
                                                <p>Ao clicar neste botão você irá desativar o setor e não poderá mais ser utilizado para novas áreas.</p>
                                                <p><b>As áreas que já o utilizam não serão afetadas</b></p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar o setor</h3>
                                                <p>Ao clicar neste botão você irá ativar o setor e ele poderá ser utilizado novamente.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={setor.ativo ? 'red' : 'green'} texto={setor.ativo ? 'Desativar o Setor' : 'Ativar o Setor'} onClick={() => setSetor({ ...setor, ativo: !setor.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir o Setor</h3>
                                    <p>Ao clicar neste botão você irá remover o setor permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar o Setor' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Novo Setor</h3>
                                <p>Ao clicar neste botão você irá criar um novo Setor com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Setor' onClick={() => criacao()} />
                                </FormItem>
                            </RowItem>
                        </RowContainer>
                    </TabRow>
            }
        </TabPainel>,
    ]

    return (
        <Tela links={links} history={history} loading={loading} alert={alert}>
            <Tab links={linksTab} tab={tabs[tab]} />
        </Tela>
    )
}
