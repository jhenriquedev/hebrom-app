import React from 'react'

import './estilo.css'

import TabelaItem from '../tabelaItem'
import Icone from '../icone'


export default props => {
    return(
        <div className='div-tabela-padrao'>
            <table className='tabela-padrao'>
                <thead>
                    <tr>
                        {
                            props.colunas ?
                                props.colunas.map(col => {
                                    if(col.button){
                                        return(
                                            <th key={col.texto} >
                                                <div>
                                                    <button onClick={col.onClick}>
                                                        {col.texto}
                                                        <Icone cor={col.cor} tamanho='sm' icon={col.icone} />
                                                    </button>
                                                </div>
                                            </th> 
                                        )
                                    }else{
                                        return (<th key={col} >{col}</th>)
                                    }
                                })
                                : ''
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.linhas ?
                            props.linhas.map(linha => <TabelaItem key={linha.id} icones={linha.icone} colunas={linha.colunas} />)
                            :
                            <TabelaItem key={0} icones={[{ icone: 'fa-power-off', cor: 'red' }]} colunas={['Não há registros cadastrados.']} />
                    }
                </tbody>
            </table>
        </div>
    )
}