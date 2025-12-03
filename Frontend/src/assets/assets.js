import basket_icon from './basket_icon.png'
import logo from './logo.png'
import header_img from './header_img.png'
import search_icon from './search_icon.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'

import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls",
        menu_image: menu_2
    },
    {
        menu_name: "Deserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Cake",
        menu_image: menu_5
    },
    {
        menu_name: "Pure Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta",
        menu_image: menu_7
    },
    {
        menu_name: "Noodles",
        menu_image: menu_8
    }]

export const restaurant_list = [
    {
        _id: "r1",
        name: "The Italian Kitchen",
        image: food_25,
        coverImage: food_27,
        rating: 4.5,
        reviews: 1240,
        deliveryTime: "25-30 min",
        cuisines: ["Italian", "Pasta", "Pizza"],
        priceForTwo: 40,
        distance: "1.2 km",
        offer: "20% OFF up to $5",
        isVeg: false,
        isPureVeg: false,
        isPromoted: true
    },
    {
        _id: "r2",
        name: "Spice Garden",
        image: food_21,
        coverImage: food_23,
        rating: 4.3,
        reviews: 890,
        deliveryTime: "30-35 min",
        cuisines: ["Indian", "North Indian", "Biryani"],
        priceForTwo: 30,
        distance: "2.5 km",
        offer: "FREE DELIVERY",
        isVeg: false,
        isPureVeg: false,
        isPromoted: false
    },
    {
        _id: "r3",
        name: "Green Leaf Veg",
        image: food_1,
        coverImage: food_2,
        rating: 4.6,
        reviews: 2100,
        deliveryTime: "20-25 min",
        cuisines: ["Pure Veg", "Salads", "Healthy"],
        priceForTwo: 25,
        distance: "0.8 km",
        offer: "30% OFF",
        isVeg: true,
        isPureVeg: true,
        isPromoted: true
    },
    {
        _id: "r4",
        name: "Dragon Wok",
        image: food_29,
        coverImage: food_31,
        rating: 4.2,
        reviews: 756,
        deliveryTime: "25-30 min",
        cuisines: ["Chinese", "Asian", "Noodles"],
        priceForTwo: 35,
        distance: "1.8 km",
        offer: "15% OFF",
        isVeg: false,
        isPureVeg: false,
        isPromoted: false
    },
    {
        _id: "r5",
        name: "Burger Barn",
        image: food_13,
        coverImage: food_15,
        rating: 4.4,
        reviews: 1560,
        deliveryTime: "15-20 min",
        cuisines: ["American", "Burgers", "Fast Food"],
        priceForTwo: 28,
        distance: "0.5 km",
        offer: "BUY 1 GET 1",
        isVeg: false,
        isPureVeg: false,
        isPromoted: true
    },
    {
        _id: "r6",
        name: "Sweet Delights",
        image: food_17,
        coverImage: food_19,
        rating: 4.7,
        reviews: 3200,
        deliveryTime: "20-25 min",
        cuisines: ["Desserts", "Cakes", "Ice Cream"],
        priceForTwo: 20,
        distance: "1.0 km",
        offer: "",
        isVeg: true,
        isPureVeg: true,
        isPromoted: false
    },
    {
        _id: "r7",
        name: "Roll House",
        image: food_5,
        coverImage: food_7,
        rating: 4.1,
        reviews: 620,
        deliveryTime: "20-25 min",
        cuisines: ["Rolls", "Wraps", "Street Food"],
        priceForTwo: 22,
        distance: "1.5 km",
        offer: "FLAT $3 OFF",
        isVeg: false,
        isPureVeg: false,
        isPromoted: false
    },
    {
        _id: "r8",
        name: "Thai Express",
        image: food_29,
        coverImage: food_30,
        rating: 4.4,
        reviews: 945,
        deliveryTime: "30-35 min",
        cuisines: ["Thai", "Asian", "Seafood"],
        priceForTwo: 45,
        distance: "3.0 km",
        offer: "FREE DELIVERY",
        isVeg: false,
        isPureVeg: false,
        isPromoted: true
    },
    {
        _id: "r9",
        name: "Sandwich Studio",
        image: food_13,
        coverImage: food_16,
        rating: 4.3,
        reviews: 1120,
        deliveryTime: "15-20 min",
        cuisines: ["Sandwiches", "Healthy", "Cafe"],
        priceForTwo: 18,
        distance: "0.6 km",
        offer: "25% OFF",
        isVeg: false,
        isPureVeg: false,
        isPromoted: false
    },
    {
        _id: "r10",
        name: "Royal Biryani House",
        image: food_22,
        coverImage: food_24,
        rating: 4.5,
        reviews: 2800,
        deliveryTime: "35-40 min",
        cuisines: ["Biryani", "Mughlai", "North Indian"],
        priceForTwo: 32,
        distance: "2.2 km",
        offer: "40% OFF up to $8",
        isVeg: false,
        isPureVeg: false,
        isPromoted: true
    },
    {
        _id: "r11",
        name: "Pasta Paradise",
        image: food_25,
        coverImage: food_28,
        rating: 4.6,
        reviews: 1890,
        deliveryTime: "25-30 min",
        cuisines: ["Italian", "Pasta", "Continental"],
        priceForTwo: 38,
        distance: "1.4 km",
        offer: "",
        isVeg: false,
        isPureVeg: false,
        isPromoted: false
    },
    {
        _id: "r12",
        name: "Veg Delight",
        image: food_23,
        coverImage: food_21,
        rating: 4.4,
        reviews: 1450,
        deliveryTime: "25-30 min",
        cuisines: ["Pure Veg", "Indian", "South Indian"],
        priceForTwo: 24,
        distance: "1.1 km",
        offer: "20% OFF",
        isVeg: true,
        isPureVeg: true,
        isPromoted: false
    }
]

