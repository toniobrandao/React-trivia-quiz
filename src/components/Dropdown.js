import { useQuiz } from "../contexts/QuizContext";

function Dropdown({ options, values, onChange }) {
  const { selectedCategory, dispatch } = useQuiz();
  console.log(
    `https://opentdb.com/api.php?amount=10&${
      selectedCategory === "any" ? "" : `category=${selectedCategory}&`
    }type=multiple`
  );

  console.log(selectedCategory);

  return (
    <select
      className="dropdown"
      onChange={(e) =>
        dispatch({ type: "chooseCategory", payload: e.target.value })
      }
    >
      {options.map((option, index) => (
        <option key={index} value={values[index]}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
