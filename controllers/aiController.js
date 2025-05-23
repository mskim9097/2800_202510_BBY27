const axios = require('axios');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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

const generateRiddles = async (req, res, next) => {
  try {
    const { difficulty, number, category } = req.body;

    if (!difficulty || !number || !category) {
      const error = new Error('Missing required fields');
      error.name = 'ValidationError';
      throw error;
    }

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

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
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

    if (!response.data?.choices?.length) {
      const error = new Error('Unexpected response from AI service');
      error.status = 500;
      throw error;
    }

    let { content } = response.data.choices[0].message;
    content = content.trim();
    if (content.startsWith('```')) {
      content = content
        .replace(/^```(json)?/, '')
        .replace(/```$/, '')
        .trim();
    }

    const riddles = JSON.parse(content);
    res.render('pages/riddleQuizz', { 
      riddles,
      userType: req.session?.type,
      name: req.session?.name
    });
  } catch (err) {
    next(err);
  }
};

const gradeRiddles = async (req, res, next) => {
  try {
    const riddles = JSON.parse(req.body.riddles);
    const answers = req.body;

    if (!riddles || !answers.answers) {
      const error = new Error('Missing riddles or answers');
      error.name = 'ValidationError';
      throw error;
    }

    let score = 0;
    riddles.forEach((riddle, index) => {
      const userAnswer = answers.answers[index] || '';
      riddle.userAnswer = userAnswer;
      riddle.correctAnswer = riddle.answer;
      riddle.correct = userAnswer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();
      if (riddle.correct) score++;
    });

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-4o',
          messages: [{ role: 'user', content: 'Tell me a fun biology-related joke.' }],
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

      const joke = response.data.choices?.[0]?.message?.content || "Couldn't fetch a joke this time.";
      res.render('pages/quizzResult', {
        score,
        total: riddles.length,
        joke,
        riddles,
        userType: req.session?.type,
        name: req.session?.name
      });
    } catch (jokeError) {
      // If joke fetch fails, still show results without joke
      res.render('pages/quizzResult', {
        score,
        total: riddles.length,
        joke: '',
        riddles,
        userType: req.session?.type,
        name: req.session?.name
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { showRiddleForm, generateRiddles, gradeRiddles };
