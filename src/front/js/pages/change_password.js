import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/change_password.css";

export const Change_password = () => {
    const { store, actions } = useContext(Context);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/login');
        }
    }, [store.token, navigate]);  

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const result = await actions.changePassword(currentPassword, newPassword);
            if (result) {
                setMessage('Password updated successfully.');
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                navigate('/login');
            } else {
                setError('An error occurred while updating the password.');
                setMessage('');
            }
        } catch (err) {
            setError('An error occurred.');
            setMessage('');
        }
    };

    return (
        <div className="change-password">
            <div className="change-password-container">
                <h2>Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-3 change-password-form form-gestor-perfil">
                        <label htmlFor="currentPassword" className="form-label label-control-cp">Current Password</label>
                        <input
                            type="password"
                            className="form-control input-control-cp"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 form-gestor-perfil">
                        <label htmlFor="newPassword" className="form-label label-control-cp">New Password</label>
                        <input
                            type="password"
                            className="form-control input-control-cp"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 form-gestor-perfil">
                        <label htmlFor="confirmPassword" className="form-label label-control-cp">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control input-control-cp"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-danger">{error}</div>}
                    {message && <div className="text-success">{message}</div>}
                    <button type="submit" className="btn gestor-perfil-edit btn-margin-control-cp">Reset Password</button>
                </form>
            </div>
        </div>
    );
};