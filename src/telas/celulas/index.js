import React, { useState, useEffect, useMemo } from 'react'

import './estilo.css'

import {
    Login,
    FindAllClient,
    Remove,
    Update, POST, Sumario, Busca,
    FindFuncao
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
    const [celula, setCelula] = useState({})

    //selects
    const [congregacoes, setCongregs] = useState([])
    const [supervisores, setSupervisores] = useState([])

    const links = [
        { id: 0, texto: 'Células', to: '/celulas', history: history, btn: true, icone: 'icone-menu celula' }
    ]

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        FindFuncao('Supervisor de Célula').then(resp => {
            if (resp.data) {
                changeSelectSupervisores(resp.data)
            }
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        const user = Login(1)
        setSessao(user)

        try {
            FindAllClient('congregacoes', 'Dados Carregados').then(resp => {
                changeSelectCongregs(resp.data)
            })
            if (tab === 0) Sumario('clients', user.client._id).then(resp => {
                changeSumario(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
            if (tab === 1) FindAllClient('celulas', 'Dados Carregados').then(resp => {
                setLoading(resp.loading)
                listagem(resp.data)
                setAlert(resp)
            })
            if (tab === 2) setLoading(false)
            if (tab === 2 && !celula._id) {
                setCelula(celula)
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
        if (celula._id) {
            if (celula.ativo != dadosIniciais.ativo) {
                setLoading(true)
                const msg = celula.ativo ? 'Célula Ativada!' : 'Célula Desativada!'
                Update('celulas', msg, celula._id, celula).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [celula.ativo])

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Células', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: celula._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
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

    const changeSelectSupervisores = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item._id, nome: item.nome })
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

    const changeSumario = sumario => {
        let lista = [
            {
                id: 3, texto: 'Células', info: `${sumario.celulas}`,
                link: { texto: sumario.celulas > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.celulas > 0 ? () => setTab(1) : () => setTab(2) }
            }
        ]
        return setSumario(lista)
    }

    const changePerfil = item => {
        setDadosIniciais(item)
        setCelula(item)

        setTab(2)
    }

    const resetPerfil = () => {
        setCelula({})
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
                        item.nome,
                        item.supervisor ?item.supervisor.nome : 'Supervisor não definido',
                        item.congregacao ? item.congregacao.nome : 'Congregação não definida' ,
                        item.area ? item.area.nome : 'Área não definida',
                        item.membros ? item.membros.length : '0',
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
                colunas: ['Não existem células cadastradas', '', '', '', '', '', '']
            })
        }

        return setTabela(lista)
    }

    const criar = () => {
        setLoading(true)

        const data = { ...celula, client: sessao.client }

        const msg = 'Nova Célula Adicionada!'

        POST('celulas', data, msg).then(resp => {
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

        console.log(_id)
        console.log(dados)
        
        Update(tabela, 'Dados Atualizados', _id, dados).then(resp => {
            if (resp) {
                setLoading(resp.loading)
                setAlert(resp)
            }
        })
    }

    const updateCelula = e => {
        e.preventDefault()
        update('celulas', celula._id, celula)
    }

    const remove = () => {
        setLoading(true)
        Remove('celulas', 'Célula removida', celula._id)
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
        submit: updateCelula,
        id: celula._id ? true : false,
        cancelar: () => setCelula(dadosIniciais)
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
        <TabPainel id='Células' full={true}>
            <TabRow>
                <Tabela
                    colunas={['Ativo', 'Nome', 'Supervisor', 'Congregação', 'Área', 'Membros', 'Criado em', <Button texto='Add Célula' onClick={() => setTab(2)} />]}
                    linhas={tabela}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id={celula._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Célula</h3>
                        <p>Informações básicas da célula.</p>
                        {celula.createdAt ? <p>Criado em: <b>{FormataData(celula.createdAt)}</b></p> : ''}
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-celula',
                                    label: true,
                                    icone: 'place-of-worship',
                                    type: 'text',
                                    name: 'nome',
                                    placeholder: 'Nome da Célula',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: true,
                                    disabled: false,
                                    autoFocus: celula._id ? false : true,
                                    onChange: event => setCelula({ ...celula, nome: event.target.value }),
                                    value: celula.nome
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'fundacao-celula',
                                    label: true,
                                    icone: 'calendar-alt',
                                    type: 'date',
                                    name: 'Fundação',
                                    placeholder: 'Fundação',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, fundacao: event.target.value }),
                                    value: FormataDataInter(celula.fundacao)
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'congregacao-celula',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Congregação',
                                    placeholder: 'Congregação',
                                    required: false,
                                    disabled: false,
                                    lista: congregacoes,
                                    onChange: event => setCelula({ ...celula, congregacao: event.target.value }),
                                    value: celula.congregacao ? celula.congregacao._id : celula.congregacao
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'supervisor-celula',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Supervisor',
                                    placeholder: 'Supervisor',
                                    required: false,
                                    disabled: false,
                                    lista: supervisores,
                                    onChange: event => setCelula({ ...celula, supervisor: event.target.value }),
                                    value: celula.supervisor ? celula.supervisor._id : celula.supervisor
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Endereço</h3>
                        <p>Endereço da célula.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'cep-celula',
                                    label: true,
                                    icone: 'envelope',
                                    type: 'text',
                                    name: 'Cep',
                                    placeholder: 'Cep',
                                    maxLength: '9',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, cep: event.target.value }),
                                    value: celula.cep
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'logradouro-celula',
                                    label: true,
                                    icone: 'location-arrow',
                                    type: 'text',
                                    name: 'Logradouro',
                                    placeholder: 'Logradouro',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, logradouro: event.target.value }),
                                    value: celula.logradouro
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'complemento-celula',
                                    label: true,
                                    icone: 'puzzle-piece',
                                    type: 'text',
                                    name: 'Complemento',
                                    placeholder: 'Complemento',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, complemento: event.target.value }),
                                    value: celula.complemento
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'bairro-celula',
                                    label: true,
                                    icone: 'map',
                                    type: 'text',
                                    name: 'Bairro',
                                    placeholder: 'Bairro',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, bairro: event.target.value }),
                                    value: celula.bairro
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'cidade-celula',
                                    label: true,
                                    icone: 'city',
                                    type: 'text',
                                    name: 'Cidade',
                                    placeholder: 'Cidade',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, cidade: event.target.value }),
                                    value: celula.cidade
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'uf-celula',
                                    label: true,
                                    icone: 'flag-checkered',
                                    name: 'Uf',
                                    placeholder: 'UF',
                                    required: false,
                                    disabled: false,
                                    lista: Env.UFS,
                                    onChange: event => setCelula({ ...celula, uf: event.target.value }),
                                    value: celula.uf
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'numero-celula',
                                    label: true,
                                    icone: 'sort-numeric-up',
                                    type: 'text',
                                    name: 'Número',
                                    placeholder: 'Número',
                                    maxLength: '6',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, numero: event.target.value }),
                                    value: celula.numero
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
                        <p>Contatos da célula.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'telefone-celula',
                                    label: true,
                                    icone: 'phone-alt',
                                    type: 'tel',
                                    name: 'Fixo',
                                    placeholder: 'Telefone Fixo',
                                    maxLength: '12',
                                    minLength: '8',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, fixo: event.target.value }),
                                    value: celula.fixo
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'celular-celula',
                                    label: true,
                                    icone: 'mobile-alt',
                                    type: 'tel',
                                    name: 'Celular',
                                    placeholder: 'Celular',
                                    maxLength: '13',
                                    minLength: '9',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, celular: event.target.value }),
                                    value: celula.celular
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'email-celula',
                                    label: true,
                                    icone: 'at',
                                    type: 'email',
                                    name: 'Email',
                                    placeholder: 'E-mail',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCelula({ ...celula, email: event.target.value }),
                                    value: celula.email
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                celula._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        celula.ativo ?
                                            <>
                                                <h3>Desativar a Célula</h3>
                                                <p>Ao clicar neste botão você irá desativar a Célula e não poderá mais ser utilizada para novos membros.</p>
                                                <p><b>Os membros que já o utilizam não serão afetados</b></p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar a Célula</h3>
                                                <p>Ao clicar neste botão você irá ativar a célula e ela poderá ser utilizada novamente.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={celula.ativo ? 'red' : 'green'} texto={celula.ativo ? 'Desativar a Célula' : 'Ativar a Célula'} onClick={() => setCelula({ ...celula, ativo: !celula.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir a Célula</h3>
                                    <p>Ao clicar neste botão você irá remover a Célula permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar a célula' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Nova Célula</h3>
                                <p>Ao clicar neste botão você irá criar uma nova célula com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Célula' onClick={() => criar()} />
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