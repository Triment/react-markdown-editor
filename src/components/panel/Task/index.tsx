import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTasks } from '@fortawesome/free-solid-svg-icons'
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
        const res = selectText.split('\n')
        const str = res.map((v, i)=>{
            return `- [ ] ${v}\n`
        })
        const res2 = str.join('')
        editNode.setRangeText(res2.slice(0,-1),start,end)
        editNode.focus()
        if(start<end){
            editNode.setSelectionRange(start+selectText.length+res.length*6,start+selectText.length+res.length*6)
        } else if (end>start){
            editNode.setSelectionRange(end+selectText.length+res.length*6,start+selectText.length+res.length*6)
        } else {
            //光标起点结尾在一起，未选中，生成bug的地方
            editNode.setSelectionRange(start+res2.length,start+res2.length)
        }
        props.feedback(editNode.value)
    }
    return (
        <li className={Style.Heading}>
            <FontAwesomeIcon icon={faTasks} onClick={capture}/>
        </li>
    )
}