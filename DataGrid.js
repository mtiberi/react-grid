// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT


class DataGrid extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columnResize: (props.head || []).map(x => 0),
            totalWidth: props.head.reduce((a, x) => a + x.width, 0)
        }
        this.cache = {}
        this.onDragOver = this.dragOver.bind(this);
        this.onDragEnd = this.dragEnd.bind(this);
    }

    componentWillMount() {
        document.addEventListener('dragover', this.onDragOver)
        document.addEventListener('dragend', this.onDragEnd)
    }

    componentWillUnMount() {
        document.removeEventListener('dragover', this.onDragOver)
        document.removeEventListener('dragend', this.onDragEnd)
    }


    dragOver(event) {
        if (this.dragObject) {
            event.preventDefault()
            this.dragObject.currentX = event.pageX
        }
    }

    dragEnd(event) {
        if (this.dragObject) {
            event.preventDefault()
            this.dragObject = null
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            sortColumn,
            sortDescending,
            selectedRowIndex,
        } = nextProps

        this.setState = {
            sortColumn,
            sortDescending,
            selectedRowIndex,
        }
    }


    render() {
        const {
            head = [],
            setSelectedRowIndex,
            rowHeight,
        } = this.props

        const {
            sortColumn = 0,
            sortDescending = false,
            selectedRowIndex = 1,
            columnResize = [],
            totalWidth,
        } = this.state

        const { sortMap, columnValues } = this.updateCache()

        const setSort = (sortColumn, sortDescending) =>
            this.setState({ sortColumn, sortDescending })

        const selectRow = (rowIndex) => {
            this.setState({ selectedRowIndex: rowIndex })
            if (setSelectedRowIndex)
                setSelectedRowIndex(rowIndex)
        }

        const selectColumn = colIndex => {
            if (colIndex === sortColumn)
                setSort(colIndex, !sortDescending)
            else
                setSort(colIndex, false)
        }


        const resizeColumn = (columnIndex, delta) => {

            const targetSize = head[columnIndex].width + columnResize[columnIndex] + delta
            if (targetSize < 32)
                delta = 32 - head[columnIndex].width

            let resize = columnResize.slice()
            resize[columnIndex] += delta

            const initialWidth = head.reduce((a, x) => a + x.width, 0)
            this.setState({
                columnResize: resize,
                totalWidth: resize.reduce((a, x) => a + x, initialWidth)
            })
            return delta;
        }

        const updateDrag = () => {
            if (this.dragObject) {
                const { columnIndex = -1, startX, currentX } = this.dragObject
                if (columnIndex >= 0) {
                    resizeColumn(columnIndex, currentX - startX)
                    setTimeout(updateDrag, 0.5)
                }
            }
        }

        const DataColumn = this.DataColumn

        const setDragObject = (event, dragObject) => {
            this.dragObject = dragObject
            event.dataTransfer
                .setData('react-grid', '')
            event.dataTransfer
                .setDragImage(this.invisible, 100000, 100000)
            setTimeout(updateDrag, 0.5)
        }

        const map_head = (column, colIndex) => {
            const props = {
                colIndex,
                title: column.title,
                values: sortMap.map(rowIndex =>
                    ({
                        rowIndex,
                        text: columnValues[colIndex][rowIndex]
                    })),
                width: column.width + columnResize[colIndex],
                rowHeight,
                sortColumn,
                sortDescending,
                selectedRowIndex,
                topVisibility: 'hidden',

                selectColumn,
                selectRow,
                setDragObject,
            }
            return <DataColumn key={colIndex} {...props} />
        }

        const map_head_top = (column, colIndex) => {
            const props = {
                colIndex,
                title: column.title,
                values: [],
                width: column.width + columnResize[colIndex],
                rowHeight,
                sortColumn,
                sortDescending,

                selectColumn,
                setDragObject,
            }
            return <DataColumn key={colIndex} {...props} />
        }

        const invisible =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

        return <div className="react-grid top-container">
            <div
                className="react-grid grid-container"
                style={{ width: totalWidth + 'px' }}>
                <div
                    className="react-grid top"
                    style={{ width: totalWidth + 'px' }}>
                    {head.map(map_head_top)}
                </div>
                <div className="react-grid data-container"
                    style={{ width: (totalWidth + 16) + 'px' }}>

                    <div
                        className="react-grid grid" >
                        {head.map(map_head)}
                    </div>
                </div>
                <img ref={x => this.invisible = x} src={invisible} />
            </div>
        </div>
    }

    DataColumn(props) {

        const {
            colIndex,
            title = 'no title',
            values = [],
            width = 100,
            rowHeight = 16,
            sortColumn,
            sortDescending,
            selectedRowIndex,
            topVisibility,

            selectColumn,
            selectRow,
            setDragObject,
        } = props;


        const clickColumn = columnIndex => event => {
            event.stopPropagation()
            selectColumn(columnIndex)
        }

        const clickRow = rowIndex => event => {
            event.stopPropagation()
            if (rowIndex != selectedRowIndex)
                selectRow(rowIndex)
        }

        const startDrag = columnIndex => event => {
            setDragObject(event, {
                columnIndex,
                startX: event.pageX,
                currentX: event.pageX,
            })
        }

        const styleWidth = {
            width: width + 'px',
        }

        const styleHeight = {
            height: rowHeight + 'px',
        }

        const renderValue = value => {

            const { rowIndex, text } = value

            const maybeSelected = rowIndex === selectedRowIndex
                ? " selected"
                : ""

            return <div
                className={"react-grid cell" + maybeSelected}
                style={styleHeight}
                key={rowIndex}
                onClick={clickRow(rowIndex)}
                title={text} >
                {text}
            </div>
        }

        const sortSymbol = colIndex =>
            sortColumn === colIndex
                ? sortDescending ? ' arrow-up' : ' arrow-down'
                : null

        const renderHead = (text, colIndex) =>
            <div className="react-grid head" style={{ visibility: topVisibility, height: styleHeight.height }} >
                <div
                    className="react-grid head-cell"
                    onClick={clickColumn(colIndex)} >
                    <div className={"react-grid " + sortSymbol(colIndex)}></div>
                    <div className="react-grid head-text">
                        {text}
                    </div>
                </div>
                <div
                    className="react-grid grip"
                    draggable="true"
                    onDragStart={startDrag(colIndex)} >
                </div>
            </div>

        return <div
            className="react-grid column"
            style={styleWidth} >
            {renderHead(title, colIndex)}
            {values.map(renderValue)}
        </div>
    }

    updateCache() {
        const {
            head = [],
            columns = {},
            transform = {},
            filter,
        } = this.props

        const {
            sortColumn = 0,
            sortDescending = false,
        } = this.state

        const dataChanged = !(
            head === this.cache.head &&
            columns === this.cache.columns &&
            filter === this.cache.filter &&
            transform === this.cache.transform &&
            sortColumn === this.cache.sortColumn &&
            sortDescending === this.cache.sortDescending
        )

        if (dataChanged) {

            const columnValues = head.map(column =>
                transform[column.id]
                    ? columns[column.id].map(transform[column.id])
                    : columns[column.id]
            )

            this.cache = {
                head,
                columns,
                sortColumn,
                sortDescending,
                filter,
                transform,
                columnValues,
                sortMap: []
            }

            if (columnValues.length !== 0) {

                const values = columnValues[sortColumn]

                let sortMap = values.map((x, i) => i)

                const compare = (a, b) => a > b ? 1 : a === b ? 0 : -1

                sortMap.sort((a, b) =>
                    compare(values[a], values[b]))

                if (sortDescending)
                    sortMap.reverse()

                if (columns._filter && filter)
                    sortMap = sortMap.filter(rowIndex =>
                        columns._filter[rowIndex].includes(filter))

                this.cache.sortMap = sortMap
            }

        }

        const { sortMap, columnValues } = this.cache

        return { sortMap, columnValues }

    }


}
