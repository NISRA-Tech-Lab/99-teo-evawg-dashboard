import { getNested } from "./get-nested.js";

export function insertValue (element_id, data, stat, year, selection) {
    document.getElementById(element_id).textContent = getNested(data.data[stat][year], selection)
}