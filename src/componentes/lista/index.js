import React from 'react'

import './estilo.css'

import {GeraMatricula} from '../../util'

import TabBox from '../tabBox'
import Menu from '../menu'

import Item from '../listaItem'
import ItemForm from '../listaItemForm'


export default props => {

    const count = props.array ? props.array.length : false

    return(
        <div className={props.className || 'lista-padrao'}>
            <div className='lista-padrao-header'>
                <TabBox><p>{props.titulo}</p></TabBox>
                <TabBox className='tab-box-esquerda'>
                    <Menu links={props.button} />
                </TabBox>
            </div>
            <div className='lista-padrao-body'>
                {
                    props.form ?
                        <div>
                            {
                                props.itens ?
                                    props.itens.map(item => {
                                        if(props.itens[props.itens.length-1] === item){
                                            return <ItemForm key={item.id} item={item} />
                                        }else{
                                            return <ItemForm className='border-bottom' key={item.id} item={item} />
                                        }
                                    })
                                    :
                                    <ItemForm item={
                                        {
                                            id: 0,
                                            icone: [
                                                { id: 0, icon: 'power-off', cor: 'red' }
                                            ],
                                            texto: 'Lista Vazia',
                                            info: 'É preciso receber parametros.',
                                        }
                                    } />
                            }
                        </div>
                    :

                        <div>
                            {
                                count ?

                                    props.array ?
                                        props.array.map(item =>
                                            <Item key={item.id || GeraMatricula()} texto={item.texto} btn={
                                                { icone: item.icone ? item.icone : 'trash-alt fa-sm', onClick: item.onClick }
                                            } />)
                                        : ''

                                    :
                                    props.links ? 
                                        props.links.map(item => <Item key={item.id} link={item.texto} onClick={item.onClick} icone={item.icone} ultimo={item.ultimo}/>)
                                    :
                                    props.itens ?
                                        props.itens.map(item => {
                                            if (props.itens[props.itens.length - 1] === item) {
                                                return <Item key={item.id} item={item} />
                                            } else {
                                                return <Item className='border-bottom' key={item.id} item={item} />
                                            }
                                        })
                                    :
                                        <Item item={
                                            {
                                                id: 0,
                                                icone: [
                                                    { id: 0, icon: 'power-off', cor: 'red' }
                                                ],
                                                texto: 'Lista Vazia',
                                                info: 'É preciso receber parametros.',
                                            }
                                        } />

                            }
                        </div>
                }
            </div>
        </div>
    )
}