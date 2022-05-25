import { postAjax } from "../http";
import axios from "axios";



const getInitiation = async (initiationId) => {
  const initiationResult = await axios.get(
    `http://localhost:2020/data/initiation/?initiationId=${initiationId}`
  );
  return initiationResult.data;
};

export { getInitiation };
