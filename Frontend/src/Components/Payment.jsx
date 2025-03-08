import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";
import PaymentSection from "../Components/Paymentsection";

const Payment = () => {
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [payment, setPayment] = useState(false);

  useEffect(() => {
    const storedid = localStorage.getItem("id");
    axios.get("http://localhost:3002/addressget")
      .then((response) => {
        const addressData = response?.data?.data || [];
        setAddress(addressData.filter((item) => item.id == storedid));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const storedid = localStorage.getItem("id");
    axios.get("http://localhost:3002/getcartitems")
      .then((response) => {
        const cartdata = response?.data?.data || [];
        const filteredCart = cartdata.filter(item => item.id === storedid);
        setCart(filteredCart);
        
        // Update price details when cart changes
        const subtotal = filteredCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const delivery = subtotal > 0 ? 50 : 0; // Example: ₹50 delivery charge if subtotal > 0
        setSubtotalAmount(subtotal);
        setDeliveryCharges(delivery);
        setTotalAmount(subtotal + delivery);
        setTotalItems(filteredCart.length);
      })
      .catch((error) => console.log("Error getting data : ", error));
  }, []);

  const handleSelectionChange = (event) => setSelectedAddress(event.target.value);
  const deleteItem = async (index) => {
    try {
      const itemToRemove = cart[index];
      const response = await axios.delete(`http://localhost:3002/deletedata/${itemToRemove._id}`);
      if (response.status === 200) {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);

        // Recalculate price details after deletion
        const subtotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const delivery = subtotal > 0 ? 50 : 0;
        setSubtotalAmount(subtotal);
        setDeliveryCharges(delivery);
        setTotalAmount(subtotal + delivery);
        setTotalItems(updatedCart.length);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-8 px-10 py-8 justify-center bg-gray-100 min-h-screen">
        {/* Left Section */}
        <div className="flex flex-col w-full lg:w-2/3 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-xl font-semibold text-gray-800">Delivery Address</h1>
            <select
              className="border p-3 mt-3 w-full rounded-lg cursor-pointer focus:ring focus:ring-blue-400"
              value={selectedAddress}
              onChange={handleSelectionChange}
            >
              <option value="">Select an address</option>
              {address.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}, {item.address}, {item.locality}, {item.city}-{item.pincode}
                </option>
              ))}
            </select>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-xl font-semibold text-gray-800">Order Summary</h1>
            <div className="space-y-4 mt-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm transition-transform hover:scale-105">
                  <img src={item.image} alt={item.title} className="w-24 h-24 rounded-md object-cover" />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                  <button onClick={() => deleteItem(index)} className="text-red-500 hover:text-red-700 transition-colors">✖</button>
                </div>
              ))}
              <button
                className={`w-full p-3 text-white font-semibold rounded-xl transition-transform ${cart.length > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"}`}
                onClick={() => setPayment(true)}
                disabled={cart.length === 0}
              >
                Proceed To Buy
              </button>
            </div>
          </div>

          {/* Payment Section */}
          {payment ? <PaymentSection /> : <h1 className="text-lg font-semibold bg-blue-500 text-white p-3 rounded-xl text-center">Payment</h1>}
        </div>

        {/* Right Section - Price Details */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold">Price Details</h1>
          <div className="mt-4 space-y-3 text-lg">
            <p className="flex justify-between"><span>Total Items:</span> {totalItems}</p>
            <p className="flex justify-between"><span>Subtotal:</span> ₹{subtotalAmount}</p>
            <p className="flex justify-between"><span>Delivery Charges:</span> ₹{deliveryCharges}</p>
            <hr className="border-gray-300" />
            <p className="flex justify-between text-xl font-bold text-green-600">
              <span>Grand Total:</span> ₹{totalAmount}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
