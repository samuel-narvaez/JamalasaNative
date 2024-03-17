import { enablePromise, openDatabase } from "react-native-sqlite-storage";

enablePromise(true);
const DATABASE_NAME = 'liveStock'

export async function getDBConnection() {
    const db = await openDatabase({ name: DATABASE_NAME, location: 'default' });
    return db;
};


//CREATE TABLES
export async function createTable(db) {
    const query = `CREATE TABLE IF NOT EXISTS Cows(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(50) unique,
        animal VARCHAR(25),
        gender VARCHAR(25),
        category VARCHAR(50),
        source VARCHAR(50),
        priceAnimal REAL,
        breed VARCHAR(20),
        pregnancy INTEGER(5),
        farmyard VARCHAR(50),
        illness VARCHAR(50),
        causeIllness VARCHAR(80),
        date DATE,
        stateCow BOOLEAN,
        prefix VARCHAR(5),
        numbersequence INTEGER(6),
        synchronization BOOLEAN
      );`;
    try {
        const table = await db.executeSql(query);
        console.log('table created successfully');
        return table;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function createTableEvents(db) {
    const query = `CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeCows VARCHAR(50),
        cause VARCHAR(150),
        date DATE,
        money BOOLEAN,
        synchronization BOOLEAN
      );`;
    try {
        const table = await db.executeSql(query);
        console.log('table created successfully');
        return table;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function pivotCowsCalf(db) {
    const query = `CREATE TABLE IF NOT EXISTS pivotcowscalf(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codeCows VARCHAR(50),
        codeCalf VARCHAR(50),
        date DATE,
        synchronization BOOLEAN
      );`;
    try {
        const table = await db.executeSql(query);
        console.log('table created successfully');
        return table;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function verificationDataCows(db) {
    try {
        const cows = [];
        let query = 'SELECT * FROM Cows WHERE stateCow = 1'
        const result = await db.executeSql(query);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function verificationDataEvents(db) {
    try {
        const cows = [];
        let query = 'SELECT * FROM events'
        const result = await db.executeSql(query);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function verificationDataEquipment(db) {
    try {
        const equipment = [];
        let query = 'SELECT * FROM equipment WHERE stateEquipment = 1'
        const result = await db.executeSql(query);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                equipment.push(element.rows.item(i))
            }
        });
        return equipment;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function createTableEquipments(db) {
    const query = `CREATE TABLE IF NOT EXISTS equipment(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nameEquipment VARCHAR(70),
        quantity REAL,
        price REAL,
        date DATE,
        stateEquipment BOOLEAN,
        synchronization BOOLEAN
      );`;
    try {
        const table = await db.executeSql(query);
        console.log('table created successfully');
        return table;
    } catch (error) {
        console.log('error on creating table' + error.message);
    }
};

export async function initDatabase() {
    const db = await getDBConnection();
    createTable(db);
    createTableEvents(db);
    pivotCowsCalf(db);
    createTableEquipments(db);
    db.close();
}

//COWS
export async function getCows(db) {
    try {
        const cows = [];
        const result = await db.executeSql('SELECT category FROM Cows WHERE stateCow = 1');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getEventCows(db) {
    try {
        const cows = [];
        const result = await db.executeSql('SELECT code,id,priceAnimal FROM Cows WHERE stateCow = 1 ORDER BY code');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getCodeCow(db, prefix) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT numbersequence FROM cows WHERE prefix = '${prefix}' ORDER BY id DESC limit 0,1`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getCowsByCatergory(db, category) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT * FROM Cows WHERE category = '${category}' AND stateCow = '1'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getCowsDisabled(db) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT * FROM Cows WHERE stateCow = '0'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getCowsEnable(db) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT * FROM Cows WHERE stateCow = '1'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getGender(db) {
    try {
        const cows = [];
        let query = `SELECT count(Case c.gender when 'HEMBRA' then c.id end) as HEMBRA, count(Case c.gender when 'MACHO' then c.id end) as MACHO FROM Cows c WHERE c.stateCow = 1`;
        const result = await db.executeSql(query);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getAnimal(db) {
    try {
        const cows = [];
        let query = `SELECT 
                        count(Case c.animal when 'BOVINOS' then c.id end) as BOVINOS,
                        count(Case c.animal when 'CABALLARES' then c.id end) as CABALLARES,
                        count(Case c.animal when 'MULARES' then c.id end) as MULARES,
                        count(Case c.animal when 'CAPRINOS' then c.id end) as CAPRINOS,
                        count(Case c.animal when 'ASNALES' then c.id end) as ASNALES
                    FROM Cows c WHERE c.stateCow = 1`;
        const result = await db.executeSql(query);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function insertCows(db, values) {
    const {
        code,
        gender,
        category,
        source,
        breed,
        pregnancy,
        farmyard,
        illness,
        causeIllness,
        date,
        stateCow,
        prefix,
        numbersequence,
        animal,
        priceAnimal,
        synchronization
    } = values;
    const sync = synchronization != "" ? synchronization : 0;
    const insertQuery = `INSERT INTO Cows (code,animal,gender,category,source,priceAnimal,breed,pregnancy,farmyard,illness,
                                            causeIllness,date,stateCow,prefix,numbersequence,synchronization) 
                        VALUES  ('${code}','${animal}','${gender}','${category}','${source}',${priceAnimal},'${breed}',${pregnancy},'${farmyard}','${illness}','${causeIllness}','${date}',${stateCow},'${prefix}',${numbersequence},${sync})`

    return db.executeSql(insertQuery);
}

export async function updateCows(db, values) {
    const { id, pregnancies, farmyards, illnes, causeIllnes, editCategory } = values;
    try {
        const query = `UPDATE Cows SET pregnancy = ${pregnancies},farmyard = '${farmyards}',illness = '${illnes}',causeIllness = '${causeIllnes}',category = '${editCategory}'
                        WHERE id = ${id}`
        return db.executeSql(query);
    } catch (error) {
        console.log(error.message);
    }

}

export async function updateCowsPregnancy(db, values) {
    const { id, pregnancy } = values;
    try {
        const query = `UPDATE Cows SET pregnancy = ${pregnancy} WHERE id = ${id}`;
        return db.executeSql(query);
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateStatusCows(db, values) {
    try {
        values.forEach(element => {
            const { status, code } = element;
            const insertQuery = `UPDATE Cows SET stateCow = ${status} WHERE code = '${code}'`
            return db.executeSql(insertQuery);
        });
    } catch (error) {
        console.log(error.message);
    }

}

export async function deleteCows(db, id) {
    const insertQuery = `UPDATE Cows SET stateCow = 0 WHERE id = ${id}`;
    return db.executeSql(insertQuery);
}

//EVENTS
export async function insertEvents(db, values) {
    values.forEach(element => {
        const { cause, species, date, money, synchronization } = element;
        let status = money == undefined ? 0 : money
        const insertQuery = `INSERT INTO events (codeCows,cause,date,money,synchronization) VALUES ('${species}','${cause}', '${date}',${status},${synchronization})`;
        return db.executeSql(insertQuery);
    });
}

export async function getEvents(db, code) {
    try {
        const event = [];
        const result = await db.executeSql(`SELECT * FROM events WHERE codeCows = '${code}'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                event.push(element.rows.item(i))
            }
        });
        return event;
    } catch (error) {
        console.log(error.message);
    }
}

//CALF
export async function insertPivotCowsCalf(db, values) {
    const { codeCows, codeCalf, date, synchronization } = values;
    const sync = synchronization != "" ? synchronization : 0;
    const insertQuery = `INSERT INTO pivotcowscalf (codeCows,codeCalf,date,synchronization) VALUES ('${codeCows}','${codeCalf}','${date}',${sync})`;
    return db.executeSql(insertQuery);
}

export async function getCowsByCalf(db, code) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT codeCalf,date FROM pivotcowscalf WHERE codeCows = '${code}'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getEventsCalf(db, code) {
    try {
        const data = [];
        const result = await db.executeSql(`SELECT codeCows,codeCalf,date FROM pivotcowscalf where codeCalf = '${code}'`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                data.push(element.rows.item(i))
            }
        });
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

//SYNC UP
export async function getCowSync(db) {
    try {
        const cows = [];
        const result = await db.executeSql('SELECT * FROM Cows WHERE synchronization = 0');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getEventSync(db) {
    try {
        const cows = [];
        const result = await db.executeSql('SELECT * FROM events WHERE synchronization = 0');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getCowsCalf(db) {
    try {
        const cows = [];
        const result = await db.executeSql(`SELECT * FROM pivotcowscalf WHERE synchronization = 0`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                cows.push(element.rows.item(i))
            }
        });
        return cows;
    } catch (error) {
        console.log(error.message);
    }
}

export async function getEquipmentSync(db) {
    try {
        const equipment = [];
        const result = await db.executeSql('SELECT * FROM equipment WHERE synchronization = 0');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                equipment.push(element.rows.item(i))
            }
        });
        return equipment;
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateSyncCows(db, code) {
    try {
        const insertQuery = `UPDATE Cows SET synchronization = 1 WHERE code = '${code}'`
        return db.executeSql(insertQuery);
    } catch (error) {
        console.log(error.message);
    }

}

export async function updateSyncEvent(db, id) {
    try {
        const insertQuery = `UPDATE events SET synchronization = 1 WHERE id = ${id}`
        return db.executeSql(insertQuery);
    } catch (error) {
        console.log(error.message);
    }

}

export async function updateSyncPivotCowsCalf(db, id) {
    try {
        const insertQuery = `UPDATE pivotcowscalf SET synchronization = 1 WHERE id = ${id}`
        return db.executeSql(insertQuery);
    } catch (error) {
        console.log(error.message);
    }

}

export async function updateSyncEquipment(db, id) {
    try {
        const insertQuery = `UPDATE equipment SET synchronization = 1 WHERE id = ${id}`
        return db.executeSql(insertQuery);
    } catch (error) {
        console.log(error.message);
    }

}

//EQUIPMENT
export async function insertEquipment(db, values) {
    const { nameEquipment, quantity, price, date, synchronization } = values;
    const sync = synchronization != "" ? synchronization : 0;
    const stateEquipment = 1;
    const insertQuery = `INSERT INTO equipment (nameEquipment,quantity,price,date,stateEquipment,synchronization)
                        VALUES  ('${nameEquipment}',${quantity},${price},'${date}',${stateEquipment},${sync})`

    return db.executeSql(insertQuery);
}

export async function getEquipment(db) {
    try {
        const equipment = [];
        const result = await db.executeSql('SELECT * FROM equipment WHERE stateEquipment = 1');
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                equipment.push(element.rows.item(i))
            }
        });
        return equipment;
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteOneEquipment(db, id) {
    const insertQuery = `UPDATE equipment SET stateEquipment = 0 WHERE id = ${id}`;
    return db.executeSql(insertQuery);
}

//TABLE
export async function getContability(db) {
    try {
        const event = [];
        const result = await db.executeSql(`SELECT Cows.code,Cows.priceAnimal,events.cause FROM Cows INNER JOIN events ON Cows.code = events.codeCows WHERE events.money = 1`);
        result.forEach(element => {
            for (let i = 0; i < element.rows.length; i++) {
                event.push(element.rows.item(i))
            }
        });
        return event;
    } catch (error) {
        console.log(error.message);
    }
}


//DELETE
export async function deleteAllCows(db) {
    try {
        await db.executeSql('DELETE FROM Cows');
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteAllEvents(db) {
    try {
        await db.executeSql('DELETE FROM events');
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteAllPivot(db) {
    try {
        await db.executeSql('DELETE FROM pivotcowscalf');
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteAllEquipment(db) {
    try {
        await db.executeSql('DELETE FROM equipment');
    } catch (error) {
        console.log(error.message);
    }
}

