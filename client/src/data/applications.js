import axios from "axios";

const submitApplication = async (state) => {
  const result = await axios.post(
    "http://localhost:2020/data/applications/submit-application",
    { data: state }
  );
  return result;
};

export { submitApplication };
