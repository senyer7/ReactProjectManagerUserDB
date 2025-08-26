import { createPortal } from "react-dom";
import { forwardRef, useImperativeHandle, useRef } from "react";

const Modal = forwardRef(function Modal({ children, onClose }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  function handleClose() {
    if (onClose) {
      onClose();
    }
    dialog.current.close();
  }

  return createPortal(
    <div className="modal-overlay">
      <dialog ref={dialog} className="modal-dialog" onClose={handleClose}>
        <div className="modal-content">
          {children}
          <div className="mt-6 text-center">
            <button onClick={handleClose} className="btn-primary">
              Закрыть
            </button>
          </div>
        </div>
      </dialog>
    </div>,
    document.getElementById("modal-root")
  );
});

export default Modal;
