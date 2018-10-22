export function readSelectFromString(selected, arr) {
    let retSelected = [];
    for (let select of selected.split('|')) {
        select = parseInt(select, 10);
        let selectedArr = arr.reduce((array, val) => {
            if (select === val.id) {
                array.push(val)
            }
            return array
        }, []);
        if (selectedArr.length > 0) {
            retSelected = retSelected.concat(selectedArr)
        }
    }
    return retSelected
}