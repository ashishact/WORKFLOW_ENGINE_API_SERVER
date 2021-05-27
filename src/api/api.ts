import _log                         from "../_log";
import DEF, {getAPIPath}            from "../_global";


import {Request, Response}          from "express";

import {GEN_SUCCESS, GEN_FAIL}      from "./interfaces";

import workflow                      from "./workflow";



const init = ()=>{
    _log("API INIT");


    let path = getAPIPath("test");
    DEF.EXP?.get(path, (req: Request, res: Response)=>{
        return res.status(200).json(GEN_SUCCESS(["yes"]));
    })

    
    workflow.init();
}
export default {
    init: init
};