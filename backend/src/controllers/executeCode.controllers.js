import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";
import { db } from "../libs/db.js";
import {
  pollBatchResults,
  submitBatch,
  getLanguageName,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const userId = req.body.user; // from authMiddleware  --  confirm it

  try {
    //1.validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      throw new ApiError(400, "Invalid or missing test case ");
    }

    //2. prepare each test cases for judge0 batch submission

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    //3. send the submissions to judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = await submitResponse.map((res) => res.token);

    //4. polling for all submitted test cases result
    const results = await pollBatchResults(tokens);

    console.log("results of executeCode ---------");
    console.log(results);

    // Analyze results of test cases
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = (expected_output === stdout);

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null, // why null here
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined, // why undefined here then
        time: result.time ? `${result.time} s` : undefined,
      };
      // console.log(`Testcase  #${i+1}`)
      // console.log(`Input for test case #${i+1}: ${stdin[i]}`)
      // console.log(`Expected output for testcase ${i+1}: ${expected_output}`)
      // console.log(`Actual output for testcase ${i+1}: ${stdout}`)

      // console.log(`Matched testcase #${i+1}: ${passed}`)
    });
    console.log(detailedResults);

    // store submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("/n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    //   If all passed =  true, mark problem as solved for the current user

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // 8. Save individual test case results using detailedResults

    const testCaseResults = detailedResults.map((result)=>({
        submissionId: submission.id,
        testCase: result.testCase,
        passed:result.passed,
        stdout:result.stdout,
        expected:result.expected,
        stderr:result.stderr,
        compileOutput:result.compile_output,
        status:result.status,
        memory:result.memory,
        time:result.time

    }))

    await db.testCaseResult.createMany({
        data: testCaseResults
    })

    const submissionWithTestCase = await db.submission.findUnique({
        where:{
            id:submission.id,
        } ,include:{
            testCases:true
        }
    })

    res.status(200).json(new ApiResponse(200, submissionWithTestCase, "Code executed successfully"))
  } catch (error) {
    console.error("Error while executing code",error);
    throw new ApiError(500, "Error while executing code")
  }
};
