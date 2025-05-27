import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const createProblem = async (req, res) => {
  //1. get data from body
  const {
    title,
    description,
    tags,
    editorial,
    constrains,
    examples,
    hints,
    difficulty,
    testcases,
    codeSnippets,
    referenceSolutions,
    isDemo,
  } = req.body;


  try {
    //3. loop through each problems

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ApiError(400, `Language ${language} is not supported`);
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode, 
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);


      for (let i = 0; i < results.length; i++) {
        const result = results[i]; 
        console.log("Results_______-------", result);

        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Testcase ${i + 1} failed for language ${language}`
          );
        }
      }
    }


    const newProblem = await db.problems.create({
      data: {
        title,
        description,
        tags,
        editorial,
        constrains,
        examples,
        hints,
        difficulty,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id, 
        isDemo: isDemo || false,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newProblem, "Message Created Successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error while creating problem");
  }
};

export const updateProblem = async (req, res) => {
  const {
    title,
    description,
    tags,
    editorial,
    constrains,
    examples,
    hints,
    difficulty,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // if (req.user !== "ADMIN") {
  //   throw new ApiError(403, "Access Denied - ADMIN only");
  // }
  try {
    const existingProblem = await db.problems.findUnique({
      where: { id: req.params.id },
    });

    if (!existingProblem) {
      throw new ApiError(404, `Problem with id ${req.params.id} not found`);
    }

    const problemId = req.params.id;


    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, `Language ${language} is not supported`);
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((r) => r.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Results_______-------", result);

        if (result.status.id !== 3) {
          throw new ApiError(400, `Testcase ${i + 1} failed for ${language}`);
        }
      }

      
    }

    const updateProblem = await db.problems.update({
        where: {
          id: problemId,
        },
        data: {
          title,
          description,
          tags,
          editorial,
          constrains,
          examples,
          hints,
          difficulty,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

    return  res
        .status(200)
        .json(
          new ApiResponse(200, updateProblem, "Problem updated successfully")
        );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error while updating problem");
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problems.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
       orderBy: {
        createdAt: "desc", 
      },
    });
    if (!problems) {
      throw new ApiError(400, "No problem found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, problems, "Problems found successfully"));
  } catch (error) {
    console.error("Error while finding problems");
    throw new ApiError(500, "Error while getting problems");
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problems.findUnique({
      where: { id },
    });
    if (!problem) {
      throw new ApiError(400, "problem not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, problem, "Problem found successfully"));
  } catch (error) {
    console.error("Error while finding problem by id", error);
    throw new ApiError(500, "Error while getting problem by id");
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problems.delete({
      where: { id },
    });
    if (!problem) {
      throw new ApiError(400, "problem not deleted");
    }

    res
      .status(200)
      .json(new ApiResponse(200, problem, "Problem deleted successfully"));
  } catch (error) {
    console.error("Error while deleting problem", error);
    throw new ApiError(500, "Error while deleting problem ");
  }
};


export const getAllProblemsSolvedByUser = async(req,res)=>{
  try {
    console.log("req.user:", req.user);
    console.log("Authorization Header:", req.headers.authorization);

    const problems = await db.problems.findMany({
      where:{
        solvedBy:{
          some:{
            userId:req.user.id
          }
        }
      },
      include:{
        solvedBy:{
          where:{
            userId:req.user.id
          }
        }
      }
    })
    return res.status(200).json(new ApiResponse(200, problems, "All problems fetched successfully"))
  } catch (error) {
    console.error("Error while Fetching all problems", error);
    throw new ApiError(500, "Error while Fetching all problems")
  }
}
