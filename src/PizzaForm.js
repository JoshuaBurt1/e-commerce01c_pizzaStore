import React, { useState, useEffect } from 'react';

const PizzaOrder = () => {
  const [price, setPrice] = useState('');
  const [items, setItems] = useState([0, 0, 0, 0]);
  const [toppingArray, setToppingArray] = useState([]);
  const [toppingListC] = useState([
    "none : $0",
    "olive : $1",
    "pepper : $2",
    "pineapple : $2",
    "ham : $3",
    "pepperoni : $3",
    "bacon : $4",
    "extra cheese : $5",
  ]);
  const [sizeList] = useState([
    "none : $0",
    "small : $10",
    "medium : $12",
    "large : $15",
    "extra large : $20",
    "panzerotti : $14",
  ]);
  const [dipList] = useState([
    "none : $0",
    "jalapeno : $0.50",
    "habanero : $0.50",
    "ghost pepper : $0.50",
    "ranch : $0.50",
    "three cheese : $0.50",
    "sweet & sour : $0.50",
    "plum : $0.50",
  ]);
  const [sideList] = useState([
    "none : $0",
    "chicken wings : $10",
    "chicken bites : $12",
    "garlic bread : $6",
    "cheese bread : $7",
    "mozarella sticks : $8",
    "apple pie : $4",
  ]);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedDip, setSelectedDip] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [message, setMessage] = useState('');

  // Use useEffect to call addSize when selectedSize changes
  useEffect(() => {
    const addSize = () => {
      const selectedSizeArray = selectedSize.split(" : $");
      setItems((prevItems) => [Number(selectedSizeArray[1]), ...prevItems.slice(1, 4)]);
    };
    addSize();
  }, [selectedSize]);

  const addToppingC = () => {
    const newToppingArray = [];
    for (let i = 0; i < toppingListC.length; i++) {
      if (document.getElementById(i.toString()).checked) {
        newToppingArray.push(" " + document.getElementById(i.toString()).value);
      }
    }

    const toppingSum = newToppingArray.reduce((acc, topping) => {
      const priceMatch = topping.match(/\$([\d.]+)/);
      return acc + (priceMatch ? parseFloat(priceMatch[1]) : 0);
    }, 0);

    setItems((prevItems) => [prevItems[0], toppingSum, ...prevItems.slice(2)]);
    setToppingArray(newToppingArray);
  };

  useEffect(() => {
    const addDip = () => {
      const selectedDipArray = selectedDip.split(" : $");
      setItems((prevItems) => [prevItems[0], prevItems[1], Number(selectedDipArray[1]), prevItems[3]]);
    };
    addDip();
  }, [selectedDip]);
  
  
  useEffect(() => {
    const addSide = () => {
      const selectedSideArray = selectedSide.split(" : $");
      setItems((prevItems) => [prevItems[0], prevItems[1], prevItems[2], Number(selectedSideArray[1])]);
    };
    addSide();
  }, [selectedSide]);

  const viewOrder = () => {
    let sum = 0;
    if (!selectedCustomer) {
      setMessage("Please enter your name");
    } else if (!selectedSize) {
      setMessage("Please select a size");
    } else if (toppingArray.length === 0) {
      setMessage("Please select a topping");
    } else if (!selectedDip) {
      setMessage("Please select a dip");
    } else if (!selectedSide) {
      setMessage("Please select a side");
    } else {
      setMessage("");
      // Debugging logs
      console.log("Before sum calculation: ", sum);
      console.log("Before items update: ", items);
      for (let i = 0; i < items.length; i += 1) {
        sum += items[i];
      }
      // Debugging logs
      console.log("After sum calculation: ", sum);
      console.log("After items update: ", items);
      if (sum === 0) {
        setMessage("You ordered nothing. Check your order and try again");
      } else {
        setMessage(`${selectedCustomer}'s order: a ${selectedSize} pizza with${toppingArray} toppings, ${selectedDip} dip, & ${selectedSide} side.`);
        setPrice("Total cost: $" + sum);
        // Debugging log
        console.log("Final sum: ", sum);
      }
    }
  };

  const enterOrder = () => {
    const pizzaCostArray = items.slice(0, 4);
    console.log(pizzaCostArray);

    const orderItems = pizzaCostArray.map((cost, index) => ({
      id: index + 1,
      name: index === 0 ? "Pizza Size" : index === 1 ? "Topping" : index === 2 ? "Dip" : "Side",
      priceInCents: cost * 100,
      quantity: 1,
    }));

    console.log(orderItems);

    fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: orderItems,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error("Client-side error:", e);
      });
  };

  const clearOrder = () => {
  toppingListC.forEach((checkBox, index) => {
    document.getElementById(index.toString()).checked = false;
  });
  setSelectedCustomer('');
  setSelectedSize('');
  setToppingArray([]);
  setSelectedDip('');
  setSelectedSide('');
  setMessage('');
  setPrice('');
  setItems([0, 0, 0, 0]);
};

  return (
    <div className="container1">
      <form id="pizzaForm" className="left-aligned-form" onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        enterOrder(); // Call the enterOrder function
        }}
        >
        <header className="mb-4">
          <h2 className="header-text">Cult of Personality Pizza</h2>
        </header>

        {/* Part 3: Pizza options */}
        <div className="mb-3">
          <label htmlFor="customerSelect" className="form-label">Enter customer name</label>
          <input
            type="text"
            className="form-control"
            id="customerSelect"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="sizeSelect" className="form-label">Select Size</label>
          <select
            className="form-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            name="pizzaSize"
          >
            <option value="" disabled>
              Please choose...
            </option>
            {sizeList.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div id="toppingSelectC" className="mb-3">
          <label className="form-label">Select Toppings</label><br />
          {toppingListC.map((topping, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={topping.toLowerCase()}
                id={index}
                onClick={addToppingC}
              />
              <label htmlFor={index}>{topping}</label><br />
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="dipSelect" className="form-label">Select Dip</label>
          <select
            className="form-select"
            value={selectedDip}
            onChange={(e) => {
              setSelectedDip(e.target.value);
            }}
            name="pizzaDip"
          >
            <option value="" disabled>
              Please choose...
            </option>
            {dipList.map((dip) => (
              <option key={dip} value={dip}>
                {dip}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="sideSelect" className="form-label">Select Side</label>
          <select
            className="form-select"
            value={selectedSide}
            onChange={(e) => {
              setSelectedSide(e.target.value);
            }}
            name="pizzaSide"
          >
            <option value="" disabled>
              Please choose...
            </option>
            {sideList.map((side) => (
              <option key={side} value={side}>
                {side}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="mb-3">
          <button type="button" className="view-button" onClick={viewOrder}>
            View Order
          </button>
          <button type="reset" className="clear-button" onClick={clearOrder}>
            Clear
          </button>
          <button type="submit" className="checkout-button">
            Checkout
          </button>
        </div>

        {/* Messages */}
        <p className="message-text">{message}</p>
        <p className="price-text">{price}</p>
      </form>
    </div>
  );
};

export default PizzaOrder;