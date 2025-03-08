import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Container = () => {
  const [items, setItems] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3002/postitems")
      .then(response => {
        const products = response?.data?.data;
        const categoryItems = {};

        for (let item of products) {
          let category = item.category;

          if (!categoryItems[category]) {
            categoryItems[category] = [];
          }

          categoryItems[category].push(item);
        }

        setItems(categoryItems);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-10">
  <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">
    Categories
  </h1>

  {Object.keys(items).length > 0 ? (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Object.entries(items).map(([category, itemList]) => (
        <li
          key={category}
          className="bg-white rounded-lg border shadow-lg hover:shadow-2xl hover:border-green-400 transition-shadow duration-300 overflow-hidden cursor-pointer"
          
        >
          <div className="p-4">
          <p className="text-xl font-semibold text-gray-800 mt-2 capitalize">
              {category}
            </p>
            <img
              src={itemList[0]?.image || "https://via.placeholder.com/150"}
              alt={itemList[0]?.name || "Item image"}
              className="w-full h-64 object-contain bg-gray-100 rounded-lg mt-5"
            />
            
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-green-600 mt-2 cursor-pointer mt-4"
              onClick={() => navigate(`category/${category}`, { state: { itemList } })}
            >
              View More
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-600">No items found.</p>
  )}
</div>
 
  );
};

export default Container;




