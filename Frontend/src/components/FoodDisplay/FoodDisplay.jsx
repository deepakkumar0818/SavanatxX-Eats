import { useContext } from 'react';
import { Link } from 'react-router-dom';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, limit = 8 }) => {
  const { food_list } = useContext(StoreContext);

  // Filter dishes by category
  const filteredDishes = food_list.filter(item => 
    category === 'all' || category === item.category
  );

  // Limit the number of dishes to display
  const displayedDishes = filteredDishes.slice(0, limit);
  const hasMoreDishes = filteredDishes.length > limit;

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>{category === 'all' ? 'Top Dishes Near You' : category}</h2>
        <span className="dishes-count">{filteredDishes.length} dishes</span>
      </div>
      
      <div className='food-display-list'>
        {displayedDishes.map((item, index) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            rating={item.rating}
            reviews={item.reviews}
            deliveryTime={item.deliveryTime}
            isVeg={item.isVeg}
            isBestseller={item.isBestseller}
            isNew={item.isNew}
            offer={item.offer}
            status={item.status}
          />
        ))}
      </div>

      {hasMoreDishes && (
        <div className="food-display-footer">
          <Link to="/menu" className="see-all-btn">
            See All Dishes
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
