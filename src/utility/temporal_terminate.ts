import fetch from "cross-fetch"
import { readFileSync } from "fs"

let headers:any = null;

try {
    let headersBuffer = readFileSync("./temporal-headers.json");
    if (headersBuffer) {
        headers = JSON.parse(headersBuffer.toString());
    }
} catch (error) {
    console.warn(error);
}


export const terminate = async (wfId: string, runId: string, reason: string) => {
    if(!headers || ! headers["x-csrf-token"]) {
        console.log("NOT A VALID HEADERS");
        return false;
    }

    let err:any = null;
    let r = await fetch(`http://localhost:8088/api/namespaces/default/workflows/${wfId}/${runId}/terminate`, {
        "headers": headers,
        "referrer": `http://localhost:8088/namespaces/default/workflows/${wfId}/${runId}/summary`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"reason\":\"${reason}\"}`,
        "method": "POST",
        "mode": "cors"
    }).catch(e=>err=e);

    return r.status === 200;
}
