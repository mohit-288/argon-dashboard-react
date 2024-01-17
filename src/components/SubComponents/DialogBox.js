// DialogBox.js
import React from 'react';
import Modal from 'react-modal';

const DialogBox = ({ isOpen, onClose }) => {
  return (
    <Modal
    style={{width:"60px", height:"30px"}}
      isOpen={isOpen}
      //overlayClassName="modal-overlay"
      //onRequestClose={onClose}
      contentLabel="Example Modal"
    >
      <h2>Dialog Box Content</h2>
      {/* Add your dialog box content here */}
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default DialogBox;
