import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  selectedCategory: "12",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "chooseCategory":
      console.log(state.selectedCategory, action.payload);
      return { ...state, selectedCategory: action.payload };

    default:
      throw new Error("Action unkonwn");
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      selectedCategory,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,

    0
  );
  const numQuestions = questions.length;

  const changeApiJson = function (questionList) {
    return questionList.map((question) => {
      const {
        question: rawQuestion,
        correct_answer: rawCorrectAnswer,
        incorrect_answers: rawIncorrectAnswers,
        difficulty,
        ...rest
      } = question;

      const formattedQuestion = formatString(rawQuestion);
      const formattedCorrectAnswer = formatString(rawCorrectAnswer);
      const formattedIncorrectAnswers = rawIncorrectAnswers.map(formatString);

      const options = [formattedCorrectAnswer, ...formattedIncorrectAnswers];
      const correctOption = options.indexOf(formattedCorrectAnswer);

      let points = 0;
      if (difficulty === "easy") {
        points = 5;
      } else if (difficulty === "medium") {
        points = 10;
      } else if (difficulty === "hard") {
        points = 20;
      }

      return {
        ...rest,
        question: formattedQuestion,
        options,
        correctOption,
        points,
      };
    });
  };
  function formatString(str) {
    return str.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  }

  useEffect(
    function () {
      fetch(
        `https://opentdb.com/api.php?amount=10&${
          selectedCategory === "any" ? "" : `category=${selectedCategory}&`
        }type=multiple`
      )
        .then((res) => res.json())
        .then((data) =>
          dispatch({
            type: "dataReceived",
            payload: changeApiJson(data["results"]),
          })
        )
        .catch((err) => dispatch({ type: "dataFailed" }));
    },
    [selectedCategory]
  );

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

const QuizCategories = {
  "Any Category": "any",
  "General Knowledge": "9",
  "Entertainment: Books": "10",
  "Entertainment: Film": "11",
  "Entertainment: Music": "12",
  "Entertainment: Musicals & Theatres": "13",
  "Entertainment: Television": "14",
  "Entertainment: Video Games": "15",
  "Entertainment: Board Games": "16",
  "Science & Nature": "17",
  "Science: Computers": "18",
  "Science: Mathematics": "19",
  Mythology: "20",
  Sports: "21",
  Geography: "22",
  History: "23",
  Politics: "24",
  Art: "25",
  Celebrities: "26",
  Animals: "27",
  Vehicles: "28",
  "Entertainment: Comics": "29",
  "Science: Gadgets": "30",
  "Entertainment: Japanese Anime & Manga": "31",
  "Entertainment: Cartoon & Animations": "32",
};

export { QuizProvider, useQuiz, QuizCategories };
