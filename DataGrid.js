// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGridResizeable extends React.Component {
    constructor(props) {
        super(...arguments)
        this.state = { width: props.width, height: props.height, selectedRowIndex: -1 }
        this.onResize = this.onResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize)
    }


    onResize() {
        if (this.element) {
            const parent = this.element.parentElement
            const child = this.element.firstChild
            const deltaWidth = parent.clientWidth - child.offsetWidth
            const deltaHeight = parent.clientHeight - child.offsetHeight
            if (deltaWidth != 0 || deltaHeight != 0) {
                if (this.resize === undefined)
                    setTimeout(() => this.updateSize(), 0)

                this.resize = { deltaWidth, deltaHeight }
            }
        }
    }

    updateSize() {
        if (this.resize == null) {
            this.resize = undefined
            return
        }

        if (this.resize) {

            const { deltaWidth, deltaHeight } = this.resize;
            this.resize = null;

            const width = this.state.width + deltaWidth
            const height = this.state.height + deltaHeight
            this.setState({ width, height })

            setTimeout(() => this.updateSize(), 10)
        }

    }


    render() {
        const setSelectedRowIndex = selectedRowIndex => this.setState({ selectedRowIndex })
        const { selectedRowIndex } = this.state

        const focus = event => console.log('focus!');
        const keyPress = event => console.log('keyPress!', this.state.height);

        const { width = 100, height = 100 } = this.state
        const ref = element => { this.element = element; this.onResize() }

        return <div ref={ref} className='resizeable' tabIndex="0" onFocus={focus} onKeyUp={keyPress}>
            <DataGridContainer {...this.props}
                width={width}
                height={height}
                setSelectedRowIndex={setSelectedRowIndex}
                selectedRowIndex={selectedRowIndex} />

        </div>
    }

}