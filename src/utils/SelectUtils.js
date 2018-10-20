export function readSelectFromString(selected, arr) {
    let retSelected = []
    for (let select of selected.split('|')) {
        select = parseInt(select, 10);
        let selectedArr = arr.find((val) => {
            return select === val.id
        });
        if (selectedArr != null) {
            retSelected.push(selectedArr)
        }
    }
    return retSelected
}