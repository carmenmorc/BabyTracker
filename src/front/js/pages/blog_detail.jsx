import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import "../../styles/blog_detail.css";

export const BlogDetail = () => {
    const { type, id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es administrador
    const [formData, setFormData] = useState({
        title: '',
        img_header: '',
        img_final: '',
        source: '',
        text_intro: '',
        text_ingredients: '',
        text_steps: '',
        text: ''
    });

    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}api/blog/${type}/${id}`);
                const data = await response.json();
                if (data.msg === 'OK') {
                    setBlog(data.data);
                    setFormData({
                        title: data.data.title,
                        img_header: data.data.img_header,
                        img_final: data.data.img_final || '',
                        source: data.data.source,
                        text_intro: data.data.text_intro || '',
                        text_ingredients: data.data.text_ingredients || '',
                        text_steps: data.data.text_steps || '',
                        text: data.data.text || ''
                    });
                } else {
                    console.error("Blog not found");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkAdminStatus = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}api/check_admin`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });
                const data = await response.json();
                setIsAdmin(data.is_admin); // Actualiza el estado de isAdmin
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        fetchBlog();
        checkAdminStatus();
    }, [type, id, store.token]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/edit_blog/${type}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    type,
                    ...formData
                })
            });

            if (response.ok) {
                const data = await response.json();
                setBlog(data.data);
                setIsEditing(false);
                navigate('/blog');
            } else {
                const errorData = await response.json();
                console.error("Failed to update blog:", errorData);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>Blog not found</div>;
    }

    return (
        <div className="blog-detail-container-bg">
            <div className="blog-detail-container">
                <div className="blog-detail-left">
                    <div className="image-container">
                        {isEditing ? (
                            <div className="blog-detail-container position-relative">
                                {formData.img_header && (
                                    <img
                                        src={formData.img_header}
                                        className="img-header position-absolute"
                                        alt="Header Preview"
                                        style={{
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            zIndex: -1
                                        }}
                                    />
                                )}
                                <div className="form-control-izq-blog">
                                    <div className="form-group">
                                        <div className="edit-blog-form-static blanco">
                                            <strong>IMAGE:</strong>
                                        </div>
                                        <input
                                            type="text"
                                            name="img_header"
                                            className="form-control-title mt-2 edit-blog-form"
                                            value={formData.img_header}
                                            onChange={handleChange}
                                            placeholder="Header Image URL"
                                            style={{ position: 'relative', zIndex: 1 }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="edit-blog-form-static blanco">
                                            <strong>TITLE:</strong>
                                        </div>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control-title mt-2 edit-blog-form"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Title"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="edit-blog-form-static blanco">
                                            <strong>SOURCE:</strong>
                                        </div>
                                        <input
                                            type="text"
                                            name="source"
                                            className="form-control-title mt-2 edit-blog-form"
                                            value={formData.source}
                                            onChange={handleChange}
                                            placeholder="Source"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img src={blog.img_header} className="img-header" alt={blog.title} style={{ width: '100%', zIndex: -1 }} />
                                <div className="blog-detail-overlay">
                                    <h1>{blog.title}</h1>
                                    <p><strong><FontAwesomeIcon icon={faTag} /></strong> {blog.source}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="blog-detail-right">
                    <div className="blog-detail-text">
                        {isEditing ? (
                            <>
                                {type === "recipe" && (
                                    <>
                                        <div className="form-group">
                                            <div className="edit-blog-form-static">
                                                <strong>INTRO:</strong>
                                            </div>
                                            <textarea
                                                name="text_intro"
                                                className="edit-blog-form"
                                                value={formData.text_intro}
                                                onChange={handleChange}
                                                placeholder="Introduction"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="edit-blog-form-static">
                                                <strong>INGREDIENTS:</strong>
                                            </div>
                                            <textarea
                                                name="text_ingredients"
                                                className="edit-blog-form-receta"
                                                value={formData.text_ingredients}
                                                onChange={handleChange}
                                                placeholder="Ingredients"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="edit-blog-form-static">
                                                <strong>STEPS:</strong>
                                            </div>
                                            <textarea
                                                name="text_steps"
                                                className="edit-blog-form"
                                                value={formData.text_steps}
                                                onChange={handleChange}
                                                placeholder="Steps"
                                            />
                                        </div>
                                    </>
                                )}
                                {type === "news" && (
                                    <div className="form-group">
                                        <div className="edit-blog-form-static">
                                            <strong>MAIN CONTENT:</strong>
                                        </div>
                                        <textarea
                                            name="text"
                                            className="edit-blog-form"
                                            value={formData.text}
                                            onChange={handleChange}
                                            placeholder="Main Content"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {blog.text_intro && <p>{blog.text_intro}</p>}
                                {blog.text_ingredients && <div className="blog-detail-text-ingredients"><strong>Ingredients:</strong> {blog.text_ingredients}</div>}
                                {blog.text_steps && <p>{blog.text_steps}</p>}
                                {blog.text && <p>{blog.text}</p>}
                            </>
                        )}
                    </div>

                    <div className="blog-detail-btn-container">
                        <Link to="/blog" className="btn btn-secondary mt-3 blog-detail-btn">➜</Link>

                        {isAdmin && (
                    isEditing ? (
                        <>
                            <button className="btn btn-primary ml-3 blog-detail-btn2" onClick={handleSaveClick}>
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button className="btn btn-danger ml-3 blog-detail-btn2" onClick={handleCancelEdit}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary ml-3 blog-detail-btn2" onClick={handleEditClick}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    )
                )}
                    </div>
                </div>
            </div>
        </div>
    );
};
