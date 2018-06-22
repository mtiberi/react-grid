// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGridResizeable extends React.Component {
    constructor(props) {
        super(...arguments)
        this.state = { width: props.width, height: props.height }
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
                if (!this.resize)
                    setTimeout(() => this.clock(), 50)
                this.resize = { deltaWidth, deltaHeight }
            }
        }
    }

    clock() {
        console.log('clock', this.resize)
        if (this.resize) {
            const { deltaWidth, deltaHeight } = this.resize;
            this.resize = {};
            if (deltaWidth === undefined) {
                this.resize = null
                return
            }
            const width = this.state.width + deltaWidth
            const height = this.state.height + deltaHeight
            this.setState({ width, height })
            setTimeout(() => this.clock(), 10)
        }

    }


    render() {
        const { width = 100, height = 100 } = this.state
        console.log('render', width, height)
        const ref = element => { this.element = element; this.onResize() }

        return <div ref={ref} className='resizeable'>
            <DataGridWithScrollBar {...this.props} width={width} height={height} />
        </div>
    }

}