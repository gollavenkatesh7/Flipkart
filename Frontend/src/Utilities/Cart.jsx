import { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [perce, setPercent] = useState(0);
  const [before, setBefore] = useState(0);
  const [toItems, setItems] = useState(0);
  const [isLogged, setLoggedIn] = useState(false);

  // const cartLength = localStorage.setItem("cartLength",setCart.length);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const storedid = localStorage.getItem("id");
    if (isLogged) {
      axios
        .get("http://localhost:3002/getcartitems")
        .then((response) => {
          const cartdata = response?.data?.data || [];
          const userCart = cartdata.filter(item => item.id === storedid)
          updateTotal(userCart);
          setCart(userCart);
        })
        .catch((error) => {
          console.log("Error getting data : ", error);
        });
    }
  }, [isLogged]);

  const deleteItem = async (index) => {
    const itemToRemove = cart[index];
    try {
      const response = await axios.delete(
        `http://localhost:3002/deletedata/${itemToRemove._id}`
      );
      if (response.status === 200) {
        const updatedItems = cart.filter((_, i) => i !== index);
        setCart(updatedItems);
        updateTotal(updatedItems);
      } else {
        console.error("Failed to remove item. Response:", response);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleIncrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity < 10) {
      updatedCart[index].quantity += 1;
      setCart(updatedCart);
      updateTotal(updatedCart);
    }
  };

  const handleDecrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
      updateTotal(updatedCart);
    }
  };

  const updateTotal = (updatedCart) => {
    const amount = updatedCart.reduce((curr, item) => curr + item.price * item.quantity, 0);
    const totalQuant = updatedCart.reduce((curr, item) => curr + item.quantity, 0);
    setBefore(amount);
    setItems(totalQuant);
    if (amount > 1000) {
      setTotal(amount);
      setPercent(0);
    } else {
      if (amount > 0 && amount <= 1000) {
        let price = (50 / 100) * 100;
        let totalAmount = amount + price;
        setTotal(totalAmount);
        setPercent(price);
      } else {
        setTotal(0);
        setPercent(0);
      }
    }
  };

  const goToOrders = () => {
    navigate("/orders")
  }
  const goToCheckout = () => {
      if(total>0){
        navigate("/payment")
      }else{
        alert("Please add items to the Cart")
      }
  }
  const goToLogin = () => {
    navigate("/login");
  };
  const goToAddress = () => {
    navigate("/address");
  };
  localStorage.setItem("before",before);
  localStorage.setItem("perce",perce);
  localStorage.setItem("total",total);
  localStorage.setItem("toItems",toItems);

  return (
    <>
      <Header cartItemCount={cart.length} />
<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-2">
  {!isLogged ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-blue-800">
        Please Login To Access Your Cart
      </h1>
      <button
        onClick={goToLogin}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  ) : (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Your Shopping Cart
      </h2>

      {/* Left Side Cart Items */}
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-lg flex items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-1/4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-contain rounded-lg"
                />
              </div>
              <div className="w-2/4 pl-6">
                <p className="text-2xl font-semibold text-gray-800">{item.title}</p>
                <div className="mt-4 text-lg flex items-center">
                  <span className="mr-4">Quantity:</span>
                  <button
                    onClick={() => handleDecrement(index)}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(index)}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg text-gray-600 mt-2">
                  Price: <span className="font-medium">₹{item.price}</span>
                </p>
                <p className="text-lg text-gray-800 mt-2">
                  Subtotal: <span className="font-bold">₹{item.price * item.quantity}</span>
                </p>
              </div>
              <div className="w-1/4 flex justify-end">
                <button
                  onClick={() => deleteItem(index)}
                  className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary on the Right Side */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-3">Order Summary</h1>
          <div className="text-lg font-semibold space-y-2">
            <p className="flex justify-between">
              <span>Total Amount:</span> ₹{before}
            </p>
            <p className="flex justify-between">
              <span>Total Items:</span> {toItems}
            </p>
            <p className="flex justify-between">
              <span>Delivery Charges:</span> ₹{perce}
            </p>
            <hr className="border-gray-300 my-2" />
            <p className="flex justify-between text-xl font-bold">
              <span>Grand Total:</span> ₹{total}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-full mt-4 py-2 bg-black text-white rounded-lg hover:bg-green-800 transition" onClick={goToAddress}>
              Fill Your Address
            </button>
            <button className="w-full mt-4 py-2 bg-black text-white rounded-lg hover:bg-green-800 transition" onClick={goToCheckout}>
              Place Order
            </button>
          </div>
          <button className="w-full mt-4 py-2 bg-black text-white rounded-lg hover:bg-green-800 transition" onClick={goToOrders}>
            Your Orders
          </button>
        </div>
      </div>
    </div>
  )}
</div>
<Footer />

    </>
  );
};

export default Cart;



