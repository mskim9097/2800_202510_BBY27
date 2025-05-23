const axios = require('axios');

const OPENROUTER_API_KEY =
  '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';

const showRiddleForm = (req, res) => {
  res.render('pages/riddle');
};

function createPrompt(difficulty, number, category) {
  const prompt = `
      Generate ${number} riddles related to "${category}" with difficulty level "${difficulty}".
      Format them as a JSON array with this structure:
      [
        {
          "question": "...",
          "answer": "...",
          "options": ["...","...","...","..."]
        }
      ]
    `;
  return prompt;
}

const generateRiddles = async (req, res) => {
  const { difficulty, number, category } = req.body;

  const prompt = `
      Generate ${number} riddles related to "${category}" with difficulty level "${difficulty}".
      Format them as a JSON array with this structure:
      [
        {
          "question": "...",
          "answer": "...",
          "options": ["...","...","...","..."]
        }
      ]
    `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // or a free model like "deepseek/deepseek-chat:free"
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000, // set to a safe number
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'RiddleQuizzApp',
        },
      }
    );

    if (!response.data?.choices?.length) {
      console.error('Unexpected response format:', response.data);
      return res.status(500).send('Unexpected response from AI');
    }

    let { content } = response.data.choices[0].message;

    // Sometimes GPT returns JSON inside markdown ``` blocks — remove them
    content = content.trim();
    if (content.startsWith('```')) {
      content = content
        .replace(/^```(json)?/, '')
        .replace(/```$/, '')
        .trim();
    }

    const riddles = JSON.parse(content);
    res.render('pages/riddleQuizz', { riddles });
  } catch (err) {
    console.error(
      'Error generating riddles:',
      err.response?.data || err.message || err
    );
    res.status(500).send('Failed to generate riddles');
  }
};

const gradeRiddles = async (req, res) => {
  const riddles = JSON.parse(req.body.riddles);
  const answers = req.body;
  console.log('answers from form:', answers.answers);

  let score = 0;
  riddles.forEach((riddle, index) => {
    const userAnswer =
      answers.answers && answers.answers[index] ? answers.answers[index] : '';
    riddle.userAnswer = userAnswer;
    riddle.correctAnswer = riddle.answer;
    riddle.correct =
      userAnswer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();

    if (riddle.correct) score++;
  });

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'user', content: 'Tell me a fun biology-related joke.' },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'RiddleQuizzApp',
        },
      }
    );

    console.log('Joke API response:', response.data); // <- Add this

    const joke =
      response.data.choices?.[0]?.message?.content ||
      "Oops! Couldn't fetch a joke this time.";
    res.render('pages/quizzResult', {
      score,
      total: riddles.length,
      joke,
      riddles,
    });
  } catch (err) {
    console.error('Error getting joke:', err.response?.data || err.message);
    res.render('pages/quizzResult', {
      score,
      total: riddles.length,
      joke: '',
      riddles,
    });
  }
};

module.exports = { showRiddleForm, generateRiddles, gradeRiddles };
