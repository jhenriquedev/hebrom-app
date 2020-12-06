import React, { useState, useEffect, useMemo } from 'react'

import './estilo.css'

import { FindBatismo } from '../../crud'

import { 
    FormataData
} from '../../util'

import { 
    FiSearch, 
    FiBell, 
    FiMessageCircle, 
    FiUser, 
    FiChevronDown,
    FiX ,
    FiXCircle,
    FiSquare
  } from 'react-icons/fi';
  

import Tela from '../../componentes/tela'
import Tab from '../../componentes/tab'

import TabPainel from '../../componentes/tabPainel' //painel que contém todos os itens
import TabCol from '../../componentes/tabCol' //colunas do painel => dividido em 2
import TabRow from '../../componentes/tabRow' //linhas que ficam dentro das colunas

import Lista from '../../componentes/lista'
import Tabela from '../../componentes/tabela'

import Button from '../../componentes/button'
import Check from '../../componentes/check'

import RowContainer from '../../componentes/rowContainer'
import RowItem from '../../componentes/rowItem'

import Form from '../../componentes/form'
import FormItem from '../../componentes/formItem'
import Input from '../../componentes/input'

import Avatar from '../../componentes/avatar'
import { TabContainer } from 'react-bootstrap';


export default ({ history }) => {
    const [sessao, setSessao] = useState({})
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const [sumario, setSumario] = useState([])

    const [tabela, setTabela] = useState([])

    const [linksTab, setLinksTab] = useState([])
    const [tab, setTab] = useState(0)

    const [batismo, setBatismo] = useState({})
    const [membros, setMembros] = useState([])
    const [emitir, setEmitir] = useState(false)
    const [todosSelecionados, setTodosSelecionados] = useState(false)


    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        linksTab.push(linksOpcoes.Overview)
        //linksTab.push(linksOpcoes.configuracao)
        setTab(0)
    },[])


    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    const linksOpcoes = {
        Overview: { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        ministerio: { id: 1, texto: 'Credencial do Ministério', className: verificaTab(1), tab: () => setTab(1) },
        membro: { id: 2, texto: 'Carteira de Membro', className: verificaTab(2), tab: () => setTab(2) },
        batismo: { id: 3, texto: 'Certificado de Batismo', className: verificaTab(3), tab: () => setTab(3) },
        apresentacao: { id: 4, texto: 'Certificado de Apresentação', className: verificaTab(4), tab: () => setTab(4) },
        mudanca: { id: 5, texto: 'Carta de Mudança', className: verificaTab(5), tab: () => setTab(5) },
        recomendacao: { id: 6, texto: 'Carta de Recomendação', className: verificaTab(6), tab: () => setTab(6) },
        declaracao: { id: 7, texto: 'Declaração de Membro', className: verificaTab(7), tab: () => setTab(7) },
        //configuracao: { id: 8, texto: 'Configurações', className: verificaTab(8), tab: () => setTab(8) },
    }

    const changeListadeServicos = () => {
        let lista = []

        const array = [
            { id: 0, texto: 'Credencial do Ministério', icone: 'arrow-circle-right', tab: () => setTab(1) },
            { id: 1, texto: 'Carteira de Membro', icone: 'arrow-circle-right', tab: () => setTab(1) },
            //{ id: 2, texto: 'Certificado de Batismo', icone: 'arrow-circle-right', tab: () => setTab(3) },
            //{ id: 3, texto: 'Certificado de Apresentação', icone: 'arrow-circle-right', tab: () => setTab(4) },
            //{ id: 4, texto: 'Carta de Mudança', icone: 'arrow-circle-right', tab: () => setTab(5) },
            //{ id: 5, texto: 'Carta de Recomendação', icone: 'arrow-circle-right', tab: () => setTab(6) },
            //{ id: 6, texto: 'Declaração de Membro', icone: 'arrow-circle-right', tab: () => setTab(7) },
        ]

        array.map(item => {
            lista.push({id: item.id, icone: item.icone, texto: item.texto, onClick: item.tab })
        })

        return (lista)
    }

    const links = [
        { id: 0, texto: 'Serviços', to: '/servicos', history: history, btn: true, icone: 'icone-menu setores' }
    ]

    const configForm = {
        //submit: updateSetor,
        //id: setor._id ? true : false,
        //cancelar: () => setSetor(dadosIniciais)
    }

    const incluirNaLista = (selecionado) => {
        let lista = membros

        lista.map(item => {
            if(item === selecionado){
                if(item.check){
                    item.check = false
                }else{
                    item.check = true 
                }
            } 
        })

        let count = 0

        lista.map(item => {
            if(item.check){
                count++
            }
        })

        if(count > 0){
            setEmitir(true)
        }else{
            setEmitir(false)
        }

        if(count === lista.length){
            setTodosSelecionados(true)
        }else{
            setTodosSelecionados(false)
        }

        console.log(lista)

        efetuarBusca(lista)

        return setMembros(lista)
    }

    const incluirTodosNaLista = () => {
        let lista = membros
        let count  = 0

        lista.map(item => { 
            if(item.check){
                count++
            }
        })

        if(count === lista.length){
            removerTodosNaLista()
        }else{
            setEmitir(true)
            setTodosSelecionados(true)
            lista.map(item => item.check = true)
        }

        console.log(lista)

        efetuarBusca(lista)

        return setMembros(lista)
    }

    const removerTodosNaLista = () => {
        let lista = membros

        lista.map(item => item.check = false)

        console.log(lista)

        efetuarBusca(lista)

        setEmitir(false)
        setTodosSelecionados(false)

        return setMembros(lista)
    }

   
    const efetuarBusca = (dados) => {
        let lista = []

        if(tabela.length >= 1){
            tabela.length = 0
        }
        
        if(dados) {

            dados.map(item => {
                lista.push({
                    id: item._id,
                    colunas: [
                        <Check 
                            checked = {item.check}
                            config = {{ 
                                onChange: () => incluirNaLista(item) 
                            }} 
                        />,
                        item.avatar ? <Avatar src={item.avatar.url} /> : <Avatar src='img/user2.png' />,
                        item.matricula ? item.matricula : '',
                        item.nome ? item.nome : '',
                    ]
                })
            })

            setTabela(lista)

        }else{

            FindBatismo(batismo.data).then(resp => {
                setMembros(resp.data)
    
                if(resp.data.length > 0){
                    resp.data.map(item => {
                        lista.push({
                            id: item._id,
                            colunas: [
                                <Check 
                                    checked = { item.check || false }
                                    config = {{ onChange: () => incluirNaLista(item) }} 
                                />,
                                item.avatar ? <Avatar src={item.avatar.url} /> : <Avatar src='img/user2.png' />,
                                item.matricula ? item.matricula : '',
                                item.nome ? item.nome : '',
                            ]
                        })
                    })
        
                }else{
                    lista.push({
                        id: '0',
                        icone: [{ id: 0, icone: 'fa-power-off', cor: 'red' }],
                        colunas: ['Nenhum registro encontrado', '', '', '', '', '', '', '']
                    })
                }
                setTabela(lista)
                setLoading(resp.loading)
                setAlert(resp)
            })

        }   
    }

    const colunas = [ 
        <span>
            <Check 
                checked = { todosSelecionados }
                config = {{ onChange: () => incluirTodosNaLista() }} 
            />
            Selecionar
        </span>, 
        'Foto', 'Matricula', 'Nome' ]

    const tabs = [
        <TabPainel id="Overview">
          <TabCol col="0">
            <TabRow>
              <Lista titulo="Todos os Serviços" links={changeListadeServicos()} />
            </TabRow>
          </TabCol>
        </TabPainel>,
        <TabPainel id={"carteiraMembro"} full={true}>
          <TabRow bottom={true}>
            <RowContainer>
              <RowItem>
                <h3>Carteira de Membro</h3>
                <p>
                  Informe a data de batismo para exibir os membros que deseja emitir o documento.
                </p>
                <br />
              </RowItem>
              <RowItem>
                <Form config={configForm}>
                  <FormItem>
                    <Input
                      config={{
                        id: "data-batismo",
                        label: true,
                        icone: "map-marker-alt",
                        type: "date",
                        name: "Data batismo",
                        placeholder: "Data Batismo",
                        required: true,
                        disabled: false,
                        onChange: (event) =>
                          setBatismo({ ...batismo, data: event.target.value }),
                        value: batismo.data,
                      }}
                    />
                  </FormItem>
                  <FormItem>
                <Button
                  className="green"
                  texto="Efetuar Busca"
                  onClick={() => efetuarBusca()}
                />
              </FormItem>
                </Form>
              </RowItem>
            </RowContainer>
          </TabRow>
          <TabRow>
            <Tabela colunas={colunas} linhas={tabela} />
          </TabRow>
          <TabRow>
                <RowContainer>
                    <RowItem></RowItem>
                    <RowItem>
                        {
                            emitir ?
                                <Button
                                    className="red"
                                    texto="Emitir Cartão"
                                    onClick={() => efetuarBusca()}
                                />
                            : ''
                        }
                        
                    </RowItem>
                </RowContainer>
            </TabRow>
        </TabPainel>,
      ];

    return (
        <Tela links={links} history={history} loading={loading} alert={alert}>
            <Tab links={linksTab} tab={tabs[tab]} />
        </Tela>
    )
}