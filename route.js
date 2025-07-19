import { Router } from "express";
import * as DBController from './controller.js'
import { slowDown } from "./util.js";

const router = Router()

//http://quickdb.live/api/{tablename}

//get total number of tables and requests made
router.get('/site/count', DBController.getRequestCount)

//create table with provided uuid
router.get('/site/create', slowDown(300000), DBController.createTable)

//TABLE REQUESTS

router.get('/:table', slowDown(1000), DBController.tableExist, DBController.getData)

router.get('/:table/:id', slowDown(1000), DBController.tableExist, DBController.getDataById)

router.post('/:table', slowDown(2000), DBController.tableExist, DBController.insertData)

router.put('/:table/:id', slowDown(2000), DBController.tableExist, DBController.putData)

router.patch('/:table/:id', slowDown(2000), DBController.tableExist, DBController.patchData)

router.delete('/:table/:id', slowDown(1000), DBController.tableExist, DBController.deleteData)

export default router