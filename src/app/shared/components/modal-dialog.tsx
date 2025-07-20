"use client";
import { useEffect, useState } from "react";
import "./../../styles/modal-dialog.css";

export const ModalDialog = (modalParams: any) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const {
    title,
    message,
    hasOkButton = true,
    okButtonClass = "btn-danger",
    hasYesButton = false,
    yesButtonClass = "btn-success",
    hasNoButton = false,
    noButtonClass = "btn-danger",
    showModal,
    onOkButtonClick,
    onYesButtonClick,
    onNoButtonClick,
  } = modalParams;

  useEffect(() => {
    setIsShowModal(showModal);
  }, [showModal]);

  function okButtonClick() {
    setIsShowModal(false);
    if (onOkButtonClick) onOkButtonClick();
  }

  function yesButtonClick() {
    setIsShowModal(false);
    if (onYesButtonClick) onYesButtonClick();
  }

  function noButtonClick() {
    setIsShowModal(false);
    if (onNoButtonClick) onNoButtonClick();
  }

  return (
    <div
      id="customModal"
      className={isShowModal ? "modal-overlay d-flex" : "modal-overlay d-none"}
    >
      <div className="modal-content">
        <h5>{title}</h5>
        <p className="message">{message}</p>
        <div className="buttonsWrapper">
          {hasOkButton && (
            <button className={"btn " + okButtonClass} onClick={okButtonClick}>
              OK
            </button>
          )}
          {hasYesButton && (
            <button
              className={"btn " + yesButtonClass + " me-2"}
              onClick={yesButtonClick}
            >
              Yes
            </button>
          )}
          {hasNoButton && (
            <button className={"btn " + noButtonClass} onClick={noButtonClick}>
              No
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
