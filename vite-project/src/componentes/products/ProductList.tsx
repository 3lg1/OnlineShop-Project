import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useAppContext } from "../../context/AppContext";

type CartItem = {
  id: string;
  title: string;
  price: string;
  quantity: number;
  img: string;
};

type ProductData = {
  id: string;
  img: string;
  title: string;
  description: string;
  price: string;
  tags: string[];
  filterTags: string[];
  rating?: number;
  discount?: string;
  isNew?: boolean;
};

const filters = [
  { key: "all", label: "Të gjitha" },
  { key: "hidratim", label: "Hidratim" },
  { key: "pastrim", label: "Pastrim" },
  { key: "natyral", label: "Natyral" },
  { key: "discount", label: "Oferta" },
  { key: "parfum", label: "Parfume" },
];

export default function ProductList() {
  const { productdata } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase() || "";

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);

  // Shopping cart state with persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartAnimation, setCartAnimation] = useState("");

  // Persist cartItems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart function
  const addToCart = (product: ProductData) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.img,
            quantity: 1,
          },
        ];
      }
    });

    setIsCartOpen(true);
    setCartAnimation("pulse");
    setTimeout(() => setCartAnimation(""), 500);
  };

  // Remove from cart function
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update quantity function
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return sum + itemPrice * item.quantity;
  }, 0);

  // Handle checkout navigation
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Shporta juaj është bosh!");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems,
        totalPrice,
        totalItems,
      },
    });

    setIsCartOpen(false);
  };

  // Filter and sort products when query, filter or sort changes
  useEffect(() => {
    let result = [...productdata];

    if (query) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedFilter !== "all") {
      if (selectedFilter === "discount") {
        result = result.filter((product) => product.discount);
      } else {
        result = result.filter(
          (product) =>
            Array.isArray(product.filterTags) &&
            product.filterTags.some((tag) =>
              tag.toLowerCase().includes(selectedFilter)
            )
        );
      }
    }

    if (sortOption === "price-low") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceA - priceB;
      });
    } else if (sortOption === "price-high") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceB - priceA;
      });
    } else if (sortOption === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [query, selectedFilter, sortOption, productdata]);

  return (
    <div className="product-list-container">
      {/* Header with cart icon */}
      <div className="cart-header">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className={`cart-button ${cartAnimation ? cartAnimation : "normal"}`}
          aria-label="Toggle shopping cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </button>
      </div>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="cart-drawer" role="dialog" aria-modal="true">
            <div className="cart-header-section">
              <h2 className="cart-title">Shporta ({totalItems})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="close-cart-button"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon" aria-hidden="true">
                    🛒
                  </div>
                  <p>Shporta juaj është bosh</p>
                </div>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h4 className="cart-item-title">{item.title}</h4>
                        <div className="cart-item-price">{item.price}</div>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="quantity-button"
                          aria-label={`Reduce quantity of ${item.title}`}
                        >
                          -
                        </button>
                        <span className="quantity-text" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="quantity-button"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-item-button"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Totali:</span>
                  <span style={{ fontWeight: "bold" }}>
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="cart-actions">
                  <button onClick={clearCart} className="clear-cart-button">
                    Pastro
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="checkout-button"
                    disabled={cartItems.length === 0}
                  >
                    Vazhdo në Arkë
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Overlay when cart is open */}
          <div
            className="cart-overlay"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />
        </>
      )}

      {/* Search results heading */}
      {query && (
        <div className="search-results-heading">
          <h2 className="search-results-title">
            Rezultatet e kërkimit për:{" "}
            <span className="search-query">{query}</span>
          </h2>
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="filter-sort-container">
        {/* Category filters */}
        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`filter-button ${
                selectedFilter === filter.key ? "active" : "inactive"
              }`}
              aria-pressed={selectedFilter === filter.key}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort options */}
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">
            Rendit sipas:
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">Parazgjedhur</option>
            <option value="price-low">Çmimi: I ulët - I lartë</option>
            <option value="price-high">Çmimi: I lartë - I ulët</option>
            <option value="rating">Vlerësimi</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card-container">
              <ProductCard
                id={product.id}
                img={product.img}
                title={product.title}
                description={product.description}
                price={product.price}
                tags={product.tags}
                filterTags={product.filterTags}
                rating={product.rating}
                discount={product.discount}
                isNew={product.isNew}
                onAddToCart={() => addToCart(product)}
              />
            </div>
          ))
        ) : (
          <div className="no-products-found">
            <div className="no-products-emoji" aria-hidden="true">
              😕
            </div>
            <h3 className="no-products-title">Nuk u gjet asnjë produkt</h3>
            <p className="no-products-message">
              Nuk u gjet asnjë produkt për: <strong>{query}</strong>
              {selectedFilter !== "all" && (
                <>
                  {" "}
                  me filtrin: <strong>{selectedFilter}</strong>
                </>
              )}
            </p>
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSortOption("default");
              }}
              className="reset-filters-button"
            >
              Reset Filtrave
            </button>
          </div>
        )}
      </div>

      {/* Product count */}
      {filteredProducts.length > 0 && (
        <div className="product-count">
          Duke shfaqur {filteredProducts.length} produkte nga{" "}
          {productdata.length}
        </div>
      )}
    </div>
  );
}

