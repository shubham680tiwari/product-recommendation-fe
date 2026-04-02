import { Menu, ShoppingCart, X } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { cartAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import './NavBar.css'

const NavBar = ({onSearchClick, onCartClick}) => {
    const { cart } = useCart;
    const { user } = useUser;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='navbar-logo'>
                    <h2>ShopSmart</h2>
                </div>
            </div>

            <div className='navbar-menu'>
                <button className='nav-link' onClick={()=> window.location.href = '/'}>
                    Home
                </button>
                <button className='nav-link' onClick={onSearchClick}>
                    Search
                </button>
                <button className='nav-link'>
                    Recommendations
                </button>
            </div>

            <div className='navbar-right'>
                <div className='user-info'>
                    <span className='user-name'>{user?.name} || "Guest"</span>
                </div>
                <button className='cart-button' onClick={onCartClick}>
                    <ShoppingCart size={24} />
                    {cartAPI.totalItem > 0 && (
                        <span className='cart-badge'>{cartAPI.totalItem}</span>
                    )}
                </button>
                <button
                className='mobile-menu-btn'
                onClick={()=> setMobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {mobileMenuOpen && (
               <div className="mobile-menu">
                    <button className="mobile-nav-link">Home</button>
                    <button className="mobile-nav-link" onClick={onSearchClick}>
                        Search
                    </button>
                    <button className="mobile-nav-link">Recommendations</button>
                </div> 
            )}
        </nav>
    );
};

export default NavBar;