import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/CreateInterview.css";
function CreateInterview() {

    const navigate = useNavigate();

    const [interview, setInterview] = useState({
        role: "",
        experience: "",
        difficulty: "",
        technology: "",
        number_of_questions: 5
    });

    const handleChange = (e) => {
        setInterview({
            ...interview,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                role: interview.role,
                experience: interview.experience,
                difficulty: interview.difficulty,
                technology: interview.technology
                    .split(",")
                    .map((tech) => tech.trim()),
                number_of_questions: Number(interview.number_of_questions)
            };

            const res = await API.post(
                "/interview/create",
                payload
            );

            alert("Interview Created Successfully");

            console.log(res.data);

            navigate(`/interview/${res.data.interview_id}`);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to create interview"
            );

        }

    };

    return (
 <div className="page-container">
        <div className="create-interview-container">


            <h1>Create Interview</h1>

            <form onSubmit={handleSubmit}>

    <label>Target Role</label>
    <input
        name="role"
        placeholder="e.g., Java Developer, Data Analyst"
        value={interview.role}
        onChange={handleChange}
        required
    />


    <label>Experience Level</label>
    <input
        name="experience"
        placeholder="e.g., Fresher, 0-1 Years, 2 Years"
        value={interview.experience}
        onChange={handleChange}
        required
    />


    <label>Interview Difficulty</label>
    <select
        name="difficulty"
        value={interview.difficulty}
        onChange={handleChange}
        required
    >
        <option value="">Select Difficulty Level</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
    </select>


    <label>Technology / Skills</label>
    <input
        name="technology"
        placeholder="e.g., Java, Spring Boot, MySQL"
        value={interview.technology}
        onChange={handleChange}
        required
    />


    <label>Number of Questions</label>
    <input
        type="number"
        name="number_of_questions"
        placeholder="Enter number of questions (1-20)"
        value={interview.number_of_questions}
        onChange={handleChange}
        min="1"
        max="20"
        required
    />


    <button type="submit"
   >
        Start Interview
    </button>

</form>

        </div>
</div>
    );
}

export default CreateInterview;