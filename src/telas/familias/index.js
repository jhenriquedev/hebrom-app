import React, { useState, useEffect, useMemo } from 'react'

import './estilo.css'

import {
    Login,
    FindAllClient,
    Remove,
    Update, POST, Sumario, Busca
} from '../../crud'

import { FormataData, FormataDataInter } from '../../util'

import Env from '../../environments'

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
    const [familia, setFamilia] = useState({})

    //selects
    const [congregacoes, setCongregs] = useState([])
    const [supervisores, setSupervisores] = useState([])
    const [membros, setMembros] = useState([])
    
    const links = [
        { id: 0, texto: 'Familias', to: '/familias', history: history, btn: true, icone: 'icone-menu family' }
    ]

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        setLoading(true)
        const user = Login(1)
        setSessao(user)

        try {
            FindAllClient('congregacoes', 'Dados Carregados').then(resp => {
                changeSelectCongregs(resp.data)
            })
            FindAllClient('users', 'Dados Carregados').then(resp => {
                changeSelectMembros(resp.data)
            })
            if (tab === 0) Sumario('clients', user.client._id).then(resp => {
                changeSumario(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
            if (tab === 1) FindAllClient('familias', 'Dados Carregados').then(resp => {
                setLoading(resp.loading)
                listagem(resp.data)
                setAlert(resp)
            })
            if (tab === 2) setLoading(false)
            if (tab === 2 && !familia._id) {
                setFamilia(familia)
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            }
            if (tab != 2) resetPerfil()
        } catch (err) {
            setLoading(false)
            setAlert(env.ALERTS[0])
        }
    }, [tab])

    useMemo(() => {
        if (familia._id) {
            if (familia.ativo != dadosIniciais.ativo) {
                setLoading(true)
                const msg = familia.ativo ? 'Familia Ativada!' : 'Familia Desativada!'
                Update('familias', msg, familia._id, familia).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [familia.ativo])

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Familias', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: familia._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
    ]

    const changeSelectCongregs = (dados) => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item._id, nome: item.nome })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Congregações cadastradas'
            })
        }

        return setCongregs(lista)
    }

    const changeSelectMembros = (dados) => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item._id, nome: item.nome })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem membros cadastrados'
            })
        }

        return setMembros(lista)
    }

    const changeSumario = sumario => {
        let lista = [
            {
                id: 3, texto: 'Familias', info: `${sumario.familias}`,
                link: { texto: sumario.familias > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.familias > 0 ? () => setTab(1) : () => setTab(2) }
            }
        ]
        return setSumario(lista)
    }

    const changePerfil = item => {
        setDadosIniciais(item)
        setFamilia(item)

        setTab(2)
    }

    const resetPerfil = () => {
        setFamilia({})
        setDadosIniciais({})
    }

    const listagem = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({
                    id: item._id,
                    icone: [{ id: 0, icone: 'fa-power-off', cor: item.ativo ? 'green-2' : 'red' }],
                    colunas: [
                        item.sobreNome,
                        item.congregacao ? item.congregacao.nome : 'Congregação não definida',
                        item.titular ? item.titular.nome : 'Titular não definido',
                        item.conjuge ? item.conjuge.nome : 'Cônjuge não definido',
                        item.filhos ? item.filhos.length : '0',
                        FormataData(item.createdAt),
                        <>
                            <Link texto='Gerenciar' onClick={() => changePerfil(item)} />
                        </>,
                    ]
                })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                icone: [{ id: 0, icone: 'fa-power-off', cor: 'red' }],
                colunas: ['Não existem familias cadastradas', '', '', '', '', '', '']
            })
        }

        return setTabela(lista)
    }

    const criar = () => {
        setLoading(true)

        const data = { ...familia, client: sessao.client }

        const msg = 'Nova Familia Adicionada!'

        POST('familias', data, msg).then(resp => {
            if (resp) {
                setLoading(resp.loading)
                resetPerfil()
                setAlert(resp)
                setTimeout(() => {
                    verificaTab(1) //volta para listagem
                    setTab(1)
                }, 1000)
            }
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

    const updateFamilia = e => {
        e.preventDefault()
        update('familias', familia._id, familia)
    }

    const remove = () => {
        setLoading(true)
        Remove('familias', 'Familia removida', familia._id)
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
        submit: updateFamilia,
        id: familia._id ? true : false,
        cancelar: () => setFamilia(dadosIniciais)
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
        <TabPainel id='Familias' full={true}>
            <TabRow>
                <Tabela
                    colunas={['Ativo','Sobrenome', 'Congregação', 'Titular', 'Cônjuge', 'Filhos', 'Criado em', <Button texto='Add Familia' onClick={() => setTab(2)} />]}
                    linhas={tabela}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id={familia._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Familia</h3>
                        <p>Informações básicas da Familia.</p>
                        {familia.createdAt ? <p>Criado em: <b>{FormataData(familia.createdAt)}</b></p> : ''}
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Select config={{
                                    id: 'congregacao-familia',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Congregação',
                                    placeholder: 'Congregação',
                                    required: false,
                                    disabled: false,
                                    lista: congregacoes,
                                    onChange: event => setFamilia({ ...familia, congregacao: event.target.value }),
                                    value: familia.congregacao ? familia.congregacao._id : familia.congregacao
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'titular-familia',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Titular',
                                    placeholder: 'Titular',
                                    required: false,
                                    disabled: false,
                                    lista: membros,
                                    onChange: event => setFamilia({ ...familia, titular: event.target.value }),
                                    value: familia.titular ? familia.titular._id : familia.titular
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'conjuge-familia',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Cônjuge',
                                    placeholder: 'Cônjuge',
                                    required: false,
                                    disabled: false,
                                    lista: membros,
                                    onChange: event => setFamilia({ ...familia, conjuge: event.target.value }),
                                    value: familia.conjuge ? familia.conjuge._id : familia.conjuge
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'casamento-familia',
                                    label: true,
                                    icone: 'calendar-alt',
                                    type: 'date',
                                    name: 'Data de Casamento',
                                    placeholder: 'Data de Casamento',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setFamilia({ ...familia, casamento: event.target.value }),
                                    value: FormataDataInter(familia.casamento)
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'sobrenome-familia',
                                    label: true,
                                    icone: 'envelope',
                                    type: 'text',
                                    name: 'Sobrenome',
                                    placeholder: 'Sobrenome',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setFamilia({ ...familia, sobrenome: event.target.value }),
                                    value: familia.sobrenome
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Filhos</h3>
                        <p>Filhos da Familia.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Select config={{
                                    id: 'filhos-familia',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Filhos',
                                    placeholder: 'Filhos',
                                    required: false,
                                    disabled: false,
                                    lista: membros,
                                    onChange: event => setFamilia({ ...familia, filhos: familia.filhos.push(event.target.value) }),
                                    value: familia.filhos ? familia.filhos._id : familia.filhos
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Contatos</h3>
                        <p>Contatos da Familia.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'telefone-familia',
                                    label: true,
                                    icone: 'phone-alt',
                                    type: 'tel',
                                    name: 'Fixo',
                                    placeholder: 'Telefone Fixo',
                                    maxLength: '12',
                                    minLength: '8',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setFamilia({ ...familia, fixo: event.target.value }),
                                    value: familia.fixo
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'familiar-familia',
                                    label: true,
                                    icone: 'mobile-alt',
                                    type: 'tel',
                                    name: 'familiar',
                                    placeholder: 'familiar',
                                    maxLength: '13',
                                    minLength: '9',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setFamilia({ ...familia, familiar: event.target.value }),
                                    value: familia.familiar
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'email-familia',
                                    label: true,
                                    icone: 'at',
                                    type: 'email',
                                    name: 'Email',
                                    placeholder: 'E-mail',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setFamilia({ ...familia, email: event.target.value }),
                                    value: familia.email
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                familia._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        familia.ativo ?
                                            <>
                                                <h3>Desativar a Familia</h3>
                                                <p>Ao clicar neste botão você irá desativar a Familia e não poderá mais ser utilizada para novos membros.</p>
                                                <p><b>Os membros que já o utilizam não serão afetados</b></p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar a Familia</h3>
                                                <p>Ao clicar neste botão você irá ativar a Familia e ela poderá ser utilizada novamente.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={familia.ativo ? 'red' : 'green'} texto={familia.ativo ? 'Desativar a Familia' : 'Ativar a Familia'} onClick={() => setFamilia({ ...familia, ativo: !familia.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir a Familia</h3>
                                    <p>Ao clicar neste botão você irá remover a Familia permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar a Familia' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Nova Familia</h3>
                                <p>Ao clicar neste botão você irá criar uma nova Familia com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Familia' onClick={() => criar()} />
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