const api_url = process.env.REACT_APP_API_URL;

function getApiUrl() {
    console.log(api_url)
    return api_url;
}

export default getApiUrl;