const axios = require('axios');
const OPENROUTER_API_KEY = "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";

const showRiddleForm = (req, res) => {
  res.render('pages/riddle', {
    error: null,
    userType: req.session?.type,
    name: req.session?.name,
  });
};

function createPrompt(difficulty, number, category) {
  return `
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
}

const generateRiddles = async (req, res) => {
  try {
    const { difficulty, number, category } = req.body;

    if (!difficulty || !number || !category) {
      return res.render('pages/riddle', {
        error: 'Please fill in all required fields',
        userType: req.session?.type,
        name: req.session?.name,
      });
    }

    if (!OPENROUTER_API_KEY) {
      return res.render('pages/riddle', {
        error: 'AI service is not properly configured. Please try again later.',
        userType: req.session?.type,
        name: req.session?.name,
      });
    }

    const prompt = createPrompt(difficulty, number, category);

    try {
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
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'BiodiversityGo',
          },
        }
      );

      if (!response.data?.choices?.length) {
        return res.render('pages/riddle', {
          error: 'Unable to generate riddles. Please try again.',
          userType: req.session?.type,
          name: req.session?.name,
        });
      }

      let { content } = response.data.choices[0].message;
      content = content.trim();
      if (content.startsWith('```')) {
        content = content
          .replace(/^```(json)?/, '')
          .replace(/```$/, '')
          .trim();
      }

      try {
        const riddles = JSON.parse(content);
        res.render('pages/riddleQuizz', {
          riddles,
          userType: req.session?.type,
          name: req.session?.name,
        });
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.render('pages/riddle', {
          error: 'Failed to process the riddles. Please try again.',
          userType: req.session?.type,
          name: req.session?.name,
        });
      }
    } catch (apiError) {
      console.error('API error:', apiError.response?.data || apiError.message);
      let errorMessage = 'Failed to generate riddles. ';

      if (apiError.response?.status === 401) {
        errorMessage =
          'AI service authentication failed. Please try again later.';
      } else if (apiError.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (apiError.response?.status === 500) {
        errorMessage =
          'AI service is temporarily unavailable. Please try again later.';
      }

      return res.render('pages/riddle', {
        error: errorMessage,
        userType: req.session?.type,
        name: req.session?.name,
      });
    }
  } catch (error) {
    console.error('General error:', error);
    res.render('pages/riddle', {
      error: 'An unexpected error occurred. Please try again later.',
      userType: req.session?.type,
      name: req.session?.name,
    });
  }
};

const gradeRiddles = async (req, res) => {
  try {
    const riddles = JSON.parse(req.body.riddles);
    const answers = req.body;

    if (!riddles || !answers.answers) {
      return res.render('pages/error', {
        error: 'Missing riddles or answers. Please try again.',
        userType: req.session?.type,
        name: req.session?.name,
      });
    }

    let score = 0;
    riddles.forEach((riddle, index) => {
      const userAnswer = answers.answers[index] || '';
      riddle.userAnswer = userAnswer;
      riddle.correctAnswer = riddle.answer;
      riddle.correct =
        userAnswer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();
      if (riddle.correct) score++;
    });

    let joke =
      "Why did the biologist break up with the mathematician? Because there wasn't enough chemistry! 🧪";

    try {
      if (OPENROUTER_API_KEY) {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'openai/gpt-3.5-turbo',
            messages: [
              { role: 'user', content: 'Tell me a fun biology-related joke.' },
            ],
            max_tokens: 1000,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
              'X-Title': 'BiodiversityGo',
            },
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          joke = response.data.choices[0].message.content;
        }
      }
    } catch (jokeError) {
      console.error('Failed to fetch joke:', jokeError);
      // Use default joke if API call fails
    }

    res.render('pages/quizzResult', {
      score,
      total: riddles.length,
      joke,
      riddles,
      userType: req.session?.type,
      name: req.session?.name,
    });
  } catch (error) {
    console.error('Grade riddles error:', error);
    res.render('pages/error', {
      error: 'Failed to grade your answers. Please try again.',
      userType: req.session?.type,
      name: req.session?.name,
    });
  }
};

module.exports = { showRiddleForm, generateRiddles, gradeRiddles };
