/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Products } from './components/Products';
import { Users } from './components/Users';
import { Search } from './components/Search';

const getCategoryById = id => {
  return categoriesFromServer.find(category => category.id === id);
};

const getUserById = id => {
  return usersFromServer.find(user => user.id === id);
};

const products = productsFromServer.map(product => {
  const category = getCategoryById(product.categoryId); // find by product.categoryId
  const user = category ? getUserById(category.ownerId) : null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

const getFilteredProducts = (
  allProducts,
  activeUserId,
  query,
  selectedCategory,
) => {
  let filtered = allProducts;

  if (activeUserId) {
    filtered = filtered.filter(product => product.user.id === activeUserId);
  }

  if (query) {
    const trimmedQuery = query.trim().toLowerCase();

    filtered = filtered.filter(product => {
      return product.name.toLowerCase().includes(trimmedQuery);
    });
  }

  if (selectedCategory.length > 0) {
    filtered = filtered.filter(product => {
      return selectedCategory.includes(product.category.id);
    });
  }

  return filtered;
};

export const App = () => {
  const [activeUserId, setActiveUserId] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setselectedCategory] = useState([]);

  const visibleProducts = getFilteredProducts(
    products,
    activeUserId,
    query,
    selectedCategory,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <Users
                activeUserId={activeUserId}
                setActiveUserId={setActiveUserId}
              />
            </p>

            <div className="panel-block">
              <Search query={query} setQuery={setQuery} />
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategory.length > 0,
                })}
                onClick={e => {
                  e.preventDefault();
                  setselectedCategory([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={cn('button', 'mr-2', 'my-1', {
                      'is-info': selectedCategory.includes(category.id),
                    })}
                    href="#/"
                    onClick={e => {
                      e.preventDefault();
                      setselectedCategory(prev => {
                        if (prev.includes(category.id)) {
                          return prev.filter(id => id !== category.id);
                        } else {
                          return [...prev, category.id];
                        }
                      });
                    }}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className={cn('button', 'is-link', 'is-fullwidth', {
                  'is-outlined':
                    query === '' &&
                    activeUserId === '' &&
                    selectedCategory.length === 0,
                })}
                onClick={() => {
                  setQuery('');
                  setActiveUserId('');
                  setselectedCategory([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <Products visibleProducts={visibleProducts} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