export const food_list = [
    // ============ SALADS ============
    {
        _id: "1",
        name: "Greek Salad",
        image: food_1,
        price: 12,
        description: "Fresh cucumbers, tomatoes, olives, and feta cheese drizzled with olive oil and herbs",
        category: "Salad",
        rating: 4.5,
        reviews: 234,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "20% OFF"
    },
    {
        _id: "2",
        name: "Garden Veg Salad",
        image: food_2,
        price: 18,
        description: "A colorful mix of seasonal vegetables with house-made vinaigrette dressing",
        category: "Salad",
        rating: 4.3,
        reviews: 156,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "3",
        name: "Clover Salad",
        image: food_3,
        price: 16,
        description: "Tender clover greens with cherry tomatoes, nuts, and balsamic glaze",
        category: "Salad",
        rating: 4.1,
        reviews: 89,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "4",
        name: "Chicken Salad",
        image: food_4,
        price: 24,
        description: "Grilled chicken breast on fresh greens with avocado and creamy ranch dressing",
        category: "Salad",
        rating: 4.7,
        reviews: 412,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "FREE DELIVERY"
    },
    {
        _id: "33",
        name: "Caesar Salad",
        image: food_1,
        price: 14,
        description: "Crisp romaine lettuce, parmesan cheese, croutons with classic Caesar dressing",
        category: "Salad",
        rating: 4.4,
        reviews: 298,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: "15% OFF"
    },
    {
        _id: "34",
        name: "Mediterranean Salad",
        image: food_2,
        price: 15,
        description: "Quinoa, chickpeas, roasted peppers, and fresh herbs with lemon tahini dressing",
        category: "Salad",
        rating: 4.2,
        reviews: 167,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "35",
        name: "Asian Sesame Salad",
        image: food_3,
        price: 17,
        description: "Crispy noodles, edamame, mandarin oranges with sesame ginger dressing",
        category: "Salad",
        rating: 4.0,
        reviews: 134,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "36",
        name: "Caprese Salad",
        image: food_4,
        price: 19,
        description: "Fresh mozzarella, ripe tomatoes, basil leaves with extra virgin olive oil",
        category: "Salad",
        rating: 4.6,
        reviews: 245,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: ""
    },

    // ============ ROLLS ============
    {
        _id: "5",
        name: "Lasagna Rolls",
        image: food_5,
        price: 14,
        description: "Pasta sheets rolled with ricotta, spinach, and marinara sauce, baked to perfection",
        category: "Rolls",
        rating: 4.3,
        reviews: 187,
        deliveryTime: "30-35 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "6",
        name: "Peri Peri Rolls",
        image: food_6,
        price: 12,
        description: "Spicy peri peri chicken wrapped in soft tortilla with fresh vegetables",
        category: "Rolls",
        rating: 4.5,
        reviews: 356,
        deliveryTime: "20-25 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "25% OFF"
    },
    {
        _id: "7",
        name: "Chicken Rolls",
        image: food_7,
        price: 20,
        description: "Tender grilled chicken with lettuce, tomato, and garlic mayo in a warm wrap",
        category: "Rolls",
        rating: 4.6,
        reviews: 423,
        deliveryTime: "20-25 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "FREE DELIVERY"
    },
    {
        _id: "8",
        name: "Veg Rolls",
        image: food_8,
        price: 15,
        description: "Crispy vegetables and paneer wrapped with mint chutney and spices",
        category: "Rolls",
        rating: 4.2,
        reviews: 198,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "37",
        name: "Egg Roll",
        image: food_5,
        price: 11,
        description: "Fluffy scrambled eggs with onions and peppers in a flaky paratha",
        category: "Rolls",
        rating: 4.1,
        reviews: 145,
        deliveryTime: "15-20 min",
        isVeg: false,
        isBestseller: false,
        isNew: false,
        offer: "10% OFF"
    },
    {
        _id: "38",
        name: "Seekh Kebab Roll",
        image: food_6,
        price: 18,
        description: "Spiced minced meat kebabs with onions and green chutney in a soft wrap",
        category: "Rolls",
        rating: 4.7,
        reviews: 512,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "39",
        name: "Paneer Tikka Roll",
        image: food_7,
        price: 16,
        description: "Marinated cottage cheese cubes grilled and wrapped with tangy sauces",
        category: "Rolls",
        rating: 4.4,
        reviews: 267,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "40",
        name: "Fish Roll",
        image: food_8,
        price: 22,
        description: "Crispy fried fish fillet with coleslaw and tartar sauce in a warm roll",
        category: "Rolls",
        rating: 4.3,
        reviews: 178,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: false,
        isNew: true,
        offer: "FREE DELIVERY"
    },

    // ============ DESSERTS ============
    {
        _id: "9",
        name: "Ripple Ice Cream",
        image: food_9,
        price: 14,
        description: "Creamy vanilla ice cream swirled with rich chocolate ripples",
        category: "Deserts",
        rating: 4.4,
        reviews: 289,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "10",
        name: "Fruit Ice Cream",
        image: food_10,
        price: 22,
        description: "Refreshing mixed fruit ice cream made with real seasonal fruits",
        category: "Deserts",
        rating: 4.2,
        reviews: 156,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "11",
        name: "Jar Ice Cream",
        image: food_11,
        price: 10,
        description: "Artisanal layered ice cream with cookies and caramel in a mason jar",
        category: "Deserts",
        rating: 4.6,
        reviews: 378,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "30% OFF"
    },
    {
        _id: "12",
        name: "Vanilla Ice Cream",
        image: food_12,
        price: 12,
        description: "Classic Madagascar vanilla bean ice cream, smooth and creamy",
        category: "Deserts",
        rating: 4.3,
        reviews: 234,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "41",
        name: "Chocolate Brownie",
        image: food_9,
        price: 9,
        description: "Warm fudgy brownie topped with vanilla ice cream and chocolate sauce",
        category: "Deserts",
        rating: 4.8,
        reviews: 567,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "BUY 1 GET 1"
    },
    {
        _id: "42",
        name: "Tiramisu",
        image: food_10,
        price: 16,
        description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
        category: "Deserts",
        rating: 4.5,
        reviews: 312,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "43",
        name: "Cheesecake",
        image: food_11,
        price: 14,
        description: "New York style cheesecake with graham cracker crust and berry compote",
        category: "Deserts",
        rating: 4.7,
        reviews: 445,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "44",
        name: "Panna Cotta",
        image: food_12,
        price: 13,
        description: "Silky Italian cream dessert with fresh strawberry coulis",
        category: "Deserts",
        rating: 4.2,
        reviews: 178,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },

    // ============ SANDWICHES ============
    {
        _id: "13",
        name: "Chicken Sandwich",
        image: food_13,
        price: 12,
        description: "Grilled chicken breast with lettuce, tomato, and mayo on toasted bread",
        category: "Sandwich",
        rating: 4.4,
        reviews: 356,
        deliveryTime: "15-20 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "15% OFF"
    },
    {
        _id: "14",
        name: "Vegan Sandwich",
        image: food_14,
        price: 18,
        description: "Roasted vegetables, hummus, and avocado on multigrain bread",
        category: "Sandwich",
        rating: 4.1,
        reviews: 145,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "15",
        name: "Grilled Sandwich",
        image: food_15,
        price: 16,
        description: "Melted cheese with ham and tomatoes, perfectly grilled and crispy",
        category: "Sandwich",
        rating: 4.5,
        reviews: 289,
        deliveryTime: "15-20 min",
        isVeg: false,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "16",
        name: "Club Sandwich",
        image: food_16,
        price: 24,
        description: "Triple-decker with turkey, bacon, lettuce, tomato, and mayo",
        category: "Sandwich",
        rating: 4.6,
        reviews: 423,
        deliveryTime: "20-25 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "FREE DELIVERY"
    },
    {
        _id: "45",
        name: "BLT Sandwich",
        image: food_13,
        price: 13,
        description: "Crispy bacon, fresh lettuce, and ripe tomatoes with mayo on toast",
        category: "Sandwich",
        rating: 4.3,
        reviews: 234,
        deliveryTime: "15-20 min",
        isVeg: false,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "46",
        name: "Tuna Melt",
        image: food_14,
        price: 15,
        description: "Creamy tuna salad with melted cheddar cheese on grilled sourdough",
        category: "Sandwich",
        rating: 4.2,
        reviews: 167,
        deliveryTime: "15-20 min",
        isVeg: false,
        isBestseller: false,
        isNew: false,
        offer: "10% OFF"
    },
    {
        _id: "47",
        name: "Philly Cheesesteak",
        image: food_15,
        price: 21,
        description: "Thinly sliced beef with peppers, onions, and melted provolone",
        category: "Sandwich",
        rating: 4.7,
        reviews: 512,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "48",
        name: "Caprese Sandwich",
        image: food_16,
        price: 17,
        description: "Fresh mozzarella, tomatoes, basil with balsamic glaze on ciabatta",
        category: "Sandwich",
        rating: 4.4,
        reviews: 198,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },

    // ============ CAKES ============
    {
        _id: "17",
        name: "Cup Cake",
        image: food_17,
        price: 14,
        description: "Moist vanilla cupcake topped with colorful buttercream frosting",
        category: "Cake",
        rating: 4.3,
        reviews: 234,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "18",
        name: "Vegan Cake",
        image: food_18,
        price: 12,
        description: "Plant-based chocolate cake, rich and decadent without dairy",
        category: "Cake",
        rating: 4.1,
        reviews: 145,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "19",
        name: "Butterscotch Cake",
        image: food_19,
        price: 20,
        description: "Layered sponge cake with butterscotch cream and caramelized nuts",
        category: "Cake",
        rating: 4.6,
        reviews: 389,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "20% OFF"
    },
    {
        _id: "20",
        name: "Sliced Cake",
        image: food_20,
        price: 15,
        description: "Fresh fruit layered cake with whipped cream and seasonal berries",
        category: "Cake",
        rating: 4.4,
        reviews: 267,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "49",
        name: "Red Velvet Cake",
        image: food_17,
        price: 18,
        description: "Classic red velvet with cream cheese frosting and velvety texture",
        category: "Cake",
        rating: 4.8,
        reviews: 678,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "TRENDING"
    },
    {
        _id: "50",
        name: "Black Forest Cake",
        image: food_18,
        price: 22,
        description: "Chocolate layers with cherries, whipped cream, and chocolate shavings",
        category: "Cake",
        rating: 4.7,
        reviews: 534,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "51",
        name: "Carrot Cake",
        image: food_19,
        price: 16,
        description: "Spiced carrot cake with walnuts and cream cheese frosting",
        category: "Cake",
        rating: 4.3,
        reviews: 198,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "52",
        name: "Lemon Drizzle Cake",
        image: food_20,
        price: 14,
        description: "Zesty lemon sponge with tangy lemon glaze and candied lemon peel",
        category: "Cake",
        rating: 4.2,
        reviews: 156,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },

    // ============ PURE VEG ============
    {
        _id: "21",
        name: "Garlic Mushroom",
        image: food_21,
        price: 14,
        description: "Sautéed mushrooms in garlic butter with fresh herbs and crusty bread",
        category: "Pure Veg",
        rating: 4.4,
        reviews: 234,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "22",
        name: "Fried Cauliflower",
        image: food_22,
        price: 22,
        description: "Crispy battered cauliflower florets with spicy sriracha mayo dip",
        category: "Pure Veg",
        rating: 4.2,
        reviews: 178,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "23",
        name: "Mix Veg Pulao",
        image: food_23,
        price: 10,
        description: "Fragrant basmati rice cooked with colorful vegetables and aromatic spices",
        category: "Pure Veg",
        rating: 4.5,
        reviews: 345,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "25% OFF"
    },
    {
        _id: "24",
        name: "Rice Zucchini",
        image: food_24,
        price: 12,
        description: "Stuffed zucchini boats with herb rice and melted cheese topping",
        category: "Pure Veg",
        rating: 4.1,
        reviews: 134,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "53",
        name: "Paneer Butter Masala",
        image: food_21,
        price: 18,
        description: "Soft cottage cheese cubes in rich tomato and cashew cream gravy",
        category: "Pure Veg",
        rating: 4.7,
        reviews: 589,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "FREE DELIVERY"
    },
    {
        _id: "54",
        name: "Vegetable Biryani",
        image: food_22,
        price: 16,
        description: "Layered aromatic rice with mixed vegetables, saffron, and fried onions",
        category: "Pure Veg",
        rating: 4.6,
        reviews: 456,
        deliveryTime: "30-35 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "55",
        name: "Dal Makhani",
        image: food_23,
        price: 14,
        description: "Slow-cooked black lentils in creamy butter and tomato sauce",
        category: "Pure Veg",
        rating: 4.5,
        reviews: 378,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "56",
        name: "Palak Paneer",
        image: food_24,
        price: 17,
        description: "Cottage cheese cubes in creamy spinach gravy with Indian spices",
        category: "Pure Veg",
        rating: 4.4,
        reviews: 289,
        deliveryTime: "25-30 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: "15% OFF"
    },

    // ============ PASTA ============
    {
        _id: "25",
        name: "Cheese Pasta",
        image: food_25,
        price: 12,
        description: "Penne pasta smothered in four-cheese sauce with a crispy breadcrumb top",
        category: "Pasta",
        rating: 4.3,
        reviews: 267,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "26",
        name: "Tomato Pasta",
        image: food_26,
        price: 18,
        description: "Al dente spaghetti in San Marzano tomato sauce with fresh basil",
        category: "Pasta",
        rating: 4.2,
        reviews: 189,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "27",
        name: "Creamy Pasta",
        image: food_27,
        price: 16,
        description: "Fettuccine in rich parmesan cream sauce with garlic and white wine",
        category: "Pasta",
        rating: 4.5,
        reviews: 345,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "20% OFF"
    },
    {
        _id: "28",
        name: "Chicken Pasta",
        image: food_28,
        price: 24,
        description: "Grilled chicken with penne in creamy garlic parmesan sauce",
        category: "Pasta",
        rating: 4.6,
        reviews: 456,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "57",
        name: "Pesto Pasta",
        image: food_25,
        price: 17,
        description: "Fresh basil pesto with pine nuts, parmesan, and cherry tomatoes",
        category: "Pasta",
        rating: 4.4,
        reviews: 234,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "58",
        name: "Carbonara",
        image: food_26,
        price: 20,
        description: "Classic Roman pasta with pancetta, egg yolk, and pecorino cheese",
        category: "Pasta",
        rating: 4.7,
        reviews: 512,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "TRENDING"
    },
    {
        _id: "59",
        name: "Arrabiata Pasta",
        image: food_27,
        price: 15,
        description: "Spicy tomato sauce with garlic, red chilies, and fresh parsley",
        category: "Pasta",
        rating: 4.1,
        reviews: 156,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "60",
        name: "Seafood Pasta",
        image: food_28,
        price: 28,
        description: "Linguine with shrimp, mussels, and clams in white wine garlic sauce",
        category: "Pasta",
        rating: 4.5,
        reviews: 289,
        deliveryTime: "30-35 min",
        isVeg: false,
        isBestseller: false,
        isNew: true,
        offer: "FREE DELIVERY"
    },

    // ============ NOODLES ============
    {
        _id: "29",
        name: "Butter Noodles",
        image: food_29,
        price: 14,
        description: "Silky egg noodles tossed in brown butter with fresh herbs and parmesan",
        category: "Noodles",
        rating: 4.2,
        reviews: 178,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "30",
        name: "Veg Noodles",
        image: food_30,
        price: 12,
        description: "Stir-fried noodles with crispy vegetables in savory soy sauce",
        category: "Noodles",
        rating: 4.4,
        reviews: 312,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "15% OFF"
    },
    {
        _id: "31",
        name: "Somen Noodles",
        image: food_31,
        price: 20,
        description: "Thin Japanese wheat noodles served chilled with dipping sauce",
        category: "Noodles",
        rating: 4.3,
        reviews: 167,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: false,
        isNew: true,
        offer: ""
    },
    {
        _id: "32",
        name: "Cooked Noodles",
        image: food_32,
        price: 15,
        description: "Classic egg noodles with vegetables in aromatic garlic sauce",
        category: "Noodles",
        rating: 4.1,
        reviews: 145,
        deliveryTime: "15-20 min",
        isVeg: true,
        isBestseller: false,
        isNew: false,
        offer: ""
    },
    {
        _id: "61",
        name: "Pad Thai",
        image: food_29,
        price: 18,
        description: "Thai rice noodles with tofu, peanuts, bean sprouts, and tamarind sauce",
        category: "Noodles",
        rating: 4.6,
        reviews: 423,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: ""
    },
    {
        _id: "62",
        name: "Hakka Noodles",
        image: food_30,
        price: 16,
        description: "Indo-Chinese style noodles with vegetables in spicy schezwan sauce",
        category: "Noodles",
        rating: 4.5,
        reviews: 356,
        deliveryTime: "20-25 min",
        isVeg: true,
        isBestseller: true,
        isNew: false,
        offer: "20% OFF"
    },
    {
        _id: "63",
        name: "Ramen Bowl",
        image: food_31,
        price: 24,
        description: "Rich pork broth with wheat noodles, soft-boiled egg, and chashu pork",
        category: "Noodles",
        rating: 4.8,
        reviews: 634,
        deliveryTime: "25-30 min",
        isVeg: false,
        isBestseller: true,
        isNew: false,
        offer: "TRENDING"
    },
    {
        _id: "64",
        name: "Singapore Noodles",
        image: food_32,
        price: 19,
        description: "Curry-spiced rice vermicelli with shrimp, pork, and vegetables",
        category: "Noodles",
        rating: 4.4,
        reviews: 267,
        deliveryTime: "20-25 min",
        isVeg: false,
        isBestseller: false,
        isNew: true,
        offer: ""
    }
]
