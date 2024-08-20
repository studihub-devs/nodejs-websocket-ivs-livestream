sudo docker rm -f liveprocessor
sudo docker run -dit --name liveprocessor -p 8083:8088 --env GRAPHQL_API=https://api-gateway.review-ty.com/graphql  339126146861.dkr.ecr.ap-southeast-1.amazonaws.com/reviewty/livestream-processor:1.7.0
sudo docker logs -f liveprocessor
