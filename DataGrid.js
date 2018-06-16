// https://github.com/mtiberi/react-grid
// Copyright (c) 2018 mtiberi
// MIT License

class DataGrid extends React.Component {

    render() {
        const {
            header = [],
            columns = {},
            transform = {},
            filter,
        } = this.props;

        const {
            sortColumn = 0,
            sortDescending = false,
            selectedRowIndex = 1,
        } = this.state || {}

        const setSort = (sortColumn, sortDescending) =>
            this.setState({ sortColumn, sortDescending })

        const setSelectedRowIndex = (selectedRowIndex) =>
            this.setState({ selectedRowIndex })

        const filterFunc = columns._filter
            ? filter
                ? rowIndex => columns._filter[rowIndex].includes(filter)
                : () => true
            : () => true

        const columnValues = header.map(column =>
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

        const sortMap = getSortMap();

        const clickColumn = colIndex => event => {

            event.stopPropagation()
            if (colIndex === sortColumn)
                setSort(colIndex, !sortDescending)
            else
                setSort(colIndex, false)

        }

        const clickRow = rowIndex => event => {
            event.stopPropagation()
            if (rowIndex !== selectedRowIndex)
                setSelectedRowIndex(rowIndex)
        }

        const map_cells = rowIndex => (column, colIndex) => {
            const maybeWidth = column.width ? { width: column.width + 'px' } : null

            return <td key={colIndex} className="react-grid body-cell" style={maybeWidth}>
                {columnValues[colIndex][rowIndex]}
            </td>
        }

        const map_rows = rowIndex => {
            const maybeSelected = (rowIndex === selectedRowIndex) ? "selected" : ""
            return <tr key={rowIndex} className={"react-grid body-row " + maybeSelected} onClick={clickRow(rowIndex)}>
                {header.map(map_cells(rowIndex))}
            </tr>
        }

        const sortSymbol = colIndex =>
            sortColumn !== colIndex
                ? null
                : sortDescending ? ' \u2191' : ' \u2193'

        const map_header = (column, colIndex) => {

            const maybeWidth = column.width ? { width: column.width + 'px' } : null

            return <th key={colIndex} className="react-grid head-cell" style={maybeWidth} onClick={clickColumn(colIndex)}>
                {column.title}
                {sortSymbol(colIndex)}
            </th>
        }

        return <div className="react-grid">
            <table>
                <thead className="react-grid head">
                    <tr>{header.map(map_header)}</tr>
                </thead>
                <tbody className="react-grid body">
                    {sortMap.filter(filterFunc).map(map_rows)}
                </tbody>
            </table>
        </div>
    }
}