// import { useLocation, Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import ProductCard from "./ProductCard";
// import "./ProductList.css";
// import { useAppContext } from "../../context/AppContext";

// type CartItem = {
//   id: string;
//   title: string;
//   price: string;
//   quantity: number;
//   img: string;
// };

// type ProductData = {
//   id: string;
//   img: string;
//   title: string;
//   description: string;
//   price: string;
//   tags: string[];
//   filterTags: string[];
//   rating?: number;
//   discount?: string;
//   isNew?: boolean;
// };

// const filters = [
//   { key: "all", label: "Të gjitha" },
//   { key: "hidratim", label: "Hidratim" },
//   { key: "pastrim", label: "Pastrim" },
//   { key: "natyral", label: "Natyral" },
//   { key: "discount", label: "Oferta" },
//   { key: "parfum", label: "Parfume" },
// ];

// export default function ProductList() {
//   const { productdata } = useAppContext();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const query = searchParams.get("q")?.toLowerCase() || "";

//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [sortOption, setSortOption] = useState("default");
//   const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);

//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartAnimation, setCartAnimation] = useState("");

//   const addToCart = (product: ProductData) => {
//     setCartItems((prev) => {
//       const exists = prev.find((item) => item.id === product.id);
//       if (exists) {
//         return prev.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [
//           ...prev,
//           {
//             id: product.id,
//             title: product.title,
//             price: product.price,
//             img: product.img,
//             quantity: 1,
//           },
//         ];
//       }
//     });
//     setIsCartOpen(true);
//     setCartAnimation("pulse");
//     setTimeout(() => setCartAnimation(""), 500);
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       setCartItems((prev) => prev.filter((item) => item.id !== id));
//     } else {
//       setCartItems((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, quantity } : item))
//       );
//     }
//   };

//   const clearCart = () => setCartItems([]);

//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   const totalPrice = cartItems.reduce((sum, item) => {
//     const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
//     return sum + price * item.quantity;
//   }, 0);

//   useEffect(() => {
//     let result = [...productdata];

//     if (query) {
//       result = result.filter(
//         (p) =>
//           p.title.toLowerCase().includes(query) ||
//           p.description.toLowerCase().includes(query) ||
//           p.tags.some((tag) => tag.toLowerCase().includes(query))
//       );
//     }

//     if (selectedFilter !== "all") {
//       if (selectedFilter === "discount") {
//         result = result.filter((p) => p.discount);
//       } else {
//         result = result.filter(
//           (p) =>
//             p.filterTags &&
//             p.filterTags.some((tag) =>
//               tag.toLowerCase().includes(selectedFilter)
//             )
//         );
//       }
//     }

