// import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Category = () => {
    const location = useLocation();

    const navigate = useNavigate();
    const item = location.state?.itemList || []; // Ensure itemList is an array
    const { head } = useParams();

    return (
        <>
            <Header />
<div className="container mx-auto p-10">
  {/* <h1 className="text-3xl text-center font-bold mb-8 text-gray-800 capitalize">
    {category} Items
  </h1> */}

  {Array.isArray(item) && item.length > 0 ? (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {item.map((items) => (
        <li
          key={items.id || items.title}
          className="bg-white rounded-lg border shadow-lg hover:shadow-2xl hover:border-green-500 transition-shadow duration-300 overflow-hidden cursor-pointer"
          onClick={() => navigate(`/${items.title}`, { state: items })}
        >
          <img
            className="w-full h-64 object-contain bg-gray-100"
            src={items.image || "https://via.placeholder.com/150"}
            alt={items.title || "Item image"}
          />
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800">{items.title || "No Title"}</h3>
            <p className="text-sm text-gray-600 mt-1">{items.description || "No description available."}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-bold text-gray-800">
                Price: ${items.price || "N/A"}
              </span>
              <p className="text-lg font-medium text-gray-800">
                Rating: {items.rating?.rate || "N/A"} ⭐
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-600">No items found for this category.</p>
  )}
</div>
<Footer />
        </>
    );
};

export default Category;


