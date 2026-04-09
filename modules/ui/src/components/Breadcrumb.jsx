import React from 'react';
import { Link } from 'react-router-dom';
import { TYPOGRAPHY } from '../constants/uiConstants.js';

const Breadcrumb = ({ items }) => {
  return (
    <nav 
      className="flex items-center space-x-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] mb-6"
      style={{ fontFamily: TYPOGRAPHY.TECH }}
    >
      <Link 
        to="/" 
        className="text-foreground/40 hover:text-secondary transition-colors"
      >
        HOME
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-foreground/20">/</span>
          {item.path ? (
            <Link 
              to={item.path} 
              className="text-foreground/40 hover:text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-secondary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
