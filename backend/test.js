// rapidapi key for judge0
import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/about',
  headers: {
    'x-rapidapi-key': '611a732105msh1655278533adea4p1fbc0cjsn65d1a27cd8ab',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}