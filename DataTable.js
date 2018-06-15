// Copyright (c) 2018 mtiberi
// MIT License
//

function DataTable(props) {

    const {
        tableid = '',
        header = [],
        filter,
        columns = {},
        transform,
        sortColumn = 0,
        sortDescending = false,
        selectedRowIndex = -1,

        setSort,
        setSelectedRow,
    } = props;

    const rowFilter = columns['_filter']

    const filterFunc = rowFilter
        ? rowIndex => rowFilter[rowIndex].includes(filter)
        : () => true

    const identity = x => x
    const columnValues = header.map(column =>
        columns[column.id]
            .map(transform[column.id] || identity))

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

    const sortMap = getSortMap();

    const clickColumn = colIndex => event => {

        event.stopPropagation()
        if (colIndex === sortColumn)
            setSort(tableid, colIndex, !sortDescending)
        else
            setSort(tableid, colIndex, false)

    }

    const clickRow = rowIndex => event => {
        event.stopPropagation()
        if (rowIndex !== selectedRowIndex)
            setSelectedRow(tableid, rowIndex)
    }

    const map_cells = rowIndex => (column, colIndex) =>
        <td key={colIndex}>
            {columnValues[colIndex][rowIndex]}
        </td>

    const map_rows = rowIndex => {
        const className = (rowIndex === selectedRowIndex) ? "selected" : ""
        return <tr key={rowIndex} className={className} onClick={clickRow(rowIndex)}>
            {header.map(map_cells(rowIndex))}
        </tr>
    }

    const sortSymbol = colIndex =>
        sortColumn !== colIndex
            ? null
            : sortDescending ? ' \u2191' : ' \u2193'

    const map_header = (column, colIndex) => {

        const width = column.width
        const style = width ? { width: width + 'px' } : null

        return <th key={colIndex} style={style} onClick={clickColumn(colIndex)}>
            {column.title}
            {sortSymbol(colIndex)}
        </th>
    }

    const style = {
        flexGrow: 1,
        backgroundColor: 'white',
        border: '1px solid rgba(0, 0, 0, .4)',
    }

    return <div className="nice" style={style}>
        <table>
            <thead>
                <tr>{header.map(map_header)}</tr>
            </thead>
            <tbody>
                {sortMap.filter(filterFunc).map(map_rows)}
            </tbody>
        </table>
    </div>
}
