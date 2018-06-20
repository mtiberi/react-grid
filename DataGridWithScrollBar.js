// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




const DataGridWithScrollBar = props => {

    const { width, height, rowHeight } = props

    let scrollElement
    let dataHeight
    let scrollHandler = {
        setScroll: value => console.log('unhandled scroll', value),
        notifyScroll: value => {
            console.log('notify scroll', value)
            if (scrollElement)
                scrollElement.parentElement.scrollTop = value
        }

    }

    const scroll = e => scrollHandler.setScroll(e.target.scrollTop)

    const setDataHeight = value => {
        dataHeight = value
        if (scrollElement) {
            scrollElement.style.height = (value+2*rowHeight) + 'px'
            const parent = scrollElement.parentElement
            parent.removeEventListener('scroll', scroll)
            parent.addEventListener('scroll', scroll)
        }
    }

    const refScrollElement = e => {
        scrollElement = e;
        if (dataHeight)
            setDataHeight(dataHeight)
    }

    const pix = x => x + 'px'

    const scrollbarVisible = true;//dataHeight < height - 16

    const dg_prop = {
        ...props,
        width: pix(width - (scrollbarVisible ? 17 : 2)),
        height: pix(height - 2),
    }

    return <div className="react-grid outer-container" style={{ width: pix(width), height: pix(height) }} >
        <DataGrid setDataHeight={setDataHeight} scrollHandler={scrollHandler} {...dg_prop} />
        <div className="react-grid scrollbar" style={{ height: props.dg_prop, width: '16px' }} >
            <div ref={refScrollElement} style={{ width: '1px', height: '1px' }} >
            </div>
        </div>
    </div>
}

