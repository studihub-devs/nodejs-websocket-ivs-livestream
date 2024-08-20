import axios from 'axios'
require('dotenv').config();

  const query = `query buyers($where: LiveStreamWhereInput!) {
    distinctBuyers(where: $where) {
    id
    account
    avatar {
      url
    }    
    __typename
  }
}`;

export  async function loadBuyers(channelId: string) {
  const variables = {
    "where": {
      "channelId": channelId
    }
  }
  
  const data = JSON.stringify({query: query, variables: variables})
  console.log("data: ", data)

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.GRAPHQL_API || 'http://0.0.0.0:3000/graphql',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  // console.log("config buyers: ", config)

  return axios.request(config)
    .then((response: { data: any; }) => {      
      return response.data.data.distinctBuyers
    })
    .catch((error: any) => {
      console.log(error);
      return []
    });
}