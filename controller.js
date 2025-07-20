import DB from "./db.js"
import {v4 as uuidv4} from 'uuid'
import is_number from "is-number"

export async function getRequestCount(req, res, next){
    const count = {
        table : DB.getTableCount().tablecount,
        request : DB.getRequestCount().requestcount
    }
    return res.status(200).json(count)
}

export async function createTable(req, res, next){
    let uuid = uuidv4().replace(/-/g,'')
    DB.setTableCount()
    DB.setRequestCount()
    DB.insertTableList(uuid)
    return res.status(200).json(uuid)
}

export async function getData(req, res, next){
    DB.setRequestCount()
    let limit = Number(req.query.limit)
    let offset = Number(req.query.offset)
    if(!limit || limit > 50 || limit < 0 || !is_number(limit)){
        limit = 50
    }
    if(!offset || offset < 0 || !is_number(offset)){
        offset = 0
    }
    const data = DB.getData(req.params.table, limit, offset)
    let result = []
    if(data){
        result = data.map(x => ({...x, data : JSON.parse(x.data)}))
    }
    return res.status(200).json(result)
}

export async function getDataById(req, res, next){
    DB.setRequestCount()
    const data = DB.getDataById(req.params.table, req.params.id)
    let result = []
    if(data){
        result = {...data, data : JSON.parse(data.data)}
    }
    return res.status(200).json(result)
}


export async function insertData(req, res, next){
    DB.setRequestCount()
    const data = DB.insertData(req.params.table, JSON.stringify(req.body))
    return res.status(200).json(data)
}


export async function putData(req, res, next){
    DB.setRequestCount()
    const data = DB.putPatchData(req.params.table, JSON.stringify(req.body), req.params.id)
    return res.status(200).json("Success")
}


export async function patchData(req, res, next){
    DB.setRequestCount()
    let data = DB.getDataById(req.params.table, req.params.id)
    let parsed = JSON.parse(data.data)
    let patchData = req.body
    let newData = {...parsed, ...patchData}
    const result = DB.putPatchData(req.params.table, JSON.stringify(newData), req.params.id)
    return res.status(200).json("Success")
}


export async function deleteData(req, res, next){
    DB.setRequestCount()
    const data = DB.deleteData(req.params.table, req.params.id)
    return res.status(200).json("Deleted")
}

export async function tableExist(req, res, next){
    const table = req.params.table
    const dbtable = DB.checkTableList(table)
    if(!dbtable){
        return res.status(404).json("Table does not exist")
    }else{
        next()
    }
}