// GymPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Review from './Review';
//gymId is the index of gymArray
// const gymArray = [
//     {gymName: 'Fred', rating: 5, renown: 5, location: '123 Main St', description: "lorem ipsum", distance: '1m', price: '$5', programs: 'cardio, amateur', reviews: ["great", "bad", "amazing"]},
//     {gymName: 'Bobbys', rating: 5, renown: 5, location: '143 Main St', description: "lorem ipsum", distance: '1m', price: '$10', programs: 'amateur', reviews: ["flames", "bad", "amazing"]},
//     {gymName: 'Ace', rating: 5, renown: 5, location: '12 Main St', description: "carti", distance: '1m',  price: '$1', programs: 'amateur', reviews: ["sucks", "bad", "amazing"]},
//     {gymName: 'Canelos', rating: 5, renown: 5, location: '1 Main St', description: "reggi", distance: '1m', price: '$10000', programs: 'amateur', reviews: ["overpriced", "bad", "amazing"]},
//   ];
// //gymId is the index of gymReviews
//   const gymReviews = [
//     [{user:"user0", review: "awesome", rating:5}, {user:"user1", review: "bad", rating:1}],
//     [{user:"fredagain", review: "sluttty", rating: 3}],
//     [{user:"lean", review: "nig", rating: 3}],
//     [{user:"slime", review: "asldkjaslkd", rating: 3}]
//   ]
  
// function GymPage() {

//   let { gymId } = useParams(); // Retrieve the gymId parameter from URL

//   // Fetch gym details based on gymId and render
//   return (
//     <div>
//       <h2>Gym Details</h2>
//       <p>{gymArray[gymId].gymName}</p>
//       <p>Rating: {gymArray[gymId].rating}</p>
//       <p>Renown: {gymArray[gymId].renown}</p>
//       <p>Description: {gymArray[gymId].description}</p>
//       <p>Location: {gymArray[gymId].location}</p>
//       <p>Distance: {gymArray[gymId].distance}</p>
//       <p>Price: {gymArray[gymId].price}</p>
//       <p>Programs: {gymArray[gymId].programs}</p>
//       <p>Reviews:</p>
//       <ul className="gymList">
//         {gymReviews[gymId].map((item, index) => (
//           <li key={index}>
//             <Review
//             user = {item.user}
//             review = {item.review}
//             rating = {item.rating}
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default GymPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Review from './Review';

function GymPage() {
  const { gymId } = useParams(); // Retrieve the gymId parameter from URL
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch('http://localhost:3001/yelp-data');
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await response.json();
        setGymData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGymData();
  }, [gymId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!gymData) return <div>No data available</div>;
  console.log(gymData);
  return (
    <div>
      <h2>Gym Details</h2>
      <p>Name: {gymData.name}</p>
      <p>Rating: {gymData.rating}</p>
      <p>Location: {gymData.location.display_address}</p>
      <p>Description: {gymData.description}</p>
      <p>Phone: {gymData.phone}</p>
      <p>Price: {gymData.price}</p>
      {/* <p>Reviews:</p>
      <ul className="gymList">
        {gymData.reviews.map((review, index) => (
          <li key={index}>
            <Review
              user={review.user.name}
              review={review.text}
              rating={review.rating}
            />
          </li>
        ))} */}
      {/* </ul> */}
    </div>
  );
}

export default GymPage;
