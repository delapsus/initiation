import { postAjax } from "./http";
import axios from "axios";

const getPeople = async (state) => {
  const peopleResult = await axios.get(
    `http://localhost:2020/data/people?pageSize=${state.pageSize}&index=${state.pageIndex}&textSearch=${state.searchText}&degreeId=${state.degreeId}&sortBy=${state.sortBy}`
  );
  return peopleResult.data;
};

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

const submitMergePerson = (masterPersonId, slavePersonId) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/merge-person",
      { masterPersonId: masterPersonId, slavePersonId: slavePersonId },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

const getPerson = async (personId) => {
  const personResult = await axios.get(
    `http://localhost:2020/data/person?personId=${personId}`
  );
  return personResult.data;
};

const getLocation = (locationId) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/location",
      { locationId: locationId },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

const getLocationWithData = (locationId) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/location-with-data",
      { locationId: locationId },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

const getPersonWithData = (personId) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/person-with-data",
      { personId: personId },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

const submitEditPerson = (person) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/submit-edit-person",
      { person: person },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

const submitEditLocation = (location) => {
  return new Promise((resolve, reject) => {
    postAjax(
      "http://localhost:2020/data/submit-edit-location",
      { location: location },
      (result) => {
        result = JSON.parse(result);
        resolve(result);
      }
    );
  });
};

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

export {
  getPeople,
  submitApplication,
  submitMergePerson,
  getPerson,
  getLocation,
  getLocationWithData,
  getPersonWithData,
  submitEditPerson,
  submitEditLocation,
  getInitiation,
};
