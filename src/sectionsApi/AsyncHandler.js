import axios from 'axios';

export default function AsyncHandler({endpoints}) {
    const retrievedData = {
        data: [],
        loading: false,
        error: ''
    };

    if(!endpoints.length) {
        retrievedData.error = 'Please provide Endpoints'
        return retrievedData;
    }

    const promises = endpoints.map(endpoint => {
        const options = {
            method: 'GET',
            url: endpoint
        };

        return axios.request(options);
    });

    Promise.allSettled(promises)
        .then((results) => {
            retrievedData.data = results.data;
            retrievedData.error = '';
        }).catch(error => {
            retrievedData.error = error;
        });


    return retrievedData;
}
