import _log                         from "../_log";
import DEF, {getAPIPath}            from "../_global";

import {
    GEN_SUCCESS, GEN_FAIL, 
    ERROR_CODES 
}                                   from "./interfaces";

import type {Request, Response}     from "express";


import YAML                         from 'yaml'
import axios                        from "axios";


const WORKFLOW_ENGINE_API_ROOT = process.env.WORKFLOW_ENGINE_API_ROOT || "http://localhost:3001/api/v1";


const createWorkflow = (req: Request, res: Response) => {

}

const getWorkflow = (req: Request, res: Response) => {

}

const convertFormat = (json: any) => {
    let vjson:any = {
        name: "default",
        steps: [],
    }

    if(json.name) vjson.name = json.name;

    if(json.main && typeof(json.main) === "object"){
        for(let [_k, _v] of Object.entries(json.main)){
            let v:any = _v;
            v.name = _k;
            vjson.steps.push(v);
             
        }
    }

    return vjson;
} 
const runWorkflow = async (req: Request, res: Response) => {
    let err = null;
    let yaml = req.body.yaml;
    if(!yaml) return res.json(GEN_FAIL(["No yaml provided"], ERROR_CODES.INVALID_PARAMS));


    let json = YAML.parse(yaml);

    if(!json) return res.json(GEN_FAIL(["Invalid yaml provided"], ERROR_CODES.INVALID_PARAMS));

    // @todo: Validate JSON
    // console.log(JSON.stringify(json, null, 2));

    json = convertFormat(json);
    console.log(JSON.stringify(json));

    const url = WORKFLOW_ENGINE_API_ROOT + "/run" + `?workflow=${JSON.stringify(json)}`;
    let r = await axios.get(url).catch(e=>err=e);

    if(!r){
        if(err) return res.json(GEN_FAIL([err], ERROR_CODES.NOT_IMPLEMENTED));
        else    return res.json(GEN_FAIL(["NONE"], ERROR_CODES.NOT_IMPLEMENTED));
    }

    return res.json(GEN_SUCCESS([r.data]));

}

const getWorkflowHistory = async (req: Request, res: Response) => {
    let err = null;

    let runId       = req.params.runId;
    let workflowId  = req.params.workflowId;
    if(!runId || !workflowId){
        return res.json(GEN_FAIL(["Invalid runId or workflowId"], ERROR_CODES.INVALID_PARAMS));
    }

    const url = `http://localhost:8088/api/namespaces/default/workflows/${workflowId}/${runId}/history?waitForNewEvent=true`;

    let r = await axios.get(url).catch(e=>err=e);
    if(!r){
        if(err) return res.json(GEN_FAIL([err], ERROR_CODES.NOT_IMPLEMENTED));
        else    return res.json(GEN_FAIL(["NONE"], ERROR_CODES.NOT_IMPLEMENTED));
    }


    return res.json(GEN_SUCCESS([r.data]));
}
const getWorkflowStatus = async (req: Request, res: Response) => {
    let err = null;

    let runId       = req.params.runId;
    let workflowId  = req.params.workflowId;
    if(!runId || !workflowId){
        return res.json(GEN_FAIL(["Invalid runId or workflowId"], ERROR_CODES.INVALID_PARAMS));
    }

    const url = `http://localhost:8088/api/namespaces/default/workflows/${workflowId}/${runId}`;

    let r = await axios.get(url).catch(e=>err=e);
    if(!r){
        if(err) return res.json(GEN_FAIL([err], ERROR_CODES.NOT_IMPLEMENTED));
        else    return res.json(GEN_FAIL(["NONE"], ERROR_CODES.NOT_IMPLEMENTED));
    }


    return res.json(GEN_SUCCESS([r.data]));
}
const terminateWorkflow = async (req: Request, res: Response) => {
    let err = null;

    let runId       = req.params.runId;
    let workflowId  = req.params.workflowId;
    if(!runId || !workflowId){
        return res.json(GEN_FAIL(["Invalid runId or workflowId"], ERROR_CODES.INVALID_PARAMS));
    }

    const url = `http://localhost:8088/api/namespaces/default/workflows/${workflowId}/${runId}/terminate`;

    let r = await axios.post(url, {reason: req.body.reason || "FROM UI"}).catch(e=>err=e);
    if(!r){
        if(err) return res.json(GEN_FAIL([err], ERROR_CODES.NOT_IMPLEMENTED));
        else    return res.json(GEN_FAIL(["NONE"], ERROR_CODES.NOT_IMPLEMENTED));
    }


    return res.json(GEN_SUCCESS([r.data]));
}
const init = ()=>{


    let path = getAPIPath("workflow");
    DEF.EXP?.get(getAPIPath("workflow/:id"), getWorkflow);
    DEF.EXP?.post(getAPIPath("workflow/:id"), createWorkflow);
    
    DEF.EXP?.get(getAPIPath("workflow/:id/run"), runWorkflow);
    DEF.EXP?.post(getAPIPath("workflow/:id/run"), runWorkflow);
    
    
    
    DEF.EXP?.get(getAPIPath("workflow/:workflowId/:runId/status"), getWorkflowStatus);
    DEF.EXP?.get(getAPIPath("workflow/:workflowId/:runId/history"), getWorkflowHistory);
    
    DEF.EXP?.post(getAPIPath("workflow/:workflowId/:runId/terminate"), terminateWorkflow);

}

export default {
    init: init
};