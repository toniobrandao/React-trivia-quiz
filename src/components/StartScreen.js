import { useQuiz } from "../contexts/QuizContext";
import Dropdown from "./Dropdown";

function StartScreen({ QuizCategories }) {
  const { numQuestions, dispatch } = useQuiz();
  const handleDropdownChange = (event) => {
    console.log(event.target.value); // Handle the selected value here
  };
  return (
    <div className="start">
      <h2>Welcome to The Trivia Quiz!</h2>
      <h3>{numQuestions} questions to test your trivia mastery</h3>
      <h4>Choose a Category</h4>
      <Dropdown
        options={Object.keys(QuizCategories)}
        values={Object.values(QuizCategories)}
        onChange={handleDropdownChange}
      />
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
