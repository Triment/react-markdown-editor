import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import Style from '../toolbar.module.scss'
export default function(props: React.ComponentProps<'li'>&{editNodeId:string,feedback: (arg0: string)=>void}){
/**
 * @description 捕捉点击事件，更改编辑区域的文本
 * @author splub
 * @date 2020-02-26
 * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} ele
 */
function capture(ele:React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const editNode = document.getElementById(props.editNodeId) as HTMLTextAreaElement
        const [start, end] = [editNode.selectionStart, editNode.selectionEnd]
        const selectText = editNode.value.slice(start,end)
        editNode.setRangeText(`[${selectText}](url)`,start,end)
        editNode.focus()
        editNode.setSelectionRange(start+1,end+1)
        props.feedback(editNode.value)
    }
    return (
        <li className={Style.Heading}>
            <FontAwesomeIcon icon={faLink} onClick={capture}/>
        </li>
    )
}