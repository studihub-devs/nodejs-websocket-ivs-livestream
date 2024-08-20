import axios from 'axios'
require('dotenv').config();

let data = JSON.stringify({
  query: `query liveStreams($skip: Int = 0, $after: ID, $before: ID, $first: Int = 10, $last: Int, $where: LiveStreamWhereInput, $orderBy: LiveStreamOrderByInput) {
  liveStreams(
    skip: $skip
    after: $after
    before: $before
    first: $first
    last: $last
    where: $where
    orderBy: $orderBy
  ) {
    id
    roomId
    channelId
    status   
    __typename
  }
}`,
  variables: {"skip":0,"first":9999,"where":{"status":"RUNNING"},"orderBy":{"id":"DESC"}}
});
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: process.env.GRAPHQL_API || 'http://0.0.0.0:3000/graphql',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};
console.log(config)

export  async function loadRunningLive() {
    return axios.request(config)
    .then((response: { data: any; }) => {     
      return response.data.data.liveStreams
    })
    .catch((error: any) => {
      console.log(error);
      return []
    });
}
