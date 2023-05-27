const express = require("express");
const koalaRouter = express.Router();
// import the koalas module
// const koalas = require("../modules/koalas.js");
const pool = require("../modules/pool");

// DB CONNECTION

// GET
koalaRouter.get("/", (req, res) => {
  let queryText = "SELECT * FROM koalas ORDER by id";
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(`Error making query ${queryText}`, err);
      res.sendStatus(500);
    });
});

// POST
koalaRouter.post("/", (req, res) => {
  const newKoala = req.body;
  const queryText = `
      INSERT INTO koalas (name, gender, age, ready_to_transfer, notes)
      VALUES ($1, $2, $3, $4, $5);
  `;
  pool
    .query(queryText, [
      newKoala.name,
      newKoala.gender,
      newKoala.age,
      newKoala.ready_to_transfer,
      newKoala.notes,
    ])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(`Error making query ${queryText}`, err);
      res.sendStatus(500);
    });
});

// how do we match index of request to primary key ID in postgres

/// DELETE from db
koalaRouter.delete("/:id", (req, res) => {
  // reqId needs to = id of koala in pg
  let reqId = req.params.id;
  console.log("Delete request for id", req.params.id);
  let sqlText = "DELETE FROM koalas WHERE id=$1;";
  pool
    .query(sqlText, [reqId])
    .then((result) => {
      console.log("Koala deleted");
      res.status(200).send();
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    });
});

// instead of /:id access the event
// from the event access the from the event obj
// set the delete id = id from the object

// // PUT
// koalaRouter.put("/:koalaIndex", (req, res) => {
//   let koalaIndex = req.params.koalaIndex;
//   koalas[koalaIndex].ready_to_transfer = req.body.ready_to_transfer;
//   res.sendStatus(204);
// });

// // DELETE
// koalaRouter.delete('/:koalaIndex', (req, res) => {
//   let koalaIndex = req.params.koalaIndex;
//   let deletedKoala = koalas[koalaIndex];
//   koalas.splice(koalaIndex, 1);
//   res.status(200).send(deletedKoala);

// });

module.exports = koalaRouter;
