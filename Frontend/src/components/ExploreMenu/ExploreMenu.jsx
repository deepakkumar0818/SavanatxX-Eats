import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <div className="explore-menu-header">
        <h1>Explore Our Menu</h1>
        <p className='explore-menu-text'>
          Choose from a diverse menu featuring a delicious array of dishes crafted with the finest ingredients and culinary expertise.
        </p>
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? 'all' : item.menu_name)} 
              key={index} 
              className={`explore-menu-list-item ${category === item.menu_name ? 'active' : ''}`}
            >
              <div className="menu-item-img-wrapper">
                <img src={item.menu_image} alt={item.menu_name} />
              </div>
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
