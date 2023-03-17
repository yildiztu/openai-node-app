import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompter = req.body.prompter || '';
  if (prompter.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter something!",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      //model: "code-davinci-002",
      //model: "code-cushman-001",
      //model: "text-curie-001",
      prompt: generatePrompt(prompter),
      temperature: 0.7,
      max_tokens: 3700,
      //max_tokens: 2000,
      top_p: 0.1,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      best_of: 1,
    });
    res.status(200).json({ result: prompter + completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(prompter) {
    return `${prompter}`;
}
