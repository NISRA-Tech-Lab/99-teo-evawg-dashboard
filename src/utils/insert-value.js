import { getNested } from "./get-nested.js";

export function insertValue (element_id, data, stat, year, selection, transform = (x) => x) {
    const value = getNested(data.data[stat][year], selection)
    document.getElementById(element_id).textContent = transform(value);
}