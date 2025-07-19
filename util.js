import fs from "fs"

export function Logger(req, res, next) {
    let log = JSON.stringify({
        ip: req.ip,
        body: req.body ?? "",
        date: new Date().toISOString(),
        url: req.path,
    })
    fs.appendFile("Log.txt", log + "\n", () => { })
    next()
}

const spammerlist = {}

export function slowDown(time) {

    return (req, res, next) => {
        if (!spammerlist[req.ip]) {
            spammerlist[req.ip] = Date.now()
            return next()
        }

        //if spamming , pause for a 5 second
        //else remove from list and move to next middleware
        const timeleft = Date.now() - spammerlist[req.ip]
        if (timeleft < time) {
            spammerlist[req.ip] = Date.now()
            return res.status(403).json("Wait " + Math.trunc(timeleft/1000) + " seconds")
        } else {
            delete spammerlist[req.ip]
            return next()
        }
    }

}