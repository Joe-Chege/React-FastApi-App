import React, { useState, useEffect } from "react";
import api from "./api";

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [transactions, setTransactions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [formData, setformData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: ""
  });

  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setformData({
      ...formData,
      [event.target.name]: value
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);  

    try {
      await api.post("/transactions/", formData);
      fetchTransactions();
      setformData({
        amount : "",
        category :  "",
        description : "",
        is_income : false,
        date : ""
      });
    } catch (error) {
      if (error.response) {
        console.log("Response Error", error.response.data);
      } else if (error.request) {
        console.log("Request Error", error.request);
      } else {
        console.log("Unexpected Error", error.message);
      }
    }
  }
  return (
    <div>
    <nav className="navbar-dark bg-primary">
      <div className="container-fluid">
          <a className='navbar-brand' href= "/#">
            Invent App
          </a>
      </div>
    </nav>
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div className='mb-3 mt-3'>
          <label htmlFor='amount' className='form-label'>
            Amount
          </label>
          <input type='text' className='form-control' id='amount' name='amount' value={formData.amount} onChange={handleChange} />

            </div>
            <div className='mb-3'>
              <label htmlFor='category' className='form-label'>
                Category
              </label>
              <input type='text' className='form-control' id='category' name='category' value={formData.category} onChange={handleChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor='description' className='form-label'>
                Description
              </label>
              <input type='text' className='form-control' id='description' name='description' value={formData.description} onChange={handleChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor='is_income' className='form-label'>
                Is Income
              </label>
              <input type='checkbox' className='form-check-input' id='is_income' name='is_income' checked={formData.is_income} onChange={handleChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor='date' className='form-label'>
                Date
              </label>
              <input type='date' className='form-control' id='date' name='date' value={formData.date} onChange={handleChange} />
            </div>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>


        </form>
        <table className='table table-stripped table-board table-hover'>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Is Income</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? "Yes" : "No"}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
  </div>
);
};

export default App;
