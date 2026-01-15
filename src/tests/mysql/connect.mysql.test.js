const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test',
    port: 8811
});

const batchSize = 100000;
const totalRecords = 10000000; // 1 million records = 19s, 10 million records = 3m30s

let currentId = 1;
console.time(':::::::::::TIMMER:::');
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalRecords; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd(':::::::::::TIMMER:::');
        pool.end(err => {
            if (err) {
                console.error('Error closing the pool:', err);
            } else {
                console.log('All batches inserted and pool closed.');
            }
        });
        return;
    }

    const sql = 'INSERT INTO test_table (id, name, age, address) VALUES ?';
    pool.query(sql, [values], async function (err, results) {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows}`);
        await insertBatch();
    });
};

insertBatch().catch(console.error);