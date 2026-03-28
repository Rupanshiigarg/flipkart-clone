import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts, getCategories } from '../../api/products'
import ProductCard from '../../components/ProductCard/ProductCard'
import './ProductList.css'

function ProductList() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Fetch products based on search/category
    const params = {}
    if (search) params.search = search
    if (category) params.category = category

    Promise.all([getProducts(params), getCategories()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes)
        setCategories(categoriesRes)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, category])

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>
  if (error) return <div className="error-msg">{error}</div>

  const activeCategory = categories.find(c => c.slug === category)

  return (
    <div className="container product-list-page page">
      <div className="list-layout">
        {/* Sidebar Filters */}
        <aside className="list-sidebar card">
          <div className="filter-header">
            <h3>Filters</h3>
          </div>
          <div className="filter-section">
            <h4>CATEGORIES</h4>
            <ul>
              <li>
                <Link to="/products" className={!category ? 'active' : ''}>
                  All Categories
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                    className={category === cat.slug ? 'active' : ''}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="list-main">
          <div className="list-header card">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              {activeCategory && (
                <>
                  <span> &gt; </span>
                  <Link to={`/products?category=${activeCategory.slug}`}>{activeCategory.name}</Link>
                </>
              )}
            </div>
            <h1>
              {search
                ? `Showing results for "${search}"`
                : activeCategory
                ? activeCategory.name
                : 'All Products'}
              <span className="count-text">({products.length} products)</span>
            </h1>
          </div>

          {products.length === 0 ? (
            <div className="empty-state card">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <Link to="/products" className="btn btn-blue">Clear all filters</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
