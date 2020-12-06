import React, {useState, useEffect, useMemo} from 'react'

import './estilo.css'

import {
    Login,
    FindOne,
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
    const [area, setArea] = useState({})
    const [sede, setSede] = useState({})
    const [supervisor, setSupervisor] = useState({})

    //selects
    const [congregs, setCongregs] = useState([])
    const [supervisores, setSupervisores] = useState([])
    const [setores, setSetores] = useState([])


    const links = [
        { id: 0, texto: 'Áreas', to: '/areas', history: history, btn: true, icone: 'icone-menu area' }
    ]

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        FindFuncao('Supervisor de Área').then(resp => {
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
            if (tab === 0) Sumario('clients', user.client._id).then(resp => {
                changeSumario(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
            if (tab === 1) FindAllClient('areas', 'Dados Carregados').then(resp => {
                setLoading(resp.loading)
                listagem(resp.data)
                setAlert(resp)
            })
            if (tab === 2){
                Busca('congregacoes/find-sede-area', 'Dados Carregados').then(resp => {
                    changeSelectSede(resp.data)
                })
                FindAllClient('setores', 'Dados Carregados').then(resp => {
                    changeSelectSetores(resp.data)
                    setLoading(resp.loading)
                    setAlert(resp)
                })
            } 
            if (tab != 2) resetPerfil()
        } catch (err) {
            setLoading(false)
            setAlert(env.ALERTS[0])
        }
    }, [tab])

    useMemo(() => {
        if (area._id) {
            if (area.ativo != dadosIniciais.ativo) {
                setLoading(true)
                const msg = area.ativo ? 'Área Ativada!' : 'Área Desativada!'
                Update('areas', msg, area._id, area).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [area.ativo])

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Áreas', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: area._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
    ]

    const changeSumario = sumario => {
        let lista = [
            {
                id: 0, texto: 'Áreas', info: `${sumario.areas}`,
                link: { texto: sumario.areas > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.areas > 0 ? () => setTab(1) : () => setTab(2) }
            },
            { id: 1, texto: 'Congregações', info: `${sumario.congregs}` },
            { id: 2, texto: 'Células', info: `${sumario.celulas}` },
            { id: 3, texto: 'Familias', info: `${sumario.familias}` },
            { id: 4, texto: 'Membros', info: `${sumario.membros}` }
        ]
        return setSumario(lista)
    }

    const changePerfil = item => {
        setDadosIniciais(item)
        setArea(item)
        setSede(item.sede)
        setSupervisor(item.supervisor)

        setTab(2)
    }

    const resetPerfil = () => {
        setArea({})
        setSede({})
        setSupervisor({})
        setDadosIniciais({})
    }

    const changeSelectSetores = (dados) => {
        let lista = []

        if (dados) {
            let setor = area.setor
            dados.map(item => {
                if (setor && setor._id === item._id){
                    lista.push({ _id: item._id, nome: item.nome, selected: true })
                }else{
                    lista.push({ _id: item._id, nome: item.nome, selected: false })
                }
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem setores cadastrados'
            })
        }

        return setSetores(lista)
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
                        item.setor ? item.setor.nome : 'Setor não definido',
                        item.supervisor ? item.supervisor.nome : 'Sem supervisão',
                        item.sede ? item.sede.nome : 'Sede não definida',
                        item.congregs ? item.congregs.length : '0',
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
                colunas: ['Não existem áreas cadastradas', '', '', '', '', '', '']
            })
        }

        return setTabela(lista)
    }

    const criar = () => {
        setLoading(true)

        const data = {
            client: sessao.client,
            nome: area.nome,
            sede: area.sede,
            supervisor: area.supervisor,
            setor: area.setor
        }

        const msg = 'Nova Área Adicionada!'

        POST('areas', data, msg).then(resp => {
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

    const updateArea = e => {
        e.preventDefault()
        update('areas', area._id, area)
    }

    const remove = () => {
        setLoading(true)
        Remove('areas', 'Área removida', area._id)
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
        submit: updateArea,
        id: area._id ? true : false,
        cancelar: () => setArea(dadosIniciais)
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
        <TabPainel id='Áreas' full={true}>
            <TabRow>
                <Tabela
                    colunas={['Ativo', 'Nome', 'Setor', 'Supervisor', 'Sede', 'Congregações', 'Criado em', <Button texto='Add Área' onClick={() => setTab(2)} />]}
                    linhas={tabela}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id={area._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Área</h3>
                        <p>Informações da Área.</p>
                        {area.createdAt ? <p>Criado em: <b>{FormataData(area.createdAt)}</b></p> : ''}
                        {
                            area.sede ?
                                <>
                                    <p><b>Contatos da Sede</b></p>
                                    <p>Telefone: <b>{area.sede.fixo}</b></p>
                                    <p>Celular: <b>{area.sede.celular}</b></p>
                                    <p>E-mail: <b>{area.sede.email}</b></p>
                                </>
                                : ''
                        }
                        {
                            area.supervisor ?
                                <>
                                    <p><b>Contatos do Supervisor</b></p>
                                    <p>Telefone: <b>{area.supervisor.fixo}</b></p>
                                    <p>Celular: <b>{area.supervisor.celular}</b></p>
                                    <p>E-mail: <b>{area.supervisor.email}</b></p>
                                </>
                                : ''
                        }
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-area',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    type: 'text',
                                    name: 'nome',
                                    placeholder: 'Nome da Área',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: true,
                                    disabled: false,
                                    autoFocus: area._id ? false : true,
                                    onChange: event => setArea({ ...area, nome: event.target.value }),
                                    value: area.nome
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'Setor-area',
                                    label: true,
                                    icone: 'place-of-worship',
                                    name: 'setor',
                                    placeholder: 'Setor',
                                    required: false,
                                    disabled: false,
                                    lista: setores,
                                    onChange: event => setArea({ ...area, setor: event.target.value }),
                                    value: area.setor ? area.setor._id : area.setor
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'Sede-area',
                                    label: true,
                                    icone: 'place-of-worship',
                                    name: 'sede',
                                    placeholder: 'Sede',
                                    required: false,
                                    disabled: false,
                                    lista: congregs,
                                    onChange: event => setArea({ ...area, sede: event.target.value }),
                                    value: area.sede ? area.sede._id : area.sede
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'Supervisor-area',
                                    label: true,
                                    icone: 'user-tie',
                                    name: 'supervisor',
                                    placeholder: 'Supervisor',
                                    required: false,
                                    disabled: false,
                                    lista: supervisores,
                                    onChange: event => setArea({ ...area, supervisor: event.target.value }),
                                    value: area.supervisor ? area.supervisor._id : area.supervisor
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                area._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        area.ativo ?
                                            <>
                                                <h3>Desativar a Área</h3>
                                                <p>Ao clicar neste botão você irá desativar a área e não poderá mais ser utilizada para novas congregações.</p>
                                                <p><b>As congregações que já o utilizam não serão afetadas</b></p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar a Área</h3>
                                                <p>Ao clicar neste botão você irá ativar a área e ela poderá ser utilizada novamente.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={area.ativo ? 'red' : 'green'} texto={area.ativo ? 'Desativar a Área' : 'Ativar a Área'} onClick={() => setArea({ ...area, ativo: !area.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir a Área</h3>
                                    <p>Ao clicar neste botão você irá remover a área permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar a Área' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Nova Área</h3>
                                <p>Ao clicar neste botão você irá criar uma nova Área com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Área' onClick={() => criar()} />
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