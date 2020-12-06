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
import Check from '../../componentes/checkbox'

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
    const [congreg, setCongreg] = useState({})

    //selects
    const [areas, setAreas] = useState([])
    
    const links = [
        { id: 0, texto: 'Congregações', to: '/congregacoes', history: history, btn: true, icone: 'icone-menu congregs' }
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

        try{
            FindAllClient('areas', 'Dados Carregados').then(resp => {
                changeSelectAreas(resp.data)
            })

            if (tab === 0) Sumario('clients', user.client._id).then(resp => {
                changeSumario(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
            if (tab === 1) FindAllClient('congregacoes', 'Dados Carregados').then(resp => {
                setLoading(resp.loading)
                listagem(resp.data)
                setAlert(resp)
            })
            if(tab === 2) setLoading(false)
            if(tab === 2 && !congreg._id){
                setCongreg(congreg)
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            }
            if(tab != 2) resetPerfil()
        }catch(err){
            setLoading(false)
            setAlert(env.ALERTS[0])
        }
    }, [tab])

    useMemo(() => {
        if (congreg._id) {
            if (congreg.ativo != dadosIniciais.ativo) {
                setLoading(true)
                const msg = congreg.ativo ? 'Congregação Ativada!' : 'Congregação Desativada!'
                Update('congregacoes', msg, congreg._id, congreg).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [congreg.ativo])

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Congregações', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: congreg._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
    ]

    const changeSelectAreas = (dados) => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item._id, nome: item.nome })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Áreas cadastradas'
            })
        }

        return setAreas(lista)
    }

    const changeSumario = sumario => {
        let lista = [
            {
                id: 3, texto: 'Congregações', info: `${sumario.congregs}`,
                link: { texto: sumario.congregs > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.congregs > 0 ? () => setTab(1) : () => setTab(2) }
            },
            { id: 6, texto: 'Células', info: `${sumario.celulas}` },
            { id: 7, texto: 'Familias', info: `${sumario.familias}` },
            { id: 8, texto: 'Membros', info: `${sumario.membros}` }
        ]
        return setSumario(lista)
    }

    const changePerfil = item => {
        setDadosIniciais(item)
        setCongreg(item)

        setTab(2)
    }

    const resetPerfil = () => {
        setCongreg({})
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
                        item.sedeCampo ? <b className='green'>{item.nome}</b> : item.nome,
                        item.area ? item.sedeArea ? <b className='green'>{item.area.nome}</b> : item.area.nome : 'Área não definida',
                        item.setor ? item.sedeSetor ? <b className='green'>{item.setor.nome}</b> : item.setor.nome : 'Setor não definido',
                        item.membros ? item.membros.length : '0',
                        item.celulas ? item.celulas.length : '0',
                        item.familias ? item.familias.length : '0',
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
                colunas: ['Não existem congregações cadastradas', '', '', '', '', '', '']
            })
        }

        return setTabela(lista)
    }

    const criar = () => {
        setLoading(true)

        const data = {...congreg, client: sessao.client}

        const msg = 'Nova Congregação Adicionada!'

        POST('congregacoes', data, msg).then(resp => {
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

    const updateCongreg = e => {
        e.preventDefault()
        update('congregacoes', congreg._id, congreg)
    }

    const remove = () => {
        setLoading(true)
        Remove('congregacoes', 'Congregação removida', congreg._id)
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
        submit: updateCongreg,
        id: congreg._id ? true : false,
        cancelar: () => setCongreg(dadosIniciais)
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
        <TabPainel id='Congregacoes' full={true}>
            <TabRow>
                <Tabela
                    colunas={['Ativo', 'Nome', 'Área', 'Setor', 'Membros', 'Células', 'Familias', 'Criado em', <Button texto='Add Congregação' onClick={() => setTab(2)} />]}
                    linhas={tabela}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id={congreg._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Congregação</h3>
                        <p>Informações básicas da congregação.</p>
                        {congreg.createdAt ? <p>Criado em: <b>{FormataData(congreg.createdAt)}</b></p> : ''}
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-congreg',
                                    label: true,
                                    icone: 'place-of-worship',
                                    type: 'text',
                                    name: 'nome',
                                    placeholder: 'Nome da Congregação',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: true,
                                    disabled: false,
                                    autoFocus: congreg._id ? false : true,
                                    onChange: event => setCongreg({ ...congreg, nome: event.target.value }),
                                    value: congreg.nome
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'fundacao-congreg',
                                    label: true,
                                    icone: 'calendar-alt',
                                    type: 'date',
                                    name: 'Fundação',
                                    placeholder: 'Fundação',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, fundacao: event.target.value }),
                                    value: FormataDataInter(congreg.fundacao)
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'nconsumidora-congreg',
                                    label: true,
                                    icone: 'fingerprint',
                                    type: 'text',
                                    name: 'nconsumidora',
                                    placeholder: 'Unidade Consumidora',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, nConsumidora: event.target.value }),
                                    value: congreg.nConsumidora
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'area-congreg',
                                    label: true,
                                    icone: 'map-marker-alt',
                                    name: 'Área',
                                    placeholder: 'Área',
                                    required: false,
                                    disabled: false,
                                    lista: areas,
                                    onChange: event => setCongreg({ ...congreg, area: event.target.value }),
                                    value: congreg.area ? congreg.area._id : congreg.area
                                }} />
                            </FormItem>
                            <FormItem>
                                <Check config={{
                                    icone: 'place-of-worship',
                                    label: true,
                                    id: 'sedeCampo-congreg',
                                    name: 'Sede do Campo?',
                                    placeholder: 'Sede do Campo?',
                                    label:true,
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, sedeCampo: event.target.checked }),
                                    checked: congreg.sedeCampo
                                }} />
                            </FormItem>
                            <FormItem>
                                <Check config={{
                                    icone: 'place-of-worship',
                                    label: true,
                                    id: 'sedeSetor-congreg',
                                    name: 'Sede do Setor?',
                                    placeholder: 'Sede do Setor?',
                                    label: true,
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, sedeSetor: event.target.checked }),
                                    checked: congreg.sedeSetor
                                }} />
                            </FormItem>
                            <FormItem>
                                <Check config={{
                                    icone: 'place-of-worship',
                                    label: true,
                                    id: 'sedeArea-congreg',
                                    name: 'Sede da Área?',
                                    placeholder: 'Sede da Área?',
                                    label: true,
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, sedeArea: event.target.checked }),
                                    checked: congreg.sedeArea
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
                        <p>Endereço da congregação.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'cep-congreg',
                                    label: true,
                                    icone: 'envelope',
                                    type: 'text',
                                    name: 'Cep',
                                    placeholder: 'Cep',
                                    maxLength: '9',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, cep: event.target.value }),
                                    value: congreg.cep
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'logradouro-congreg',
                                    label: true,
                                    icone: 'location-arrow',
                                    type: 'text',
                                    name: 'Logradouro',
                                    placeholder: 'Logradouro',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, logradouro: event.target.value }),
                                    value: congreg.logradouro
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'complemento-congreg',
                                    label: true,
                                    icone: 'puzzle-piece',
                                    type: 'text',
                                    name: 'Complemento',
                                    placeholder: 'Complemento',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, complemento: event.target.value }),
                                    value: congreg.complemento
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'bairro-congreg',
                                    label: true,
                                    icone: 'map',
                                    type: 'text',
                                    name: 'Bairro',
                                    placeholder: 'Bairro',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, bairro: event.target.value }),
                                    value: congreg.bairro
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'cidade-congreg',
                                    label: true,
                                    icone: 'city',
                                    type: 'text',
                                    name: 'Cidade',
                                    placeholder: 'Cidade',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, cidade: event.target.value }),
                                    value: congreg.cidade
                                }} />
                            </FormItem>
                            <FormItem>
                                <Select config={{
                                    id: 'uf-congreg',
                                    label: true,
                                    icone: 'flag-checkered',
                                    name: 'Uf',
                                    placeholder: 'UF',
                                    required: false,
                                    disabled: false,
                                    lista: Env.UFS,
                                    onChange: event => setCongreg({ ...congreg, uf: event.target.value }),
                                    value: congreg.uf
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'numero-congreg',
                                    label: true,
                                    icone: 'sort-numeric-up',
                                    type: 'text',
                                    name: 'Número',
                                    placeholder: 'Número',
                                    maxLength: '6',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, numero: event.target.value }),
                                    value: congreg.numero
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
                        <p>Contatos da congregação.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <Input config={{
                                    id: 'telefone-congreg',
                                    label: true,
                                    icone: 'phone-alt',
                                    type: 'tel',
                                    name: 'Fixo',
                                    placeholder: 'Telefone Fixo',
                                    maxLength: '12',
                                    minLength: '8',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, fixo: event.target.value }),
                                    value: congreg.fixo
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'celular-congreg',
                                    label: true,
                                    icone: 'mobile-alt',
                                    type: 'tel',
                                    name: 'Celular',
                                    placeholder: 'Celular',
                                    maxLength: '13',
                                    minLength: '9',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, celular: event.target.value }),
                                    value: congreg.celular
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'email-congreg',
                                    label: true,
                                    icone: 'at',
                                    type: 'email',
                                    name: 'Email',
                                    placeholder: 'E-mail',
                                    maxLength: '50',
                                    minLength: '5',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCongreg({ ...congreg, email: event.target.value }),
                                    value: congreg.email
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                congreg._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        congreg.ativo ?
                                            <>
                                                <h3>Desativar a Congregação</h3>
                                                <p>Ao clicar neste botão você irá desativar a Congregação e não poderá mais ser utilizada para novos membros.</p>
                                                <p><b>Os membros que já o utilizam não serão afetados</b></p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar a Congregação</h3>
                                                <p>Ao clicar neste botão você irá ativar a congregação e ela poderá ser utilizada novamente.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={congreg.ativo ? 'red' : 'green'} texto={congreg.ativo ? 'Desativar a Congregação' : 'Ativar a Congregação'} onClick={() => setCongreg({ ...congreg, ativo: !congreg.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir a Congregação</h3>
                                    <p>Ao clicar neste botão você irá remover a Congregação permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar a congregação' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Nova Congregação</h3>
                                <p>Ao clicar neste botão você irá criar uma nova congregação com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Congregação' onClick={() => criar()} />
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