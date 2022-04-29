import { postAjax } from "../http";
import axios from "axios";

const getInitiation = (initiationId) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/initiation",
      { initiationId: initiationId },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

export { getInitiation };
