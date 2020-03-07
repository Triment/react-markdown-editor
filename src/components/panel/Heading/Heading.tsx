import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeading } from '@fortawesome/free-solid-svg-icons'
import Style from '../toolbar.module.scss'

export default function(props: React.ComponentProps<'li'>&{editNodeId:string,feedback: (arg0: string)=>void}){
/**
 * @description 捕捉点击事件，更改编辑区域的文本
 * @author splub
 * @date 2020-02-26
 * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} ele
 */
function capture(ele:React.MouseEvent<HTMLLIElement, MouseEvent>) {
        const editNode = document.getElementById(props.editNodeId) as HTMLTextAreaElement
        const [start, end] = [editNode.selectionStart,editNode.selectionEnd]
        const selectText = editNode.value.slice(start,end)
        let tempSource = ''
        tempSource+=editNode.value.slice(0,start)
        const index = Number(ele.currentTarget.innerText.slice(1))
        for(let i = 0; i < index; i++){
            tempSource+='#'
        }
        tempSource+=` ${selectText}`
        tempSource+=editNode.value.slice(end)
        editNode.value = tempSource
        editNode.focus()
        editNode.setSelectionRange(start+index+1,start+index+1+selectText.length)
        props.feedback(editNode.value)
    }
    return (
        <li className={Style.Heading}>
            <FontAwesomeIcon icon={faHeading}/>
            <div className={Style.Heading_items}>
            {[1,2,3,4,5,6].map(ele=>{
                return <li key={ele.valueOf()} className={Style.Heading_item} onClick={capture}>H{ele}</li>
            })}
            </div>
        </li>
    )
}