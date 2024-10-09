import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "../../styles/all_blogs.css";

export const All_Blogs = props => {
    const { store, actions } = useContext(Context);
    const [blogs, setBlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const scrollRef = useRef(null); 

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/blog");
                const data = await response.json();
                
                const sortedBlogs = data.data.sort((a, b) => a.title.localeCompare(b.title));
                
                setBlogs(sortedBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        const checkAdminStatus = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/check_admin", {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });
                const data = await response.json();
                setIsAdmin(data.is_admin);
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        fetchBlogs();
        checkAdminStatus();
    }, [store.token]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    return (
        <div className="container all-blogs-container">
            <h1 className="display-4 mb-4 all-blogs-big-title">Blog</h1>
            <div className="d-flex align-items-center align-control">
                <div className="arrows-control">
                <button className="arrow-button" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                </div>
                <div className="overflow-control" ref={scrollRef}>
                    <div className="d-flex">
                        {blogs.map(blog => (
                            <div key={blog.id} className="card all-blogs-card">
                                <Link to={`/blog/${blog.type}/${blog.id}`} className="stretched-link">
                                    <img src={blog.img_header} className="card-img-top" alt={blog.title} />
                                    <div className="card-img-overlay">
                                        <h5 className="card-title all-blogs-title">
                                            {blog.title}
                                        </h5>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="arrow-button" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            {isAdmin && (
                <Link to="/new_blog" className="btn btn-secondary mt-3 all-blogs-btn">
                    New Blog
                </Link>
            )}
        </div>
    );
};

All_Blogs.propTypes = {
    match: PropTypes.object
};
