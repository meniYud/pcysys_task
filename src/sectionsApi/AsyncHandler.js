import axios from 'axios';
import mockedSections from './mockData/data';

export default function AsyncHandler({endpoints}) {
    const retrievedData = {
        data: [],
        loading: false,
        error: ''
    };

    if(!endpoints.length) {
        const timer = setTimeout(() => {
            
        }, 2000);
    }

    const promises = endpoints.map(endpoint => {
        const options = {
            method: 'GET',
            url: endpoint
        };

        return axios.request(options);
    });

    Promise.allSettled(promises).
        then((results) => {
            retrievedData.data = results.data;
            retrievedData.error = '';
        }).catch(error => {
            retrievedData.error = error;
        });


    return retrievedData;
}