//     if (sortOption === "price-low") {
//       result.sort(
//         (a, b) =>
//           parseFloat(a.price.replace(/[^0-9.]/g, "")) -
//           parseFloat(b.price.replace(/[^0-9.]/g, ""))
//       );
//     } else if (sortOption === "price-high") {
//       result.sort(
//         (a, b) =>
//           parseFloat(b.price.replace(/[^0-9.]/g, "")) -
//           parseFloat(a.price.replace(/[^0-9.]/g, ""))
//       );
//     } else if (sortOption === "rating") {
//       result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     }

//     setFilteredProducts(result);
//   }, [query, selectedFilter, sortOption, productdata]);

//   return (
//     <div className="product-list-container">
//       {/* Cart Header */}
//       <div className="cart-header">
//         <button
//           onClick={() => setIsCartOpen(!isCartOpen)}
//           className={`cart-button ${cartAnimation || "normal"}`}
//         >
//           🛒{" "}
//           {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
//         </button>
//       </div>

//       {/* Cart Drawer */}
//       {isCartOpen && (
//         <>
//           <div className="cart-drawer">
//             <div className="cart-header-section">
//               <h2>Shporta ({totalItems})</h2>
//               <button
//                 onClick={() => setIsCartOpen(false)}
//                 className="close-cart-button"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="cart-items-container">
//               {cartItems.length === 0 ? (
//                 <p>Shporta juaj është bosh</p>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     <img
//                       src={item.img}
//                       alt={item.title}
//                       className="cart-item-image"
//                     />
//                     <div className="cart-item-details">
//                       <h4>{item.title}</h4>
//                       <div>{item.price}</div>
//                     </div>
//                     <div className="cart-item-actions">
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity - 1)
//                         }
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity + 1)
//                         }
//                       >
//                         +
//                       </button>
//                       <button onClick={() => updateQuantity(item.id, 0)}>
//                         ×
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             {cartItems.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">
//                   <span>Totali:</span> <strong>€{totalPrice.toFixed(2)}</strong>
//                 </div>
//                 <div className="cart-actions">
//                   <button onClick={clearCart} className="clear-cart-button">
//                     Pastro
//                   </button>
//                   <Link to="/checkout" className="checkout-button">
//                     Vazhdo në Arkë
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
//         </>
//       )}

//       {/* Filters */}
//       <div className="filter-sort-container">
//         <div className="filter-buttons">
//           {filters.map((filter) => (
//             <button
//               key={filter.key}
//               onClick={() => setSelectedFilter(filter.key)}
//               className={`filter-button ${
//                 selectedFilter === filter.key ? "active" : ""
//               }`}
//             >
//               {filter.label}
//             </button>
//           ))}
//         </div>
//         <div className="sort-container">
//           <label>Rendit sipas:</label>
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//           >
//             <option value="default">Parazgjedhur</option>
//             <option value="price-low">Çmimi: I ulët - I lartë</option>
//             <option value="price-high">Çmimi: I lartë - I ulët</option>
//             <option value="rating">Vlerësimi</option>
//           </select>
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="product-grid">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               {...product}
//               onAddToCart={() => addToCart(product)}
//             />
//           ))
//         ) : (
//           <div className="no-products-found">
//             <p>
//               😕 Nuk u gjet asnjë produkt për:{" "}
//               <strong>{query || selectedFilter}</strong>
//             </p>
//             <button
//               onClick={() => {
//                 setSelectedFilter("all");
//                 setSortOption("default");
//               }}
//             >
//               Reset Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Product Count */}
//       {filteredProducts.length > 0 && (
//         <div className="product-count">
//           Duke shfaqur {filteredProducts.length} produkte nga{" "}
//           {productdata.length}
//         </div>
//       )}
//     </div>
//   );
// }
