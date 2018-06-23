// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGridContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowIndex: props.selectedRowIndex
        }
    }

    updateScroll() {
        if (this.scrollPos === null) {
            this.scrollPos = undefined
            return;
        }

        if (this.scrollPos !== this.state.scrollPos)
            this.setState({ scrollPos: this.scrollPos })
        this.scrollPos = null
        setTimeout(() => this.updateScroll(), 20)
    }

    render() {
        const { width, height, setSelection } = this.props
        const { scrollPos = 0, dataHeight = 0 } = this.state

        let scrollElement

        const scroll = e => {
            e.preventDefault();
            e.stopPropagation();

            if (this.scrollPos === undefined)
                setTimeout(() => this.updateScroll(), 0)

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
                let scrollpos = this.scrollbar.scrollTop + deltaY
                this.scrollbar.scrollTop = scrollpos
            }
        }

        const pix = x => x + 'px'

        const scrollbarVisible = dataHeight >= height
        const sbWidth = scrollbarVisible ? 16 : 0

        const checkVisible = displayIndex => {
            console.log('checkVisible', displayIndex)
        }

        const previewSelection = selection => {
            if (selection.displayIndex >= 0)
                checkVisible(selection.displayIndex)
            setSelection(selection)
        }

        return <div className="react-grid outer-container" onWheel={wheel} style={{ width: pix(width), height: pix(height) }} >
            <div className="react-grid horizontalscroll" style={{
                width: pix(width - sbWidth),
                maxHeight: pix(height)
            }} >
                <DataGridColumns  {...this.props}
                    scrollPos={scrollPos}
                    setDataHeight={setDataHeight}
                    setSelection={previewSelection} />
            </div>
            <div className="react-grid scrollbar"
                style={{ display: scrollbarVisible ? 'block' : 'none', width: pix(sbWidth) }}
                ref={x => this.scrollbar = x}>
                <div ref={refScrollElement} style={{ width: '1px', height: '1px' }} >
                </div>
            </div>
        </div>
    }

}