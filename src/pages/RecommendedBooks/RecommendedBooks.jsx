
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Component/Loading/Loading';

export default function Book() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8); // Number of books per page
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order (asc or desc)

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    axios.get('https://www.dbooks.org/api/recent')
      .then(({ data: { books } }) => {
        setBooks(books);
      })
      .catch((err) => { console.log(err) });
  }

  // Sort books by title
  const sortedBooks = books.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change sorting order
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <>
      <div className='container mb-5 mt-5 pb-5'>
        <h2 className='text-center mb-5'>Recommended Books</h2>

        {/* Sorting Dropdown */}
        <div className="d-flex justify-content-end mb-3">
          <label className="mr-2">Sort by:</label>
          <select value={sortOrder} onChange={handleSortChange} className="form-control w-auto">
            <option value="asc">Title: A to Z</option>
            <option value="desc">Title: Z to A</option>
          </select>
        </div>

        <div className="row">
          {currentBooks.length ? currentBooks.map((book) => (
            <div key={book.id} className="col-md-3 my-5">
              <Link className='text-decoration-none' to={`.././details/${book.id}`}>
                <img className="h-100 w-100" src={book.image} alt="" />
                <h1
                  className="text-truncate h6 text-center mt-1 text-success"
                  data-toggle="tooltip"
                  data-placement="start"
                  title={book.title ? book.title : "Unknown"}
                >
                  {book.title ? book.title : "Unknown"}
                </h1>
              </Link>
            </div>
          )) : <Loading />}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            booksPerPage={booksPerPage}
            totalBooks={books.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </>
  );
}

// Pagination Component
const Pagination = ({ booksPerPage, totalBooks, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
// import React from 'react'
// import Loading from '../../Component/Loading/Loading'
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function RecommendedBooks() {
//   let num = new Array(3).fill().map((item, i) => i + 1);

//   let [books, setBooks] = useState([]);
//   let [page, setPage] = useState(0); // نبدأ الصفحة من 0
//   const booksPerPage = 8; // عدد الكتب المعروضة في كل صفحة

//   // استدعاء البيانات عند تحميل المكون
//   useEffect(() => {getData();}, []);

//   // دالة لجلب البيانات من API
//   async function getData() {
//     axios.get('https://www.dbooks.org/api/recent')
//       .then(({ data: { books } }) => {
//         setBooks(books);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // دالة لتحديد الكتب التي سيتم عرضها حسب الصفحة الحالية
//   const getPaginatedBooks = () => {
//     let startIndex = (page * booksPerPage) % books.length;
//     let endIndex = startIndex + booksPerPage;

//     // إعادة التدوير من البداية إذا تجاوزنا عدد الكتب
//     if (endIndex > books.length) {
//       return [...books.slice(startIndex), ...books.slice(0, endIndex % books.length)];
//     } else {
//       return books.slice(startIndex, endIndex);
//     }
//   };

//   return (
//     <>
//       <div className='container mb-5 mt-5 pb-5'>
//         <h2 className='text-center mb-5'>Recommended Books</h2>
//         <div className="row">
//           {books.length ? getPaginatedBooks().map((book) => (
//             <div key={book.id} className="col-md-3 my-5">
//               <Link className='text-decoration-none' to={`/RecommendedBooks/${book.id}`}>
//                 <img className="h-100 w-100" src={book.image} alt="" />
//                 <h1 className="text-truncate h6 text-center mt-1 text-success" title={book.title}>
//                   {book.title || "Unknown"}
//                 </h1>
//               </Link>
//             </div>
//           )) : <Loading />}
//         </div>

//         <nav aria-label="...">
//           <ul className="pagination pagination-md d-flex justify-content-center">
//             {num.map((item, i) => (
//               <li
//                 key={i}
//                 className="page-item"
//                 onClick={() => {
//                   setPage(i);
//                   console.log(`Page: ${item}`);
//                 }}
//               >
//                 <a className="page-link" href="#">
//                   {item}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// }
