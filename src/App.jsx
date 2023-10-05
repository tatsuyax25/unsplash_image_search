import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import './index.css';

const App = () => {
  const searchInput = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchInput.current.value);
  }

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control type="search" placeholder="Type something to search..." className="search-input" ref={searchInput} />
        </Form>
      </div>  
    </div>
  )
};

export default App;