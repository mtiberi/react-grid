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
        const { width, height, setSelection, rowHeight } = this.props
        const { scrollPos = 0, dataHeight = 0 } = this.state

        let scrollElement

        const setScrollPos = value => {
            if (this.scrollbar) {
                this.scrollbar.scrollTop = value
            }
        }

        const getScrollWindow = () => {
            if (this.scrollbar) {
                const scrollTop = this.scrollbar.scrollTop
                const scrollBottom = scrollTop + this.scrollbar.clientHeight
                return { scrollTop, scrollBottom }
            }
            return { scrollTop: 0, scrollBotton: dataHeight }
        }

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
            setScrollPos(this.scrollbar.scrollTop + event.nativeEvent.deltaY)
        }

        const pix = x => x + 'px'

        const scrollbarVisible = dataHeight >= height
        const sbWidth = scrollbarVisible ? 16 : 0

        const previewSelection = selection => {
            const displayIndex = selection.displayIndex
            if (displayIndex >= 0) {
                // ensure selection is visible
                const delta = rowHeight - 1
                const top = rowHeight * displayIndex - delta
                const bottom = top + rowHeight + delta
                const { scrollTop, scrollBottom } = getScrollWindow()
                if (top < scrollTop)
                    setScrollPos(top)
                else if (bottom > scrollBottom)
                    setScrollPos(scrollTop + bottom - scrollBottom)
            }
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