import { setOptions, Renderer } from 'marked'
import katex from 'katex'


function insert(str: string, sub: string) {
    let res = ''
    for (let i = str.length - 4; i > 0; i--) {
        if (str[i] === '<' && str[i + 1] === '/') {
            res = str.slice(0, i) + sub + str.slice(i)
            break
        }
    }
    return res
}
function insertFront(str: string, sub: string) {
    let res = ''
    for (let i = 0; i < str.length; i++) {

        if (str[i] === '>' && str[0] === '<') {
            res = str.slice(0, i + 1) + sub + str.slice(i + 1)
            break
        }
    }
    return res
}

type tokenType = 'inline-katex-a' | 'inline-katex-b' | 'block-katex' | 'markdown'

export default function render(str: string) {
    const mark = setOptions({
        sanitize: true,
        renderer: new Renderer()
    })
    let result: { identifier: tokenType, content: string, used: boolean }[] = []
    let start = 0
    let len = str.length
    let state = 0
    for (let i = 0; i < len; i++) {
        if (str[i] === '$') {
            if (state === 0) {
                state = 1
                //result.push(this.mark("OP"))
                result.push({
                    identifier: 'markdown',
                    content: str.slice(start, i),
                    used: false
                })
                start = i
                continue
            } else
                if (state === 1) {
                    state = 2
                    continue
                } else
                    if (state === 10) {
                        //单行接受状态
                        state = 0
                        //result.push(katex.renderToString(str.slice(start,i+1).slice(2,-2)))                    })
                        result.push({
                            identifier: 'inline-katex-a',
                            content: str.slice(start, i + 1),
                            used: false
                        })
                        start = i + 1
                        continue
                    } else
                        if (state === 7) {
                            state = 8
                            continue
                        } else
                            if (state === 8) {
                                //单行接受状态
                                state = 0
                                result.push({
                                    identifier: 'inline-katex-b',
                                    content: str.slice(start, i+1),
                                    used: false
                                })
                                start = i+1
                                continue
                            } else
                                if (state === 4) {
                                    state = 5
                                    continue
                                } else
                                    if (state === 5) {
                                        //接受状态
                                        state = 0
                                        result.push({
                                            identifier: 'block-katex',
                                            content: str.slice(start, i + 1),
                                            used: false
                                        })
                                        start = i + 2
                                        continue
                                    }
        } else
            if (str[i] === '\n') {
                if (state === 1) {
                    state = 0
                    continue
                } else
                    if (state === 2) {
                        state = 3
                        continue
                    } else
                        if (state === 10) {
                            state = 1
                            continue
                        } else
                            if (state === 3) {
                                state = 4
                                continue
                            }

            } else {
                if (state === 1) {
                    state = 10
                    continue
                } else
                    if (state === 2) {
                        state = 7
                        continue
                    } else
                        if (state === 8) {
                            state = 7
                            continue
                        } else
                            if (state === 5) {
                                state = 4
                                continue
                            }
            }
        //result.push(mark(str.slice(start, i)))
    }
    result.push({
        identifier: 'markdown',
        content: str.slice(start),
        used: false
    })
    // console.log("token:")
    // result.forEach((v) => {
    //     console.log(`[${v.identifier}\t${v.content}\t${/[a-zA-Z0-9_\u4e00-\u9fa5.]+\n/.test(v.content)}\t${v.content.length}]`)
    // })
    let respond = ''
    //console.log(result[1])
    for (let i = 0; i < result.length; i++) {
        //console.log(i, result[i].identifier)
        if (result[i].identifier === 'markdown') {
            if (/^\n.*?/.test(result[i].content)) {
                respond += mark(result[i].content)
            } else {
                if (i !== 0 && (result[i - 1].identifier === 'inline-katex-a' || result[i - 1].identifier === 'inline-katex-b')) {
                    if (result[i - 1].used) {
                        //插在前面

                        result[i].content.split('\n').forEach((v, i) => {
                            i === 0 ? respond = insert(respond, mark(v + ' ').replace(/<[^>]+>/g, "")) : respond = insert(respond, mark(v))
                        })
                    } else {
                        //渲染当前，把前一个插在当前的前面
                        //a,b判断
                        respond += insertFront(mark(result[i].content + ' '), katex.renderToString(result[i - 1].identifier === 'inline-katex-a' ? result[i - 1].content.slice(1, -1) : result[i - 1].content.slice(2, -2), {
                            throwOnError: false
                        }))
                    }
                } else if (i !== 0 && (result[i - 1].identifier === 'inline-katex-a' || result[i - 1].identifier === 'inline-katex-b') && !result[i - 1].used) {
                    //前面是katex又没用，插在自己之前
                    respond += insertFront(mark(result[i].content + ' '), katex.renderToString(result[i - 1].identifier === 'inline-katex-a' ? result[i - 1].content.slice(1, -1) : result[i - 1].content.slice(2, -2), {
                        throwOnError: false
                    }))
                } else {
                    respond += mark(result[i].content + ' ')
                }
            }
            result[i].used = true
        }
        if (result[i].identifier === 'inline-katex-a') {
            if (i <= 1) {
                //不管
                if (i === 1) {
                    if (result[i - 1].identifier === "markdown" && result[i - 1].content.length > 0) {
                        //插入1
                        respond = insert(respond, katex.renderToString(result[i].content.slice(1, -1), {
                            throwOnError: false
                        }))
                    } else {
                        //新建p
                        respond = `<p>${katex.renderToString(result[i].content.slice(1, -1), {
                            throwOnError: false
                        })}</p>`
                    }
                }
                result[i].used = true
                continue
            } else {
                if (result[i - 1].identifier === 'markdown') {
                    //看是否换行
                    if (/.*?\n$/.test(result[i - 1].content)) {
                        //不管
                        continue
                    } else {
                        respond = insert(respond, katex.renderToString(result[i].content.slice(1, -1), {
                            throwOnError: false
                        }))
                    }
                } else if (result[i - 1].identifier === 'block-katex') {
                    //不管
                    continue
                }
            }
            result[i].used = true
        }
        if (result[i].identifier === 'inline-katex-b') {
            //console.log(result[i].content.slice(2, -2))
            if (i <= 1) {
                //不管
                if (i === 1) {
                    if (result[i - 1].identifier === "markdown" && result[i - 1].content.length > 0) {
                        //插入1
                        respond = insert(respond, katex.renderToString(result[i].content.slice(2, -2), {
                            throwOnError: false
                        }))
                    } else {
                        //新建p
                        respond = `<p>${katex.renderToString(result[i].content.slice(2, -2), {
                            throwOnError: false
                        })}</p>`
                    }
                }
                result[i].used = true
                continue
            } else {
                if (result[i - 1].identifier === 'markdown') {
                    //看是否换行
                    if (/.*?\n$/.test(result[i - 1].content)) {
                        //不管
                        continue
                    } else {
                        respond = insert(respond, katex.renderToString(result[i].content.slice(2, -2), {
                            throwOnError: false
                        }))
                    }
                } else if (result[i - 1].identifier === 'block-katex') {
                    //不管
                    continue
                }
            }
            result[i].used = true
        }
        if (result[i].identifier === 'block-katex') {
            respond += katex.renderToString(result[i].content.slice(3, -2), {
                throwOnError: false,
                displayMode: true
            })
            result[i].used = true
        }
    }
    return respond
}