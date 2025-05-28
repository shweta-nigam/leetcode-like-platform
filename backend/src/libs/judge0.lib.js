import axios from "axios";


export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    TYPESCRIPT: 74,
  };
  return languageMap[language.toUpperCase()];
};

export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useRapidAPI = process.env.USE_RAPIDAPI_ONLY === "true";
const judge0Local = process.env.JUDGE0_LOCAL_URL;
const judge0Api = process.env.JUDGE0_API_URL;
const rapidKey = process.env.RAPIDAPI_KEY;


function getHeaders(useRapid = false) {
  return useRapid
    ? {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": rapidKey,
        "Content-Type": "application/json",
      }
    : {};
}

// fallback runner
async function tryJudge0Request(callback) {
  if (!useRapidAPI) {
    try {
      return await callback(judge0Local, getHeaders(false));
    } catch (err) {
      console.warn("⚠️ Local Judge0 failed, falling back to RapidAPI...");
    }
  }
  return await callback(judge0Api, getHeaders(true));
}

// Submit batch
export const submitBatch = async (submissions) => {
  return await tryJudge0Request(async (url, headers) => {
    const { data } = await axios.post(
      `${url}/submissions/batch?base64_encoded=false`,
      { submissions },
      { headers }
    );
    return data;
  });
};


export const pollBatchResults = async (tokens) => {
  return await tryJudge0Request(async (url, headers) => {
    while (true) {
      const { data } = await axios.get(`${url}/submissions/batch`, {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers,
      });

      const results = data.submissions;
      const isAllDone = results.every(
        (r) => r.status.id !== 1 && r.status.id !== 2
      );
      if (isAllDone) return results;
      await sleep(1000);
    }
  });
};








