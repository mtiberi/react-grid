// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGridWithScrollBar extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {}
    }

    componentDidMount() {
        setTimeout(() => this.tickCount(), 0)
    }

    componentWillUnmount() {
        this.stopTimer = true;
    }


    tickCount() {
        if (this.stopTimer)
            return;
        if (this.scrollPos !== this.state.scrollPos)
            this.setState({ scrollPos: this.scrollPos })

        setTimeout(() => this.tickCount(), 40)
    }

    render() {
        const { width, height } = this.props
        const { scrollPos = 0, dataHeight = 0 } = this.state || {}

        let scrollElement

        const scroll = e => {
            e.preventDefault();
            e.stopPropagation();
            this.scrollPos = e.target.scrollTop
        }

        const setDataHeight = value => {
            if (dataHeight !== value)
                this.setState({ dataHeight: value })
            if (scrollElement) {
                scrollElement.style.height = (value) + 'px'
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

        const wheel = event => {
            event.stopPropagation();
            if (this.scrollbar) {
                const deltaY = event.nativeEvent.deltaY
                let scrollpos = (this.scrollPos || 0) + deltaY
                if (scrollpos < 0)
                    scrollpos = 0
                this.scrollbar.scrollTop = scrollpos
            }
        }

        const pix = x => x + 'px'

        const scrollbarVisible = dataHeight >= height

        const dg_prop = {
            ...this.props,
            width: pix(width - 2),
            height: pix(height - 2),
        }

        return <div className="react-grid outer-container" onWheel={wheel} style={{ width: pix(width), height: pix(height) }} >
            <DataGrid scrollPos={scrollPos} setDataHeight={setDataHeight}  {...dg_prop} />
            <div className="react-grid scrollbar"
                style={{ display: scrollbarVisible ? 'block' : 'none' }}
                ref={x => this.scrollbar = x}>
                <div ref={refScrollElement} style={{ width: '1px', height: '1px' }} >
                </div>
            </div>
        </div>
    }

}