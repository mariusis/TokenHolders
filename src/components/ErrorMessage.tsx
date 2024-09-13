// ErrorComponent.tsx
import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";

interface ErrorComponentProps {
  error?: Error;
  resetErrorBoundary: () => void;
}

const ErrorMessage: React.FC<ErrorComponentProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const [openModal, setOpenModal] = useState(true);
  const modalSize = "xl";

  useEffect(() => {
    if (!openModal) {
    }
  }, [openModal]);

  return (
    <Modal
      show={openModal}
      size={modalSize}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header>Something went wrong</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6">
          <p className="text-xl leading-relaxed font-bold  text-gray-500 dark:text-gray-400">
            The problem you are encountering seems to be related to:
          </p>
          <p className="text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            {error?.message}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => resetErrorBoundary()}>Try again</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorMessage;
