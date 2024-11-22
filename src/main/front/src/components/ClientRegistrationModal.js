import React from 'react';
import './ClientRegistrationModal.css';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
