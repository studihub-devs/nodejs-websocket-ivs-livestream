import axios from 'axios'
require('dotenv').config();


export async function sendEyeLogs(message: string) {

  const data = JSON.stringify({
    query: `mutation activityLogs($data: ActivityLogCreateInput!){
    activityLogs(data: $data)
  }`,
    variables: { "data": { "name": "livestream_eyes_info", "message": message } }
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.GRAPHQL_API || 'http://0.0.0.0:3000/graphql',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

}

