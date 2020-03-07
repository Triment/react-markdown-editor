import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListOl } from '@fortawesome/free-solid-svg-icons'
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
        let countNumberLen = 0
        const str = res.map((v, i)=>{
            let t = i
            while(t>0){
                countNumberLen+=1
                t=Math.floor(t/10)
            }
            return `${i+1}. ${v}\n`
        })
        const res2 = str.join('')
        editNode.setRangeText(res2.slice(0,-1),start,end)
        editNode.focus()
        if(start<end){
            editNode.setSelectionRange(start+selectText.length+res.length*3-1+countNumberLen,start+selectText.length+res.length*3-1+countNumberLen)
        } else if (end>start){
            editNode.setSelectionRange(end+selectText.length+res.length*3-1+countNumberLen,start+selectText.length+res.length*3-1+countNumberLen)
        } else {
            //光标起点结尾在一起，未选中，生成bug的地方
            editNode.setSelectionRange(start+res2.length,start+res2.length)
        }
        
        props.feedback(editNode.value)
    }
    return (
        <li className={Style.Heading}>
            <FontAwesomeIcon icon={faListOl} onClick={capture}/>
        </li>
    )
}