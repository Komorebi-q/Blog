(function (window, document) {
    const docEl = document.documentElement
    const dpr = window.devicePixelRadio || 1
    
    function setBodyFontSize() {
        if (document.body) {
            document.body.style.fontSize = (12 * dpr) + 'px'
        } else {
            // 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }

    setBodyFontSize()

    function setRemUnit() {
        const rem = docEl.clientWidth / 10
        docEl.style.fontSize = rem + 'px'
    }

    setRemUnit()

    window.addEventListener('resize', setRemUnit)
    // 当一条会话历史记录被执行的时候将会触发页面显示(pageshow)事件。(这包括了后退/前进按钮操作，同时也会在onload 事件触发后初始化页面时触发)
    window.addEventListener('pageShow', function (e) {
        if (e.persisted) {
            // 只读属性persisted代表一个页面是否从缓存中加载的
            setRemUnit()
        }
    })

    if (dpr > 2) {
        const fakeBody = document.createElement('body')
        const testElement = document.createElement('div')

        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }

        docEl.removeChild(fakeBody)
    }
})(window, document)