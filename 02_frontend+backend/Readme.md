This project revolve around mainly:
1. How to Connect backend with frontend.
2. Used axios to fetch api data about jokes from backend .
3. Proxy and CORS to handle CORS policy.
4. Static file in backend folder using "app.use(express.static('dist'))". But this is a bad practice. Because if we change anything in frontend wont propogate. So we have to replace with with new static file everytime.

