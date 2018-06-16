# react-grid
component to display data in a grid


# sample

const griddata = {
    sortColumn: 0,
    sortDescending: false,
    selectedRowIndex: -1,
    head: [
        { id: 'a', title: 'ABCABCABCABCABCABC', width: 100 },
        { id: 'b', title: 'BCABCABCABCABCABCA', width: 100 },
        { id: 'c', title: 'CABCABCABCABCABCAB', width: 100 },
    ],
    columns: {
        a: ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c'],
        b: ['b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'],
        c: ['c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b'],
    },
}

 return <DataGrid {...griddata} />
 