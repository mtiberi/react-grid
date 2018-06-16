// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// License: MIT

const DataColumn = props => {

    const {
        colIndex,
        title = 'no title',
        values = [],
        width = 100,
        sortColumn,
        sortDescending,
        selectedRowIndex,

        selectColumn,
        selectRow,
    } = props;

    const clickColumn = columnIndex => event => {
        event.stopPropagation()
        selectColumn(columnIndex)
    }

    const clickRow = rowIndex => event => {
        event.stopPropagation()
        selectRow(rowIndex)
    }

    const styleWidth = {
        width: width + 'px',
    }

    const renderValue = value => {

        const { rowIndex, text } = value

        const maybeSelected = rowIndex === selectedRowIndex
            ? " selected"
            : ""

        return <div className={"react-grid cell" + maybeSelected}
            key={rowIndex}
            onClick={clickRow(rowIndex)}>
            {text}
        </div>
    }

    const sortSymbol = colIndex =>
        sortColumn === colIndex
            ? sortDescending ? ' \u2191' : ' \u2193'
            : null

    const renderHead = (text, colIndex) =>
        <div className="react-grid head"
            onClick={clickColumn(colIndex)}>
            {text} {sortSymbol(colIndex)}
        </div>

    return <div
        className="react-grid column"
        style={styleWidth}>
        {renderHead(title, colIndex)}
        {values.map(renderValue)}
    </div>
}

class DataGrid extends React.Component {

    render() {
        const {
            head = [],
            columns = {},
            transform = {},
            filter,
            setSelectedRowIndex,
        } = this.props;

        const {
            sortColumn = 0,
            sortDescending = false,
            selectedRowIndex = 1,
        } = this.state || {}

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

        const columnValues = head.map(column =>
            transform[column.id]
                ? columns[column.id].map(transform[column.id])
                : columns[column.id]
        )

        const getSortMap = () => {

            if (columnValues.length === 0)
                return []

            const values = columnValues[sortColumn]

            let result = values.map((x, i) => i)

            const compare = (a, b) => a > b ? 1 : a === b ? 0 : -1

            result.sort((a, b) =>
                compare(values[a], values[b]))

            if (sortDescending)
                result.reverse()

            return result
        }

        const sortMap = columns._filter && filter
            ? getSortMap().filter(rowIndex => columns._filter[rowIndex].includes(filter))
            : getSortMap()

        const map_head = (column, colIndex) => {
            const props = {
                colIndex,
                title: column.title,
                values: sortMap.map(rowIndex =>
                    ({
                        rowIndex,
                        text: columnValues[colIndex][rowIndex]
                    })),
                width: column.width,
                sortColumn,
                sortDescending,
                selectedRowIndex,

                selectColumn,
                selectRow,
            }
            return <DataColumn key={colIndex} {...props} />
        }

        const map_head_top = (column, colIndex) => {
            const props = {
                colIndex,
                title: column.title,
                values: [],
                width: column.width,
                sortColumn,
                sortDescending,

                selectColumn,
            }
            return <DataColumn key={colIndex} {...props} />
        }

        return <div style={{ position: 'relative' }}>
            <div className="react-grid top" style={{ position: 'absolute', zIndex: 1 }}>
                {head.map(map_head_top)}
            </div>
            <div className="react-grid grid">
                {head.map(map_head)}
            </div>
        </div>
    }
}
