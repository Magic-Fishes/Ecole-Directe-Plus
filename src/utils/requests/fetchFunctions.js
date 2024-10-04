import { useContext } from "react";
import { EdpFetchContext } from "../../App";
import sortGrades from "../sortData/sortGrades";

export async function fetchGrades(schoolYear, controller = (new AbortController())) {
    const { account, edpFetch, token, setToken } = useContext(EdpFetchContext);

    if (account.firstName === "Guest") {
        return import("../../data/guest/grades.json").then((module) => sortGrades(module.data))
    }
    const fetchAccount = structuredClone(account);
    const headers = new Headers();
    const body = new URLSearchParams();

    headers.append("x-token", token);
    body.append("anneeScolaire", schoolYear);
    return edpFetch(
        `https://api.ecoledirecte.com/v3/eleves/${fetchAccount.id}/notes.awp?verbe=get`,
        {
            method: "POST",
            signal: controller.signal,
            headers,
            body,
            referrerPolicy: "no-referrer",
        },
        "json"
    )
        .then((response) => {
            let code = response.code;
            if (code === 200) {
                return sortGrades(response.data);
            } else if (code === 520 || code === 525) {
                // token invalide
                requireLogin();
            }
            setToken((old) => (response?.token || old));
        })
        .catch((error) => {
            return error;
        })
}