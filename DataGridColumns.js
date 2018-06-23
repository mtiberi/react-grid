// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT


class DataGridColumns extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columnResize: (props.head || []).map(x => 0),
            sortColumn: 0,
            sortDescending: false,
        }
        this.cache = {}
        this.onDragOver = this.dragOver.bind(this);
        this.onDragEnd = this.dragEnd.bind(this);

        // create invisible image for dragging
        const invisibleLink = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        this.invisibleImage = document.createElement("img")
        this.invisibleImage.src = invisibleLink;
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


    render() {
        const {
            head = [],
            setSelection,
            rowHeight,
            scrollPos,
            tabIndex,
            selectedRowIndex = 0,
            focused = false,
        } = this.props

        const {
            sortColumn,
            sortDescending,
            columnResize,
        } = this.state

        const { sortMap, columnValues, dataHeight } = this.updateCache()

        const setSort = (sortColumn, sortDescending) =>
            this.setState({ sortColumn, sortDescending })

        const selectRow = (current) => {
            if (setSelection) {
                const displayIndex = sortMap.indexOf(current)
                const prev = displayIndex > 0 ? sortMap[displayIndex - 1] : undefined
                const next = displayIndex >= 0 ? sortMap[displayIndex + 1] : undefined
                setSelection({ current, displayIndex, prev, next })
            }
        }

        if (selectedRowIndex !== this.selectedRowIndex) {
            this.selectedRowIndex = selectedRowIndex
            selectRow(selectedRowIndex)
        }

        const selectColumn = colIndex => {
            if (colIndex === sortColumn)
                setSort(colIndex, !sortDescending)
            else
                setSort(colIndex, false)
        }

        const resizeColumn = (columnIndex, value) => {

            if (columnResize[columnIndex] === value)
                return

            if (head[columnIndex].width + value < 32)
                return

            let resize = columnResize.slice()
            resize[columnIndex] = value

            this.setState({
                columnResize: resize,
            })
        }

        const updateDrag = () => {
            if (this.dragObject) {
                const { columnIndex, startX, currentX, initialWidth } = this.dragObject
                if (columnIndex >= 0) {
                    resizeColumn(columnIndex, initialWidth + currentX - startX)
                    setTimeout(updateDrag, 40)
                }
            }
        }

        const startDrag = (columnIndex, startX) => {
            this.dragObject = {
                columnIndex,
                initialWidth: columnResize[columnIndex],
                startX,
                currentX: startX,
            }
            setTimeout(updateDrag, 0)
        }

        const DataColumn = this.DataColumn

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
                height: dataHeight,
                rowHeight,
                sortColumn,
                sortDescending,
                focused,
                selectedRowIndex,
                headRowVisibility: 'hidden',

                selectColumn,
                selectRow,
                startDrag,
            }
            return <DataColumn key={colIndex} {...props} />
        }

        const map_head_top = (column, colIndex) => {
            let props = {
                colIndex,
                title: column.title,
                values: [],
                width: column.width + columnResize[colIndex],
                rowHeight,
                sortColumn,
                sortDescending,
                focused,

                selectColumn,
                startDrag,
            }
            // make the grip be centered on the column end
            if (colIndex === 0)
                props.width += 3;

            return <DataColumn key={colIndex} invisibleImage={this.invisibleImage} {...props} />
        }


        const totalWidth = head.map((c, i) => c.width + columnResize[i]).reduce((a, b) => a + b, 2)

        return <div className="react-grid grid-container" tabIndex={tabIndex}>
            <div
                className="react-grid head-row"
                style={{ maxHeight: rowHeight + 'px' }}>
                {head.map(map_head_top)}
            </div>
            <div className="react-grid data-container" style={{ minWidth: totalWidth }}>
                <div
                    style={{ marginTop: (-scrollPos) + 'px' }}
                    className="react-grid grid" >
                    {head.map(map_head)}
                </div>
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
            headRowVisibility,
            invisibleImage,
            focused,

            selectColumn,
            selectRow,
            startDrag,
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

        const beginDrag = columnIndex => event => {
            event.dataTransfer
                .setData('react-grid', '')
            event.dataTransfer
                .setDragImage(invisibleImage, 100000, 100000)


            startDrag(columnIndex, event.pageX)
        }

        const pix = x => x + 'px'
        const maybeFocused = focused ? " focused" : ""

        const renderValue = value => {

            const { rowIndex, text } = value

            const maybeSelected = rowIndex === selectedRowIndex
                ? " selected"
                : ""

            return <div
                className={"react-grid cell" + maybeSelected + maybeFocused}
                style={{ height: pix(rowHeight) }}
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
            <div className={"react-grid head" + maybeFocused}
                style={{ visibility: headRowVisibility, height: pix(rowHeight) }} >
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
                    onDragStart={beginDrag(colIndex, invisibleImage)} >
                </div>
            </div>

        return <div
            className="react-grid column"
            style={{ width: pix(width), lineHeight: pix(rowHeight - 2) }} >
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
            setDataHeight
        } = this.props

        const {
            sortColumn = 0,
            sortDescending = false,
        } = this.state

        const dataChanged = !(
            sortColumn === this.cache.sortColumn &&
            sortDescending === this.cache.sortDescending &&
            head === this.cache.head &&
            columns === this.cache.columns &&
            filter === this.cache.filter &&
            transform === this.cache.transform
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
                this.cache.dataHeight = this.props.rowHeight * sortMap.length
                if (setDataHeight)
                    setDataHeight(this.cache.dataHeight)
            }

        }

        return this.cache

    }


}
