import axios from "axios";

const getPeople = async (state) => {
  const peopleResult = await axios.get(
    `http://localhost:2020/data/people?pageSize=${state.pageSize}&index=${state.pageIndex}&textSearch=${state.searchText}&degreeId=${state.degreeId}&sortBy=${state.sortBy}`
  );
  return peopleResult.data;
};

const submitMergePerson = async (masterPersonId, slavePersonId) => {
  const result = await axios.post(
    "http://localhost:2020/data/people/merge-person",
    { masterPersonId: masterPersonId, slavePersonId: slavePersonId }
  );
  return result.data;
};

const getPerson = async (personId) => {
  const personResult = await axios.get(
    `http://localhost:2020/data/people/person?personId=${personId}`
  );
  return personResult.data;
};

const getPersonWithData = async (personId) => {
  const personResult = await axios.get(
    `http://localhost:2020/data/people/person-with-data?personId=${personId}`
  );
  return personResult.data;
};

const submitEditPerson = async (person) => {
  const result = await axios.post(
    "http://localhost:2020/data/people/submit-edit-person",
    { person: person }
  );
  return result.data;
};

export {
  getPeople,
  submitMergePerson,
  getPerson,
  getPersonWithData,
  submitEditPerson,
};
