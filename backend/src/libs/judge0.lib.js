import axios from "axios"
export const getJudge0LanguageId = (language) => {
  const languageMap = {
   "PYTHON": 71,
    "JAVA": 62,
    "JAVASCRIPT": 63,
  };
//   console.log(languageMap[language].toUpperCase())
  return languageMap[language.toUpperCase()];      // => Uses square brackets [] to access dynamic object keys. Here you can not use dot (.) because values are not static. languageMap.PYTHON // => 71  (not possible here)
};
// console.log(getJudge0LanguageId("PYTHON"));


const sleep = (ms) => new Promise((resolve)=> setTimeout(resolve,ms))
// local setup
export const pollBatchResults = async(tokens) => {
    while(true){
        const {data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !==2
        )
        if(isAllDone) return results
        await sleep(1000)
    }
}


// api ----------
// export const pollBatchResults = async (tokens) => {
//   while (true) {
//     const { data } = await axios.get(
//       `${process.env.JUDGE0_API_URL}/submissions/batch`,
//       {
//         params: {
//           tokens: tokens.join(","),
//           base64_encoded: false,
//         },
//         headers: {
//           "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
//           "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//         },
//       }
//     );

//     const results = data.submissions;

//     const isAllDone = results.every(
//       (r) => r.status.id !== 1 && r.status.id !== 2
//     );
//     if (isAllDone) return results;
//     await sleep(1000);
//   }
// };


// for local setup
export const submitBatch = async(submissions) => { 
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })      // why destructure data here ? and from where it is happening?

    console.log("Submissions results: ", data)
    return data
}

//api------
// export const submitBatch = async (submissions) => {
//   const { data } = await axios.post(
//     `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
//     { submissions },
//     {
//       headers: {
//         "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
//         "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//       },
//     }
//   );

//   console.log("Submissions results: ", data);
//   return data;
// };




export function getLanguageName(languageId){
    const LANGUAGE_NAMES = {
        74:"TypeScript",
        63:"JavaScript",
        71: "Python",
        62:"Java"
    }
     return LANGUAGE_NAMES[languageId] || "Unknown"
}