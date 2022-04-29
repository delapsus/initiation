import { postAjax } from "../http";
import axios from "axios";

const submitApplication = (state) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/submit-application",
      { data: state },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

export { submitApplication };
