import React, {useEffect,useState} from 'react';
import Style from './index.module.css'
import panel from './panel'
import markRender from './compiler'
//import 'katex/dist/katex.css'
//哈希表接口
interface Map {
    [key:string]: React.FC<React.ComponentProps<'li'>&{editNodeId:string,feedback: (arg0: string)=>void}>;
}

/**
 * @description 转换px到整数
 * @author splub
 * @date 2020-02-26
 * @param {string} s
 * @returns
 */
function atoi(s: string){
    return Number(s.slice(0,-2))
}

const Item = (props : React.PropsWithChildren<{}>)=>{
    return <li className={Style.item}>{
        props.children
    }
    </li>
}

const Editor = ()=>{
    const editNodeId = Style.mk_editor
    const [source, setSource] = useState('')
    useEffect(() => {
        const textarea: HTMLTextAreaElement = document.getElementById(Style.mk_editor) as HTMLTextAreaElement
        const viewarea: HTMLDivElement = document.getElementById(Style.mk_overview) as HTMLDivElement
        const  style = window.getComputedStyle(textarea.parentElement?.parentElement as HTMLDivElement,null)
        textarea.rows = (atoi(style.height)-50)/(16)
        //固定值20px
        viewarea.style.height = `${textarea.rows*16-20}px`
        setSource(textarea.value)
    },[source])

    /**
     * @description
     * offsetHeight              scrollHeight
     * * * * * * * * * * * * * * *
     *           *               *
     *           *               *
     *           *               *
     * * * * * * * * * * * * * * * 
     * <- scrollTop
     * @author splub
     * @date 2020-02-27
     * @param {React.UIEvent<HTMLTextAreaElement>} ele
     */
    function editHandleScroll(ele:React.UIEvent<HTMLTextAreaElement>){
        const percentage = ele.currentTarget.scrollTop/(ele.currentTarget.scrollHeight-ele.currentTarget.offsetHeight)
        const preview = document.getElementById('mk-overview') as HTMLDivElement
        const resHeight = (preview.scrollHeight-preview.offsetHeight)*percentage

        // let start:number

        // function step(timestamp:number){
        //     if(resHeight>preview.scrollTop){
        //         preview.scrollTop += 1
        //     } else if(resHeight<preview.scrollTop) {
        //         preview.scrollTop -= 1
        //     }
        //     if(preview.scrollTop!=resHeight){
        //         window.requestAnimationFrame(step)
        //     }
        // }

        // window.requestAnimationFrame(step)
        // let lock = false
        // const resHeight = (preview.scrollHeight-preview.offsetHeight)*percentage
        // if(!false){
        window.requestAnimationFrame(()=>{
            preview.scrollTop = resHeight
        })
        
        //     lock = true
        // }
        //ele.currentTarget.scrollTop = (ele.currentTarget.scrollHeight-ele.currentTarget.offsetHeight)*percentage
    }

    /**
     * @description 冒泡事件未解决
     * @author splub
     * @date 2020-02-27
     * @param {React.UIEvent<HTMLDivElement>} ele
     */
    // function viewHandleScroll(ele: React.UIEvent<HTMLDivElement>){
    //     const percentage = ele.currentTarget.scrollTop/(ele.currentTarget.scrollHeight-ele.currentTarget.offsetHeight)
    //     const edit = document.getElementById('mk-editor') as HTMLTextAreaElement
    //     //edit.scrollTop
    //     const resHeight = (edit.scrollHeight-edit.offsetHeight)*percentage
    //     // window.requestAnimationFrame(()=>{
    //     //     edit.scrollTop = resHeight
    //     // })
    // }

    /**
     * @description 操作textarea的变化，以便更新state文本和view
     * @author splub
     * @date 2020-02-26
     * @param {React.SyntheticEvent<HTMLTextAreaElement, Event>} e
     */
    function handleRange(e: React.SyntheticEvent<HTMLTextAreaElement, Event>){
        e.persist()
        //const selection = window.getSelection()
        //const absoluteRange = selection?.getRangeAt(0) as Range
        //const t = document.getElementById('mk-editor') as HTMLTextAreaElement
        // selection?.removeAllRanges()
        // //e.currentTarget.setSelectionRange(0,9,'none')
        // this.setState({count: this.state.count+1})
        // console.log(this.state.count)
        const targetNode = e.currentTarget.parentElement?.children[1]  as HTMLDivElement
        targetNode.innerHTML = markRender(e.currentTarget.value)
    }

    /**
     * @description 刷新视图层
     * @author splub
     * @date 2020-02-26
     * @param {string} str
     */
    function updateView(str:string) {
        setSource(str)
    }
    
    /**
     * @description 渲染函数
     * @author splub
     * @date 2020-02-26
     * @param {React.FormEvent<HTMLTextAreaElement>} ele
     */
    function renderToView(ele: React.FormEvent<HTMLTextAreaElement>){
        // const viewNode = document.getElementById('mk-overview') as HTMLDivElement
        // viewNode.innerHTML = ele.currentTarget.value
    }
    const HeadComponents = panel as Map
    const comps = Object.keys(HeadComponents)
    return (
        <div className={Style.mk_edit}>
            <header className={Style.mk_edit_header}>
            {
                comps.map(ele=>{
                    const Element = HeadComponents[ele] as (props: React.ComponentProps<'li'>&{editNodeId:string,feedback: (arg0: string)=>void})=>JSX.Element
                    return <Item key={ele.valueOf()}>
                        <Element editNodeId={editNodeId} feedback={updateView} />
                    </Item>
                })
            }
            </header>
            <hr/>
            <div className={Style.mk_edit_ed_area}>
                <textarea name="mk-edit-ed-area-left" id={Style.mk_editor} wrap='soft' onSelectCapture={handleRange} autoFocus={true} cols={30} onScrollCapture={editHandleScroll}  onChangeCapture={renderToView}></textarea>
                <div className={Style.mk_overview} id={Style.mk_overview} dangerouslySetInnerHTML={{ __html: markRender(source) }}></div>
            </div>
        </div>
    )
}

export default Editor