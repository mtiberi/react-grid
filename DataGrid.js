// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT




class DataGrid extends React.Component {
    constructor(props) {
        super(...arguments)
        this.state = {
            width: props.width,
            height: props.height,
            selectedRowIndex: -1,
            focused: false,
        }
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
        const {
            width = 100,
            height = 100,
            selectedRowIndex = -1,
            focused = false
        } = this.state

        const setSelectedRowIndex = selectedRowIndex => this.setState({ selectedRowIndex })

        const focus = event => this.setState({ focused: true });
        const blur = event => this.setState({ focused: false });
        const keyDown = event => console.log('keyDown!', this.state.height);

        const ref = element => { this.element = element; this.onResize() }

        return <div ref={ref}
            className="react-grid resizeable"
            tabIndex="0"
            onFocus={focus}
            onBlur={blur}
            onKeyDown={keyDown}>
            <DataGridContainer {...this.props}
                width={width}
                height={height}
                focused={focused}
                setSelectedRowIndex={setSelectedRowIndex}
                selectedRowIndex={selectedRowIndex} />

        </div>
    }

}