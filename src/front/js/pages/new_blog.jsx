import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import "../../styles/blog_detail.css";

export const New_Blog = () => {
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState({
        type: 'recipe', // Valor predeterminado
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/new_blog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Blog created successfully:", data);
                navigate("/blog"); // Redireccionar a la lista de blogs tras la creación exitosa
            } else {
                const errorData = await response.json();
                console.error("Failed to create blog:", errorData);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCancel = () => {
        navigate("/blog"); // Redirigir a la lista de blogs si se cancela
    };

    return (
        <div className="blog-detail-container-bg">
            <div className="blog-detail-container position-relative">
                <div className="blog-detail-left">
                    <div className="image-container">
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
                                <div className="edit-blog-form-static fondo-blanco">
                                    <strong>Type:</strong>
                                </div>
                                <select name="type" className="form-control-title edit-blog-form" value={formData.type} onChange={handleChange}>
                                    <option value="recipe">Recipe</option>
                                    <option value="news">News</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <div className="edit-blog-form-static fondo-blanco">
                                    <strong>Image:</strong>
                                </div>
                                <input
                                    type="text"
                                    name="img_header"
                                    className="form-control-title edit-blog-form"
                                    value={formData.img_header}
                                    onChange={handleChange}
                                    placeholder="Header Image URL"
                                />
                            </div>
                            <div className="form-group">
                                <div className="edit-blog-form-static fondo-blanco">
                                    <strong>Title:</strong>
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control-title edit-blog-form"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                />
                            </div>
                            <div className="form-group">
                                <div className="edit-blog-form-static fondo-blanco">
                                    <strong>Source:</strong>
                                </div>
                                <input
                                    type="text"
                                    name="source"
                                    className="form-control-title edit-blog-form "
                                    value={formData.source}
                                    onChange={handleChange}
                                    placeholder="Source"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="blog-detail-right">
                    <div className="blog-detail-text">
                        <div className="form-group">
                        <div className="edit-blog-form-static">
                                    <strong>Introduction:</strong>
                                </div>
                            <textarea
                                name="text_intro"
                                className="edit-blog-form"
                                value={formData.text_intro}
                                onChange={handleChange}
                                placeholder="Introduction"
                            />
                        </div>

                        {formData.type === "recipe" ? (
                            <>
                                <div className="form-group">
                                <div className="edit-blog-form-static">
                                    <strong>Ingredients:</strong>
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
                                    <strong>Steps:</strong>
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
                        ) : (
                            <div className="form-group">
                                <div className="edit-blog-form-static">
                                    <strong>Text:</strong>
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
                    </div>

                    <div className="blog-detail-btn-container">
                        <button className="btn btn-primary ml-3 blog-detail-btn2" onClick={handleSaveClick}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button className="btn btn-danger ml-3 blog-detail-btn2" onClick={handleCancel}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
