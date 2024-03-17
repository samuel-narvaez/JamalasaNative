import axios from 'axios'
const headers = {
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Method": '*',
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': "application/json"
}

const URL = 'https://villa.showupweb.com/livestock';
//const URL = 'http://192.168.0.2:3000/livestock';

export class Requests {
    insertCow = async (values) => {
        try {
            let res = await axios.post(`${URL}/cows`, values, { headers: headers });
            return res.status
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    insertEvents = async (values) => {
        try {
            let res = await axios.post(`${URL}/events`, values, { headers: headers });
            return res.status
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    insertCalf = async (values) => {
        try {
            let res = await axios.post(`${URL}/calf`, values, { headers: headers });
            return res.status
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    insertEquipment = async (values) => {
        try {
            let res = await axios.post(`${URL}/equipment`, values, { headers: headers });
            return res.status
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    Cows = async () => {
        try {
            let res = await axios.get(`${URL}/cows`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    Events = async () => {
        try {
            let res = await axios.get(`${URL}/events`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    Equipment = async () => {
        try {
            let res = await axios.get(`${URL}/equipment`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    Pivot = async () => {
        try {
            let res = await axios.get(`${URL}/calf`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    updatePregnacyCows = async (value) => {
        try {
            let res = await axios.patch(`${URL}/cows`,value, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    updateStatusCows = async (value) => {
        try {
            let res = await axios.patch(`${URL}/cows/cowStatus`,value, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    cowsDisabled = async () => {
        try {
            let res = await axios.get(`${URL}/cows/disabled`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    eventsDisabled = async (code) => {
        try {
            let res = await axios.post(`${URL}/events/getByCodeCows`,{code}, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    insertDateUp = async (date) => {
        try {
            let res = await axios.post(`${URL}/events/dateSycn`, {date}, { headers: headers });
            return res.status
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    DataUp = async () => {
        try {
            let res = await axios.get(`${URL}/events/logs`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    eventsMoney = async () => {
        try {
            let res = await axios.get(`${URL}/events/money`, { headers: headers });
            return res.data;
        } catch (error) {
            console.log("este es el error", error);
        }
    }
    insertAllElements = async (values) => {
        try {
            let res = await axios.post(`${URL}/upAllElements`, values, { headers: headers });
            return res
        } catch (error) {
            console.log("este es el error", error);
        }
    }
}
