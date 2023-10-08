// Import necessary libraries and styles
import axios from 'axios'; // For making API requests
import { useCallback, useEffect, useRef, useState } from 'react'; // React hooks
import { Button, Form } from 'react-bootstrap'; // Bootstrap UI components
import './index.css'; // Custom CSS styles

// Define constants for the API and pagination
const API_URL = 'https://api.unsplash.com/search/photos'; // API endpoint
const IMAGES_PER_PAGE = 20; // Numeber of images to fetch per page

// Define the main App component
const App = () => {
  // Create references and state variables using React hooks
  const searchInput = useRef(null); // Reference to the search input element
  const [images, setImages] = useState([]); // State to store fetched images
  const [page, setPage] = useState(1); // State to mange the current page
  const [totalPages, setTotalPages] = useState(0); // State to store the total number of pages
  const [loading, setLoading] = useState(false); // State to track loading status
  const [errorMsg, setErrorMsg] = useState(''); // State to store error message

  // Define a function to fetch images from the API using Axios
  const fetchImages = useCallback(async () => {
    try {
      // Check if there's a value in the search input
      if (searchInput.current.value) {
        setErrorMsg(''); // Clear any previous error message
        setLoading(true); // Set loading to true while fetching data
        const { data } = await axios.get(
          // Send a GET request to the API with search parameters
        `${API_URL}?query=${
          searchInput.current.value
        }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
      );
      // Update the state with the fetched images and total pages
      setImages(data.results);
      setTotalPages(data.total_pages);
      setLoading(false); // Set loading back to false when data is fetched
      }
    } catch (error) {
      // Handle errors by setting an error message and logging the error
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false); // Set loading back to false on error
    }
  }, [page]);

  // Use the useEffect hook to fetch images when the component mounts or when fetchImages changes
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Function to reset the search and fetch new results
  const resetSearch = () => {
    setPage(1); // Reset the page to the first page
    fetchImages(); // Fetch images with the updated search and page
  };

  // Function to handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission
    resetSearch(); // Reset the search and fetch new results
  };

  // Function to handle selecting a category from filters
  const handleSelection = (selection) => {
    searchInput.current.value = selection; // Set the search input value to the selected category
    resetSearch(); // Reset the search and fetch new results
  };

  console.log('page', page); // Log the current page

  // Render the component with HTML and conditional rendering based on loading and error states
  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      {errorMsg && <p className='error'>{errorMsg}</p>}
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput} // Attach the ref to the input element
          />
        </Form>
      </div>
      <div className='filters'>
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('shoes')}>Shoes</div>
      </div>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          <div className='images'>
            {images.map((image) => (
              // Display the fetched images as img elements
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className='image'
              />
            ))}
          </div>
          <div className='buttons'>
            {page > 1 && (
              // Display "Previous" button if not on the first page
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              // Display "Next" button if not on the last page
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App; // Export the App component as the default export