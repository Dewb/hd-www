docker build -t dewberm/hd-www .
docker run -dit --restart unless-stopped -p 80:3000 dewberm/hd-www
