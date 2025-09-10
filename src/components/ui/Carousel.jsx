import React, { useRef, useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Update active index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const slideWidth = carouselRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / slideWidth);
        setActiveIndex(newIndex);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle broken image by setting fallback
  const handleImageError = (e) => {
   return  e.target.src = "https://static.thenounproject.com/png/2932881-200.png";
  };

  return (
    <div className="relative w-full border rounded-lg py-2  ">
      <div
        ref={carouselRef}
        className="carousel flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {images.map((image, index) => (
          <div
            key={`carousel-item-${index}`}
            className="carousel-item flex-none snap-center w-full max-w-sm"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[180px] object-contain rounded-lg"
              loading="lazy"

            />
          </div>
        ))}
      </div>
      {/* Add custom CSS to hide scrollbar in Webkit browsers */}
      <style>
        {`
          .carousel::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}
      </style>

      {images.length > 1 && (
        <>
          <button
            onClick={() => scroll("prev")}
            className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("next")}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`w-2 h-2 rounded-full focus:outline-none ${
                activeIndex === index ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollTo({
                    left: carouselRef.current.offsetWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;