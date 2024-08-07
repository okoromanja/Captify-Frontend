import  { useState } from "react";
import Footer from "../../components/layout/footer/Footer";

const ContactForm = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Event handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  return (
    <>
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="hidden lg:block bg-black text-white md:p-8 rounded-lg shadow-lg ml-4 -mt-20">
        <h3 className="text-3xl font-bold mb-4">Contact Information</h3>
        <p className="mb-4">
          <strong>Email:</strong> captify@example.com
        </p>
        <p className="mb-4">
          <strong>Phone:</strong> (123) 456-7890
        </p>
        <p>
          <strong>Address:</strong> 123 Demo Street, Demo City, Country
        </p>
      </div>
      <div className="bg-[#242323] text-white p-8 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 md:ml-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-[#A100FF] py-3 w-full" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
      <Footer/>
    
    </>
  );
};

export default ContactForm;
