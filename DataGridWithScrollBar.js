// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGridWithScrollBar extends React.Component {

    render() {
        let scrollElement
        let dataHeight
        let scrollHandler = {
            setScroll: value => console.log('unhandled scroll', value)
        }

        const scroll = e => scrollHandler.setScroll(e.target.scrollTop)

        const setDataHeight = value => {
            dataHeight = value
            if (scrollElement) {
                scrollElement.style.height = value + 'px'
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
        const { width, height } = this.props
        
        let props = {
            ...this.props,
            width: pix(width - 17),
            height: pix(height - 2),
        }

        return <div className="react-grid outer-container" style={{ width: pix(width), height: pix(height) }} >
            <DataGrid setDataHeight={setDataHeight} scrollHandler={scrollHandler} {...props} />
            <div className="react-grid scrollbar" style={{ height: props.height }} >
                <div ref={refScrollElement} style={{ width: '1px', height: '1px' }} >
                </div>
            </div>
        </div>
    }
}
